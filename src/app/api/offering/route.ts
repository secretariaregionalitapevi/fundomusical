import { getEnvironment } from '@/lib/env';
import { getOffering } from '@/application/use-cases/get-offering';
import {
  DisabledOfferingProvider,
  MockOfferingProvider,
} from '@/infrastructure/offering/providers';
import { BankQrOfferingProvider } from '@/infrastructure/offering/bank-qr-provider';
export const dynamic = 'force-dynamic';
export async function GET() {
  const headers = { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };
  try {
    const env = getEnvironment();
    const provider =
      env.DEMO_ENABLED && env.NODE_ENV !== 'production'
        ? new MockOfferingProvider(env.NODE_ENV)
        : env.OFFERING_MODE === 'fund_static_pix'
          ? new BankQrOfferingProvider()
          : new DisabledOfferingProvider();
    // Copia o payload original do QR recebido. Não emite uma cobrança nova.
    return Response.json(await getOffering(provider), { headers });
  } catch {
    return Response.json({ kind: 'unavailable', reason: 'error' }, { status: 503, headers });
  }
}
