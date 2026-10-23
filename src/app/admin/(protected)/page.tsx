import { requireAdmin } from '@/lib/security/admin';
import { InfoPage } from '@/components/public/info-page';
import { ProposalForm, DecisionForm, EventForm } from '@/components/admin/forms';
import { logout } from '@/app/admin/login/actions';
import {
  SupabaseAggregateMetricsRepository,
  SupabaseAuditRepository,
} from '@/infrastructure/supabase/repositories';
import { z } from 'zod';
import { getEnvironment } from '@/lib/env';
const rowSchema = z.object({
  id: z.uuid(),
  version: z.number(),
  status: z.string(),
  requested_by: z.uuid(),
  beneficiary_legal_name: z.string(),
  beneficiary_document: z.string(),
  source_type: z.string(),
  expires_at: z.string(),
  approval_evidence_ref: z.string().nullable(),
});
export default async function AdminPage() {
  const env = getEnvironment();
  if (!env.ADMIN_ENABLED || env.DATA_BACKEND !== 'supabase') return null;
  const { client, profile } = await requireAdmin();
  const [proposals, metrics, audit, events] = await Promise.all([
    client
      .from('recipient_config_versions')
      .select(
        'id,version,status,requested_by,beneficiary_legal_name,beneficiary_document,source_type,expires_at,approval_evidence_ref',
      )
      .order('version', { ascending: false })
      .limit(20),
    new SupabaseAggregateMetricsRepository(client).listDaily(),
    profile.role === 'auditor' || profile.role === 'approver'
      ? new SupabaseAuditRepository(client).listRecent()
      : Promise.resolve([]),
    client
      .from('events')
      .select('id,title,status,event_date')
      .eq('fund_id', 'fundo-musical-itapevi')
      .order('event_date')
      .limit(20),
  ]);
  if (proposals.error || events.error) throw new Error('Dados administrativos indisponíveis.');
  const rows = z.array(rowSchema).parse(proposals.data);
  const eventRows = z
    .array(
      z.object({
        id: z.uuid(),
        title: z.string(),
        status: z.string(),
        event_date: z.string().nullable(),
      }),
    )
    .parse(events.data);
  return (
    <InfoPage
      eyebrow={`ÁREA RESTRITA · ${profile.role.toUpperCase()}`}
      title="Administração do Fundo Musical."
      intro="Configurações e decisões internas. Uma aprovação administrativa não ativa o Pix nem comprova a titularidade bancária."
    >
      <form action={logout}>
        <button className="button secondary">Encerrar sessão</button>
      </form>
      <div className="notice">
        <strong>Integração financeira não certificada</strong>
        <p>
          A emissão de Pix real permanece bloqueada em todas as modalidades desta versão. Métricas
          do portal não representam pagamentos.
        </p>
      </div>
      {profile.role === 'editor' && (
        <div className="admin-grid">
          <ProposalForm />
          <EventForm />
        </div>
      )}
      <h2>Versões de conta</h2>
      {rows.length === 0 ? (
        <p>Nenhuma proposta cadastrada.</p>
      ) : (
        rows.map((row) => (
          <article className="admin-card" key={row.id}>
            <h3>
              Versão {row.version} · {row.status}
            </h3>
            <p>
              {row.beneficiary_legal_name} · CNPJ {row.beneficiary_document}
              <br />
              Arranjo: {row.source_type}
              <br />
              Validade:{' '}
              {new Date(row.expires_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              <br />
              Evidência: {row.approval_evidence_ref ?? 'Pendente'}
            </p>
            {profile.role === 'approver' &&
              row.status === 'pending' &&
              row.requested_by !== profile.auth_user_id && <DecisionForm id={row.id} />}
          </article>
        ))
      )}
      <h2>Ensaios</h2>
      {eventRows.length ? (
        eventRows.map((event) => (
          <p key={event.id}>
            {event.title} · {event.event_date} · {event.status}
          </p>
        ))
      ) : (
        <p>Nenhum ensaio cadastrado. As datas não foram inventadas.</p>
      )}
      <h2>Métricas agregadas do portal</h2>
      <p>
        Coleta desativada neste piloto.{' '}
        {metrics.length
          ? `${metrics.length} registros administrativos existentes no backend.`
          : 'Sem dados disponíveis.'}{' '}
        Nenhum indicador financeiro é inferido de cliques.
      </p>
      {(profile.role === 'auditor' || profile.role === 'approver') && (
        <>
          <h2>Auditoria técnica</h2>
          {audit.length ? (
            audit.map((entry, index) => (
              <p key={index}>
                {entry.createdAt} · {entry.action} · {entry.resourceType} / {entry.resourceId}
              </p>
            ))
          ) : (
            <p>Nenhuma decisão auditada disponível.</p>
          )}
        </>
      )}
    </InfoPage>
  );
}
