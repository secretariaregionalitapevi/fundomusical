import { afterEach, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/offering/route';
import { DEMO_PAYLOAD } from '@/domain/offering/model';
afterEach(() => vi.unstubAllEnvs());
it('API permite somente código fixo não pagável em desenvolvimento explícito', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('DEMO_ENABLED', 'true');
  const response = await GET();
  expect(response.headers.get('cache-control')).toContain('no-store');
  expect(await response.json()).toMatchObject({ kind: 'demo', payload: DEMO_PAYLOAD });
});
it.each(['disabled', 'fund_dynamic_pix', 'fund_bank_integration'])(
  'nenhuma flag de modo %s ativa Pix ou demo em produção',
  async (mode) => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('DEMO_ENABLED', 'true');
    vi.stubEnv('OFFERING_MODE', mode);
    const response = await GET();
    expect(await response.json()).toEqual({ kind: 'unavailable', reason: 'not_configured' });
  },
);
it('configuração financeira inválida falha fechada, sem dados sensíveis na resposta', async () => {
  vi.stubEnv('FUND_PURPOSE_CODE', 'OFERTAS_REGULARES');
  const response = await GET();
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({ kind: 'unavailable', reason: 'error' });
});
