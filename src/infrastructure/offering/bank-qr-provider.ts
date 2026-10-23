import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { OfferingProvider } from '@/application/ports';
import { assertFund, type OfferingContext, type OfferingResult } from '@/domain/offering/model';
import { validateBankQr } from '@/domain/offering/bank-qr';

export const bankQrConfigSchema = z.object({
  enabled: z.boolean(),
  fundId: z.literal('fundo-musical-itapevi'),
  purposeCode: z.literal('FUNDO_MUSICAL'),
  beneficiaryName: z.string().min(3).max(140),
  beneficiaryDocument: z.string().nullable(),
  bankName: z.string().max(80),
  pixKey: z.string().min(1).max(140),
  payload: z.string().max(512),
  payloadSha256: z.string().regex(/^[a-f0-9]{64}$/),
  source: z.string().min(3),
});
/** Reapresenta exatamente o QR fornecido pelo usuário; não integra ou opera o banco. */
export class BankQrOfferingProvider implements OfferingProvider {
  async getOffering(context: OfferingContext): Promise<OfferingResult> {
    assertFund(context);
    const source: unknown = JSON.parse(
      await readFile(join(process.cwd(), 'config/fundo-musical.json'), 'utf8'),
    );
    const config = bankQrConfigSchema.parse(source);
    if (!config.enabled) return { kind: 'unavailable', reason: 'not_configured' };
    if (createHash('sha256').update(config.payload).digest('hex') !== config.payloadSha256)
      throw new Error('QR alterado.');
    validateBankQr(config.payload, config.pixKey);
    return {
      kind: 'ready',
      payload: config.payload,
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      purposeCode: 'FUNDO_MUSICAL',
      beneficiaryName: config.beneficiaryName,
      beneficiaryDocument: config.beneficiaryDocument,
      bankName: config.bankName,
    };
  }
}
