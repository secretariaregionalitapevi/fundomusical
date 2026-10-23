import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DEMO_PAYLOAD } from '../../src/domain/offering/model';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
test.use({ serviceWorkers: 'block' });
async function demo(page: import('@playwright/test').Page, lifetime = 60000) {
  await page.route('**/api/health', (route) =>
    route.fulfill({ json: { status: 'ok', service: 'fundo-musical' } }),
  );
  await page.route('**/api/offering', (route) =>
    route.fulfill({
      json: {
        kind: 'demo',
        payload: DEMO_PAYLOAD,
        purposeCode: 'FUNDO_MUSICAL',
        expiresAt: new Date(Date.now() + lifetime).toISOString(),
      },
    }),
  );
}
test('uma tela azul e branca, logo CCB, QR visível e sem login ou navegação institucional', async ({
  page,
}) => {
  await demo(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fundo Musical');
  await expect(
    page.getByRole('img', { name: 'Congregação Cristã no Brasil', exact: true }),
  ).toBeVisible();
  const qr = page.getByRole('img', { name: 'QR Code de demonstração, não pagável' });
  await expect(qr).toBeVisible();
  const encoded = await qr.getAttribute('src');
  const png = PNG.sync.read(Buffer.from(encoded!.split(',')[1], 'base64'));
  expect(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data).toBe(DEMO_PAYLOAD);
  await expect(page.getByRole('button', { name: 'Copiar código de teste' })).toBeVisible();
  await expect(page.locator('nav,input[type=password]')).toHaveCount(0);
  await expect(page.locator('.hero,.faq-section,.purpose-section')).toHaveCount(0);
  expect(await page.locator('a[href*="oferta"]').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test('copia o mesmo texto e orienta abrir o banco sem alegar pagamento', async ({ page }) => {
  await demo(page);
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          (window as unknown as { copied: string }).copied = value;
        },
      },
    }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Copiar código de teste' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Agora é no seu banco' })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe(
    DEMO_PAYLOAD,
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('negação de clipboard oferece seleção manual do código', async ({ page }) => {
  await demo(page);
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw Error('denied');
        },
      },
    }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Copiar código de teste' }).click();
  await expect(page.getByText('Selecione o código abaixo e copie manualmente.')).toBeVisible();
  await expect(page.locator('#pix-code')).toHaveValue(DEMO_PAYLOAD);
  await page.getByRole('button', { name: 'Selecionar código' }).click();
  await expect(page.locator('#pix-code')).toBeFocused();
});
test('offline remove QR e código; retorno online revalida', async ({ page, context }) => {
  await demo(page);
  await page.goto('/');
  await expect(page.locator('.qr-frame img')).toBeVisible();
  await context.setOffline(true);
  await page.evaluate(() => dispatchEvent(new Event('offline')));
  await expect(page.locator('.qr-frame img')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Você está sem conexão' })).toBeVisible();
  await context.setOffline(false);
  await page.evaluate(() => dispatchEvent(new Event('online')));
  await expect(page.locator('.qr-frame img')).toBeVisible();
});
test('health indisponível e expiração não deixam copiar', async ({ page }) => {
  await page.route('**/api/health', (route) =>
    route.fulfill({ status: 503, json: { status: 'error' } }),
  );
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Não foi possível carregar o Pix' }),
  ).toBeVisible();
  await expect(page.locator('.copy-pix,.qr-frame img')).toHaveCount(0);
  await page.unroute('**/api/health');
  await demo(page, 1000);
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('heading', { name: 'Atualize o QR Code' })).toBeVisible();
  await expect(page.locator('.copy-pix,.qr-frame img')).toHaveCount(0);
});
test('admin bloqueado e dados financeiros sem cache ou paid por visitante', async ({ request }) => {
  for (const path of ['/admin', '/admin/login']) {
    const r = await request.get(path);
    expect(r.status()).toBe(404);
    expect(r.headers()['cache-control']).toContain('no-store');
  }
  const response = await request.get('/api/offering');
  expect(response.headers()['cache-control']).toContain('no-store');
  expect(await response.json()).toEqual({ kind: 'unavailable', reason: 'not_configured' });
  expect((await request.post('/api/offering', { data: { paid: true } })).status()).toBe(405);
});
test('320px, teclado e ajuda acessível', async ({ page }) => {
  await demo(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Como fazer o Pix' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Entendi' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('CSP bloqueia HTML injetado e query de roteador não redireciona a outro destino', async ({
  page,
  request,
}) => {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        '</body>',
        '<script>window.xssExecuted=true</script></body>',
      ),
    });
  });
  await page.goto('/?origem=wifi&next=https://example.com');
  expect(await page.evaluate(() => 'xssExecuted' in window)).toBe(false);
  const response = await request.get('/?dst=https://example.com');
  expect(response.headers().location).toBeUndefined();
  expect(response.headers()['content-security-policy']).toContain('nonce-');
});
test.describe('Service worker real', () => {
  test.use({ serviceWorkers: 'allow' });
  test('orientação offline, sem Pix persistido, e reconexão', async ({ page, context }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    await context.setOffline(true);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sem conexão.');
    const urls = await page.evaluate(async () => {
      const names = await caches.keys();
      return (
        await Promise.all(
          names.map(async (n) => (await (await caches.open(n)).keys()).map((r) => r.url)),
        )
      ).flat();
    });
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((url) => /\/(offline\.html|icons\/[^/]+)$/.test(url))).toBe(true);
    await context.setOffline(false);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Pix ainda não configurado' })).toBeVisible();
  });
});
