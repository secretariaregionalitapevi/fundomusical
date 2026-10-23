import { describe, expect, it } from 'vitest';
import {
  DisabledOfferingProvider,
  FundMusicBankIntegration,
  MockOfferingProvider,
} from '@/infrastructure/offering/providers';
import { getOffering } from '@/application/use-cases/get-offering';
import { DEMO_PAYLOAD, FUND, type OfferingContext } from '@/domain/offering/model';
import { reconciledTotal } from '@/domain/offering/reconciliation';
import { recipient } from '../fixtures/recipient';
describe('Emissão restrita ao Fundo Musical', () => {
  it('padrão desabilitado', async () =>
    expect(await getOffering(new DisabledOfferingProvider())).toEqual({
      kind: 'unavailable',
      reason: 'not_configured',
    }));
  it('demo não é um BR Code e nunca está disponível em produção', async () => {
    expect(await getOffering(new MockOfferingProvider('development'))).toMatchObject({
      kind: 'demo',
      payload: DEMO_PAYLOAD,
    });
    expect(DEMO_PAYLOAD.startsWith('000201')).toBe(false);
    expect(await getOffering(new MockOfferingProvider('production'))).toMatchObject({
      kind: 'unavailable',
    });
  });
  it.each([
    null,
    recipient({ status: 'draft' }),
    recipient({ status: 'pending' }),
    recipient({ expiresAt: '2020-01-01T00:00:00.000Z' }),
    recipient({ segregationApproved: false }),
    recipient(),
  ])('não libera sem certificação bancária', async (config) => {
    const provider = new FundMusicBankIntegration({ getActive: async () => config });
    const result = await getOffering(provider);
    expect(result.kind).toBe('unavailable');
    expect(result).not.toHaveProperty('payload');
  });
  it.each(['id', 'purposeCode', 'regionalId'])(
    'bloqueia contexto financeiro alterado em %s',
    async (field) => {
      await expect(
        new DisabledOfferingProvider().getOffering({
          ...FUND,
          [field]: 'OFERTAS_REGULARES',
        } as unknown as OfferingContext),
      ).rejects.toThrow('Destinação');
    },
  );
  it('não mistura ofertas regulares nem lançamentos pendentes na conciliação', () => {
    const batches = [
      {
        fundId: FUND.id,
        purposeCode: FUND.purposeCode,
        amountCents: 100,
        status: 'reconciled' as const,
      },
      {
        fundId: 'regular',
        purposeCode: 'OFERTA_REGULAR',
        amountCents: 999,
        status: 'reconciled' as const,
      },
      {
        fundId: FUND.id,
        purposeCode: 'OFERTA_REGULAR',
        amountCents: 999,
        status: 'reconciled' as const,
      },
      {
        fundId: FUND.id,
        purposeCode: FUND.purposeCode,
        amountCents: 500,
        status: 'pending' as const,
      },
    ];
    expect(reconciledTotal(batches, FUND.id)).toBe(100);
    expect(() => reconciledTotal(batches, 'regular')).toThrow();
  });
});
