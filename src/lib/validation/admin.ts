import { z } from 'zod';
import { cnpjFormatSchema } from './cnpj';
export const proposalSchema = z.object({
  beneficiaryLegalName: z.string().trim().min(3).max(140),
  beneficiaryDocument: cnpjFormatSchema,
  pixKey: z.string().trim().min(1).max(140),
  sourceType: z.enum(['dedicated_account', 'classified_dynamic']),
  expiresAt: z
    .string()
    .refine(
      (v) => Number.isFinite(Date.parse(v)) && Date.parse(v) > Date.now(),
      'Informe uma validade futura.',
    ),
  evidence: z.string().trim().min(4).max(200),
});
export const eventSchema = z.object({
  title: z.string().trim().min(4).max(140),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  region: z.string().trim().min(2).max(100),
});
