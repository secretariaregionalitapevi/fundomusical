import 'server-only';
import { createHmac, randomBytes } from 'node:crypto';

/** Defesa adicional de processo para autenticação de operadores.
 * Sem IP, log ou persistência. Não substitui rate limit distribuído de Auth/WAF. */
export class AdminAttemptLimiter {
  private readonly salt = randomBytes(32);
  private readonly attempts = new Map<string, { count: number; until: number }>();
  constructor(
    private readonly limit = 8,
    private readonly windowMs = 10 * 60_000,
    private readonly maxEntries = 1000,
  ) {}
  take(scope: string, subject: string, now = Date.now()): boolean {
    for (const [key, entry] of this.attempts) if (entry.until <= now) this.attempts.delete(key);
    const key = createHmac('sha256', this.salt)
      .update(`${scope}:${subject.trim().toLowerCase()}`)
      .digest('hex');
    const existing = this.attempts.get(key);
    if (existing) {
      if (existing.count >= this.limit) return false;
      existing.count += 1;
      return true;
    }
    if (this.attempts.size >= this.maxEntries) return false;
    this.attempts.set(key, { count: 1, until: now + this.windowMs });
    return true;
  }
}
export const adminAttempts = new AdminAttemptLimiter();
