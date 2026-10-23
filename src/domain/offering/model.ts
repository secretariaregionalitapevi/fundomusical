import { z } from 'zod';

export const FUND = {
  id: 'fundo-musical-itapevi',
  purposeCode: 'FUNDO_MUSICAL',
  regionalId: 'regional-itapevi',
} as const;
export const DEMO_PAYLOAD = 'SIMULACAO-NAO-PAGAVEL:FUNDO_MUSICAL:SEM-VALOR-BANCARIO';
export const offeringResultSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('unavailable'),
    reason: z.enum(['not_configured', 'pending', 'expired', 'integration_not_certified', 'error']),
  }),
  z.object({
    kind: z.literal('demo'),
    payload: z.literal(DEMO_PAYLOAD),
    expiresAt: z.iso.datetime(),
    purposeCode: z.literal('FUNDO_MUSICAL'),
  }),
  z.object({
    kind: z.literal('ready'),
    payload: z.string().min(40).max(512),
    expiresAt: z.iso.datetime(),
    purposeCode: z.literal('FUNDO_MUSICAL'),
    beneficiaryName: z.string().min(3).max(140),
    beneficiaryDocument: z.string().nullable(),
    bankName: z.string().max(80),
  }),
]);
export type OfferingResult = z.infer<typeof offeringResultSchema>;
export type OfferingContext = typeof FUND & { eventId?: string };
export function assertFund(context: OfferingContext) {
  if (
    context.id !== FUND.id ||
    context.purposeCode !== FUND.purposeCode ||
    context.regionalId !== FUND.regionalId
  ) {
    throw new Error('Destinação financeira incompatível.');
  }
}
