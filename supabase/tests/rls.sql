-- Executar via psql em banco LOCAL descartável após migration + seed.
begin;
do $$
declare missing integer;
begin
  select count(*) into missing from pg_tables where schemaname='public' and tablename in ('funds','events','admin_profiles','recipient_config_versions','recipient_change_approvals','audit_events','aggregate_metrics_daily') and not rowsecurity;
  if missing <> 0 then raise exception 'RLS ausente'; end if;
  if has_table_privilege('anon','public.recipient_config_versions','select') then raise exception 'Conta exposta a anon'; end if;
  if has_table_privilege('authenticated','public.recipient_config_versions','update') then raise exception 'Atualização direta permitida'; end if;
  if has_table_privilege('authenticated','public.admin_profiles','insert') then raise exception 'Escalação permitida'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111","aal":"aal1","role":"authenticated"}',true);
do $$ begin
  if exists(select 1 from public.recipient_config_versions) then raise exception 'AAL1 acessou conta'; end if;
  if public.has_admin_role(array['approver']::public.admin_role[]) then raise exception 'Perfil não autorizado'; end if;
  begin
    perform public.decide_recipient('11111111-1111-4111-8111-111111111111',true,'fixture',true);
    raise exception 'RPC autorizou AAL1';
  exception when raise_exception then if SQLERRM <> 'forbidden' then raise; end if; end;
end $$;
rollback;
