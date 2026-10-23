'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/admin';
import { assertSameOrigin } from '@/app/admin/login/actions';
import { proposalSchema, eventSchema } from '@/lib/validation/admin';

export async function proposeRecipient(_state: { message: string }, form: FormData) {
  await assertSameOrigin();
  const { client } = await requireAdmin(['editor']);
  const parsed = proposalSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      message:
        'Confira os campos. CNPJ deve ter 14 posições sem pontuação e validade deve estar no futuro.',
    };
  const p = parsed.data;
  const { error } = await client.rpc('propose_recipient', {
    legal_name: p.beneficiaryLegalName,
    document_number: p.beneficiaryDocument,
    key_value: p.pixKey,
    arrangement: p.sourceType,
    valid_until: new Date(p.expiresAt).toISOString(),
    evidence_ref: p.evidence,
  });
  if (error)
    return { message: 'Proposta não registrada. Confira permissões e configuração do banco.' };
  revalidatePath('/admin');
  return {
    message:
      'Proposta registrada para revisão por outro operador. A emissão real de Pix continua bloqueada.',
  };
}
export async function decideRecipient(_state: { message: string }, form: FormData) {
  await assertSameOrigin();
  const { client } = await requireAdmin(['approver']);
  const parsed = z
    .object({
      id: z.uuid(),
      decision: z.enum(['approved', 'rejected']),
      evidence: z.string().trim().min(4).max(200),
      segregation: z.enum(['on']).optional(),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { message: 'Informe uma referência de evidência e uma decisão válida.' };
  const p = parsed.data;
  if (p.decision === 'approved' && !p.segregation)
    return { message: 'A segregação financeira precisa ter evidência de homologação.' };
  const { error } = await client.rpc('decide_recipient', {
    config_id: p.id,
    approve: p.decision === 'approved',
    evidence_ref: p.evidence,
    segregation_verified: p.segregation === 'on',
  });
  if (error)
    return {
      message:
        'Decisão não registrada. Não é permitido aprovar a própria alteração ou rever uma proposta encerrada.',
    };
  revalidatePath('/admin');
  return {
    message: 'Decisão auditada. Uma aprovação administrativa não ativa a integração bancária.',
  };
}
export async function createEvent(_state: { message: string }, form: FormData) {
  await assertSameOrigin();
  const { client } = await requireAdmin(['editor']);
  const parsed = eventSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { message: 'Confira título, data e região.' };
  const { error } = await client.rpc('create_music_event', {
    event_title: parsed.data.title,
    event_day: parsed.data.date,
    event_region: parsed.data.region,
  });
  if (error) return { message: 'Ensaio não registrado.' };
  revalidatePath('/admin');
  return { message: 'Ensaio registrado em rascunho, sem publicação pública.' };
}
