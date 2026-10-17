/**
 * Einfaches Sliding-Window-Rate-Limit im Arbeitsspeicher.
 *
 * Gilt pro Node-Prozess. Bei mehreren Instanzen/Serverless-Umgebung muss der
 * Speicher durch Redis o. Ä. ersetzt werden (siehe docs/02-technik.md).
 */
export type RateResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

export class RateLimiter {
  private hits = new Map<string, number[]>();
  private lastSweep = 0;

  constructor(
    private max: number,
    private windowMs: number,
  ) {}

  check(key: string, now = Date.now()): RateResult {
    this.sweep(now);
    const windowStart = now - this.windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > windowStart);
    if (list.length >= this.max) {
      const oldest = list[0] ?? now;
      this.hits.set(key, list);
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000)) };
    }
    list.push(now);
    this.hits.set(key, list);
    return { allowed: true, remaining: this.max - list.length, retryAfterSeconds: 0 };
  }

  private sweep(now: number) {
    if (now - this.lastSweep < 60_000) return;
    this.lastSweep = now;
    const windowStart = now - this.windowMs;
    for (const [key, list] of this.hits) {
      const fresh = list.filter((t) => t > windowStart);
      if (fresh.length) this.hits.set(key, fresh);
      else this.hits.delete(key);
    }
  }
}
