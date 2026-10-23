import { expect, it } from 'vitest';
import { envSchema } from '@/lib/env';
import { formatBRL } from '@/lib/formatting';
import { safeRedirect } from '@/lib/security/redirect';
import { contentSecurityPolicy } from '@/lib/security/headers';
it('configuração padrão não ativa Pix ou admin', () => {
  const env = envSchema.parse({});
  expect(env.OFFERING_MODE).toBe('disabled');
  expect(env.ADMIN_ENABLED).toBe(false);
  expect(env.DEMO_ENABLED).toBe(false);
});
it.each([{ FUND_PURPOSE_CODE: 'OFERTAS' }, { FUND_ID: 'outro' }, { REGIONAL_ID: 'outra' }])(
  'recusa alteração de destinação %j',
  (input) => expect(envSchema.safeParse(input).success).toBe(false),
);
it('formata reais em centavos, rejeitando imprecisão', () => {
  expect(formatBRL(12345).replace(/\s/g, ' ')).toBe('R$ 123,45');
  expect(() => formatBRL(1.23)).toThrow();
});
it.each([
  'https://example.com',
  '//example.com',
  '/admin?next=https://example.com',
  '/%2f%2fevil',
  'javascript:alert(1)',
])('impede open redirect %s', (path) => expect(safeRedirect(path)).toBe('/'));
it('CSP de produção usa nonce sem eval e sem inline genérico', () => {
  const csp = contentSecurityPolicy('fixture', false);
  expect(csp).toContain("'nonce-fixture'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain('unsafe-inline');
  expect(csp).not.toContain('unsafe-eval');
});
