import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type {
  RecipientConfigurationRepository,
  EventRepository,
  AggregateMetricsRepository,
  AuditRepository,
} from '@/application/ports';
import { recipientSchema } from '@/domain/recipient/model';

const recipientRow = z.object({
  id: z.uuid(),
  fund_id: z.literal('fundo-musical-itapevi'),
  purpose_code: z.literal('FUNDO_MUSICAL'),
  regional_id: z.literal('regional-itapevi'),
  beneficiary_legal_name: z.string(),
  beneficiary_document: z.string(),
  pix_key: z.string(),
  source_type: z.enum(['dedicated_account', 'classified_dynamic']),
  status: z.enum(['draft', 'pending', 'approved', 'unavailable']),
  requested_by: z.uuid(),
  approved_by: z.uuid().nullable(),
  approval_evidence_ref: z.string().nullable(),
  approved_at: z.string().nullable(),
  expires_at: z.string(),
  version: z.number(),
  checksum: z.string(),
  segregation_approved: z.boolean(),
});
function iso(value: string | null) {
  return value ? new Date(value).toISOString() : null;
}
export class SupabaseRecipientConfigurationRepository implements RecipientConfigurationRepository {
  constructor(private readonly client: SupabaseClient) {}
  async getActive() {
    const { data, error } = await this.client
      .from('recipient_config_versions')
      .select('*')
      .eq('fund_id', 'fundo-musical-itapevi')
      .eq('status', 'approved')
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error('Configuração indisponível.');
    if (!data) return null;
    const r = recipientRow.parse(data);
    return recipientSchema.parse({
      id: r.id,
      fundId: r.fund_id,
      purposeCode: r.purpose_code,
      regionalId: r.regional_id,
      beneficiaryLegalName: r.beneficiary_legal_name,
      beneficiaryDocument: r.beneficiary_document,
      pixKey: r.pix_key,
      sourceType: r.source_type,
      status: r.status,
      requestedBy: r.requested_by,
      approvedBy: r.approved_by,
      approvalEvidenceRef: r.approval_evidence_ref,
      approvedAt: iso(r.approved_at),
      expiresAt: iso(r.expires_at),
      version: r.version,
      checksum: r.checksum,
      segregationApproved: r.segregation_approved,
    });
  }
}
const eventRow = z.object({
  id: z.uuid(),
  fund_id: z.literal('fundo-musical-itapevi'),
  title: z.string(),
  event_date: z.string().nullable(),
  region: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
});
export class SupabaseEventRepository implements EventRepository {
  constructor(private readonly client: SupabaseClient) {}
  async listPublished() {
    const { data, error } = await this.client
      .from('events')
      .select('id,fund_id,title,event_date,region,status')
      .eq('fund_id', 'fundo-musical-itapevi')
      .eq('status', 'published')
      .order('event_date');
    if (error) throw new Error('Agenda indisponível.');
    return z
      .array(eventRow)
      .parse(data)
      .map((e) => ({
        id: e.id,
        fundId: e.fund_id,
        title: e.title,
        date: e.event_date,
        region: e.region,
        status: e.status,
      }));
  }
}
const metricRow = z.object({
  day: z.string(),
  event_id: z.string().nullable(),
  channel: z.enum(['direct', 'qr', 'nfc', 'whatsapp']),
  page_views: z.number().int().nonnegative(),
  copy_clicks: z.number().int().nonnegative(),
});
export class SupabaseAggregateMetricsRepository implements AggregateMetricsRepository {
  constructor(private readonly client: SupabaseClient) {}
  async listDaily() {
    const { data, error } = await this.client
      .from('aggregate_metrics_daily')
      .select('day,event_id,channel,page_views,copy_clicks')
      .eq('fund_id', 'fundo-musical-itapevi')
      .order('day', { ascending: false })
      .limit(31);
    if (error) throw new Error('Métricas indisponíveis.');
    return z
      .array(metricRow)
      .parse(data)
      .map((m) => ({
        day: m.day,
        eventId: m.event_id,
        channel: m.channel,
        pageViews: m.page_views,
        copyClicks: m.copy_clicks,
      }));
  }
}
const auditRow = z.object({
  actor: z.string(),
  action: z.string(),
  resource_type: z.string(),
  resource_id: z.string(),
  created_at: z.string(),
});
export class SupabaseAuditRepository implements AuditRepository {
  constructor(private readonly client: SupabaseClient) {}
  async listRecent() {
    const { data, error } = await this.client
      .from('audit_events')
      .select('actor,action,resource_type,resource_id,created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw new Error('Auditoria indisponível.');
    return z
      .array(auditRow)
      .parse(data)
      .map((a) => ({
        actor: a.actor,
        action: a.action,
        resourceType: a.resource_type,
        resourceId: a.resource_id,
        createdAt: a.created_at,
      }));
  }
}
