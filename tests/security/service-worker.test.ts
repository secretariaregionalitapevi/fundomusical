import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
it('worker antigo remove cache obsoleto; API, admin e RSC são exclusivamente rede', async () => {
  const listeners: Record<string, (event: unknown) => void> = {};
  const fetch = (await import('vitest')).vi.fn().mockResolvedValue(new Response('ok'));
  const caches = {
    keys: async () => ['fundo-musical-shell-v0', 'fundo-musical-shell-v2', 'outro-app'],
    delete: (await import('vitest')).vi.fn().mockResolvedValue(true),
  };
  vm.runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: {
      location: { origin: 'https://example.test' },
      clients: { claim: async () => {} },
      addEventListener: (type: string, fn: (event: unknown) => void) => {
        listeners[type] = fn;
      },
    },
    caches,
    fetch,
    URL,
    Response,
    Set,
  });
  let promise: Promise<unknown> = Promise.resolve();
  listeners.activate({
    waitUntil: (p: Promise<unknown>) => {
      promise = p;
    },
  });
  await promise;
  expect(caches.delete).toHaveBeenCalledExactlyOnceWith('fundo-musical-shell-v0');
  for (const path of ['/api/offering', '/api/health', '/admin', '/admin/login', '/?_rsc=1']) {
    listeners.fetch({
      request: new Request(`https://example.test${path}`),
      respondWith: (p: Promise<unknown>) => {
        promise = p;
      },
    });
    await promise;
    expect(fetch).toHaveBeenLastCalledWith(expect.any(Request), { cache: 'no-store' });
  }
});
