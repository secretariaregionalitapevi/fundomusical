import { expect, it } from 'vitest';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { DEMO_PAYLOAD } from '@/domain/offering/model';
it('QR e Copia e Cola representam exatamente o texto não pagável', async () => {
  const buffer = await QRCode.toBuffer(DEMO_PAYLOAD, { width: 300, errorCorrectionLevel: 'M' });
  const png = PNG.sync.read(buffer);
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  expect(decoded?.data).toBe(DEMO_PAYLOAD);
});
