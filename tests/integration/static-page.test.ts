import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { DEMO_PAYLOAD, offeringResultSchema } from '@/domain/offering/model';

vi.mock('@/lib/env', () => ({
  getEnvironment: () => ({
    OFFERING_MODE: 'fund_static_pix',
    DEMO_ENABLED: false,
    NODE_ENV: 'production',
  }),
}));
vi.mock('@/infrastructure/offering/bank-qr-provider', () => ({
  BankQrOfferingProvider: class {
    async getOffering() {
      return {
        kind: 'ready',
        payload: DEMO_PAYLOAD,
        expiresAt: null,
        purposeCode: 'FUNDO_MUSICAL',
        beneficiaryName: 'FAVORECIDO DE TESTE',
        beneficiaryDocument: null,
        bankName: 'Banco simulado',
      };
    }
  },
}));

it('entrega QR fixo e cópia no HTML inicial, sem API ou JavaScript do visitante', async () => {
  const { default: HomePage } = await import('@/app/(public)/page');
  const html = renderToString(await HomePage());
  expect(html).toContain('FAVORECIDO DE TESTE');
  expect(html).toContain('Copiar código Pix');
  expect(html).not.toContain('Carregando QR Code');
  const encoded = html.match(/src="data:image\/png;base64,([^"]+)"/)?.[1];
  expect(encoded).toBeTruthy();
  const png = PNG.sync.read(Buffer.from(encoded!, 'base64'));
  expect(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data).toBe(DEMO_PAYLOAD);
});

it('demonstração continua exigindo uma validade definida', () => {
  expect(
    offeringResultSchema.safeParse({
      kind: 'demo',
      payload: DEMO_PAYLOAD,
      expiresAt: null,
      purposeCode: 'FUNDO_MUSICAL',
    }).success,
  ).toBe(false);
});
