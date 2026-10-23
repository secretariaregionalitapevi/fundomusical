import { z } from 'zod';
import { cnpjFormatSchema } from '@/lib/validation/cnpj';

export const recipientSchema = z.object({
  id: z.uuid(),
  fundId: z.literal('fundo-musical-itapevi'),
  purposeCode: z.literal('FUNDO_MUSICAL'),
  regionalId: z.literal('regional-itapevi'),
  beneficiaryLegalName: z.string().min(3).max(140),
  beneficiaryDocument: cnpjFormatSchema,
  pixKey: z.string().min(1).max(140),
  bankName: z.string().max(100).optional(),
  sourceType: z.enum(['dedicated_account', 'classified_dynamic']),
  status: z.enum(['draft', 'pending', 'approved', 'unavailable']),
  requestedBy: z.uuid(),
  approvedBy: z.uuid().nullable(),
  approvalEvidenceRef: z.string().min(1).max(200).nullable(),
  approvedAt: z.iso.datetime().nullable(),
  expiresAt: z.iso.datetime(),
  version: z.number().int().positive(),
  checksum: z.string().regex(/^[a-f0-9]{64}$/),
  segregationApproved: z.boolean(),
});
export type RecipientConfiguration = z.infer<typeof recipientSchema>;
export type RecipientStatus = 'not_configured' | 'pending' | 'approved' | 'unavailable' | 'expired';
export function recipientStatus(value: unknown, now = new Date()): RecipientStatus {
  if (value == null) return 'not_configured';
  const parsed = recipientSchema.safeParse(value);
  if (!parsed.success) return 'unavailable';
  const config = parsed.data;
  if (config.status === 'unavailable') return 'unavailable';
  if (config.status !== 'approved') return 'pending';
  if (new Date(config.expiresAt) <= now) return 'expired';
  if (
    !config.approvedAt ||
    new Date(config.approvedAt) > now ||
    !config.approvedBy ||
    config.approvedBy === config.requestedBy ||
    !config.approvalEvidenceRef ||
    !config.segregationApproved
  )
    return 'unavailable';
  return 'approved';
}
