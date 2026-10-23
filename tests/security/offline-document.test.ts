import { expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
it('documento offline tem hash CSP correto e não contém script ou código bancário', () => {
  const html = readFileSync('public/offline.html', 'utf8');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  expect(css).toBeTruthy();
  expect(html).toContain(`sha256-${createHash('sha256').update(css!).digest('base64')}`);
  expect(html).not.toMatch(/<script|000201|SIMULACAO-NAO-PAGAVEL/);
});
