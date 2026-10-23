import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
const origin = 'http://127.0.0.1:3200';
const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  windowsHide: true,
  stdio: 'ignore',
  env: {
    ...process.env,
    HOSTNAME: '127.0.0.1',
    PORT: '3200',
    NEXT_TELEMETRY_DISABLED: '1',
    OFFERING_MODE: 'fund_static_pix',
    DEMO_ENABLED: 'false',
  },
});
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`${origin}/api/health`, { signal: AbortSignal.timeout(1000) });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Aguarda apenas o servidor iniciado por este script. */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error('Servidor local não iniciou para captura.');
  await mkdir('artifacts/previews', { recursive: true });
  browser = await chromium.launch();
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 1000 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.goto(origin);
    await page.getByRole('button', { name: 'Copiar código Pix' }).waitFor();
    const encoded = await page.locator('.qr-frame img').getAttribute('src');
    const png = PNG.sync.read(Buffer.from(encoded.split(',')[1], 'base64'));
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data;
    const response = await page.request.get(`${origin}/api/offering`);
    const offering = await response.json();
    if (decoded !== offering.payload) throw new Error('QR e código de cópia diferem.');
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    if (accessibility.violations.length)
      throw new Error(
        `Acessibilidade ${name}: ${accessibility.violations.map((v) => v.id).join(',')}`,
      );
    await page.screenshot({ path: `artifacts/previews/home-${name}.png`, fullPage: true });
    await context.close();
  }
  console.log('Prévia desktop e mobile em artifacts/previews.');
} finally {
  await browser?.close();
  server.kill();
}
