import { expect, it } from 'vitest';
import { AdminAttemptLimiter } from '@/lib/security/rate-limit';
it('limita tentativas do operador por janela, normaliza conta e limita memória', () => {
  const limiter = new AdminAttemptLimiter(2, 1000, 2);
  expect(limiter.take('password', 'EXEMPLO@TEST.INVALID', 0)).toBe(true);
  expect(limiter.take('password', ' exemplo@test.invalid ', 1)).toBe(true);
  expect(limiter.take('password', 'exemplo@test.invalid', 2)).toBe(false);
  expect(limiter.take('password', 'outro@test.invalid', 2)).toBe(true);
  expect(limiter.take('password', 'terceiro@test.invalid', 3)).toBe(false);
  expect(limiter.take('password', 'exemplo@test.invalid', 1001)).toBe(true);
});
