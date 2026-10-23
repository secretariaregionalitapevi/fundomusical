import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';

// PostgreSQL real em WASM. As duas funções auth são fixtures de claims,
// não um substituto da verificação JWT e do Auth no ambiente Supabase.
const editor = '22222222-2222-4222-8222-222222222222';
const approver = '33333333-3333-4333-8333-333333333333';
let db: PGlite;
async function asUser(id: string, aal = 'aal2') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: id, role: 'authenticated', aal }),
  ]);
  await db.exec('set role authenticated');
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb) $$;
    grant usage on schema auth, public to anon, authenticated;
  `);
  await db.exec(await readFile('supabase/migrations/202610230001_core.sql', 'utf8'));
  await db.exec(await readFile('supabase/seed.sql', 'utf8'));
  await db.query('insert into auth.users(id) values($1),($2)', [editor, approver]);
  await db.query(
    "insert into public.admin_profiles(auth_user_id,role,status) values($1,'editor','active'),($2,'approver','active')",
    [editor, approver],
  );
}, 30000);
afterAll(async () => {
  await db?.close();
});
describe('PostgreSQL: migrações, RLS e decisões', () => {
  let configId = '';
  it('aplica migration + seed e teste SQL de negação', async () => {
    await db.exec(await readFile('supabase/tests/rls.sql', 'utf8'));
    const result = await db.query<{ count: number }>(
      "select count(*)::integer as count from pg_tables where schemaname='public' and rowsecurity",
    );
    expect(result.rows[0].count).toBe(7);
  });
  it('anon não consegue ler configurações nem chamar RPC', async () => {
    await db.exec('set role anon');
    await expect(db.query('select * from public.recipient_config_versions')).rejects.toThrow(
      'permission denied',
    );
    await expect(
      db.query(
        "select public.propose_recipient('FIXTURE','00000000000000','SIMULACAO-NAO-PAGAVEL','dedicated_account','2099-01-01','FIXTURE')",
      ),
    ).rejects.toThrow('permission denied');
    await db.exec('reset role');
  });
  it('editor sem MFA não pode propor', async () => {
    await asUser(editor, 'aal1');
    await expect(
      db.query(
        "select public.propose_recipient('FIXTURE','00000000000000','SIMULACAO-NAO-PAGAVEL','dedicated_account','2099-01-01','FIXTURE')",
      ),
    ).rejects.toThrow('forbidden');
  });
  it('editor com MFA cria proposta e não consegue alterar conta ou próprio perfil diretamente', async () => {
    await asUser(editor);
    const result = await db.query<{ id: string }>(
      "select public.propose_recipient('FIXTURE NAO REAL','00000000000000','SIMULACAO-NAO-PAGAVEL','dedicated_account','2099-01-01','FIXTURE-EVIDENCE') as id",
    );
    configId = result.rows[0].id;
    await expect(
      db.query("update public.recipient_config_versions set pix_key='TROCADA'"),
    ).rejects.toThrow('permission denied');
    await expect(db.query("update public.admin_profiles set role='approver'")).rejects.toThrow(
      'permission denied',
    );
  });
  it('mesmo usuário não aprova a própria proposta, ainda que receba role de aprovador', async () => {
    await db.exec('reset role');
    await db.query("update public.admin_profiles set role='approver' where auth_user_id=$1", [
      editor,
    ]);
    await asUser(editor);
    await expect(
      db.query('select public.decide_recipient($1,true,$2,true)', [configId, 'FIXTURE-REVIEW']),
    ).rejects.toThrow('invalid decision');
    await db.exec('reset role');
    await db.query("update public.admin_profiles set role='editor' where auth_user_id=$1", [
      editor,
    ]);
  });
  it('outro aprovador não pode aprovar segregação não homologada', async () => {
    await asUser(approver);
    await expect(
      db.query('select public.decide_recipient($1,true,$2,false)', [configId, 'FIXTURE-REVIEW']),
    ).rejects.toThrow('unapproved segregation');
  });
  it('outra pessoa aprova; decisão e auditoria são persistidas juntas', async () => {
    await asUser(approver);
    await db.query('select public.decide_recipient($1,true,$2,true)', [configId, 'FIXTURE-REVIEW']);
    const result = await db.query<{ status: string; approved_by: string }>(
      'select status,approved_by from public.recipient_config_versions where id=$1',
      [configId],
    );
    expect(result.rows[0]).toEqual({ status: 'approved', approved_by: approver });
    expect(
      (await db.query("select * from public.audit_events where action='recipient.decided'")).rows,
    ).toHaveLength(1);
    expect((await db.query('select * from public.recipient_change_approvals')).rows).toHaveLength(
      1,
    );
  });
  it('decisão encerrada não pode ser reescrita e perfil revogado não tem acesso', async () => {
    await expect(
      db.query('select public.decide_recipient($1,false,$2,false)', [configId, 'FIXTURE-RETRY']),
    ).rejects.toThrow('invalid decision');
    await db.exec('reset role');
    await db.query("update public.admin_profiles set status='inactive' where auth_user_id=$1", [
      approver,
    ]);
    await asUser(approver);
    expect((await db.query('select * from public.recipient_config_versions')).rows).toHaveLength(0);
    await expect(
      db.query('select public.decide_recipient($1,false,$2,false)', [configId, 'FIXTURE-RETRY']),
    ).rejects.toThrow('forbidden');
  });
  it('fundo regular não entra no banco do piloto; migration financeira fica isolada e com RLS', async () => {
    await db.exec('reset role');
    await expect(
      db.query(
        "insert into public.funds(id,purpose_code,description) values('regular','OFERTAS','INVALIDO')",
      ),
    ).rejects.toThrow();
    await db.exec(await readFile('supabase/future/202610230002_financial_reporting.sql', 'utf8'));
    const tables = await db.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname='public' and rowsecurity and tablename like 'financial_%'",
    );
    expect(tables.rows).toHaveLength(2);
    await db.exec('set role anon');
    await expect(db.query('select * from public.financial_totals')).rejects.toThrow(
      'permission denied',
    );
    await db.exec('reset role');
  });
});
