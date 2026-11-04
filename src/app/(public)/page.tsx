import { ContributionPanel } from '@/components/public/contribution-panel';
import { getEnvironment } from '@/lib/env';
import { getOffering } from '@/application/use-cases/get-offering';
import { BankQrOfferingProvider } from '@/infrastructure/offering/bank-qr-provider';
import type { OfferingResult } from '@/domain/offering/model';
import QRCode from 'qrcode';

export default async function HomePage() {
  let initialOffering: OfferingResult | undefined;
  let initialQr = '';
  try {
    const env = getEnvironment();
    if (
      env.OFFERING_MODE === 'fund_static_pix' &&
      !(env.DEMO_ENABLED && env.NODE_ENV !== 'production')
    ) {
      initialOffering = await getOffering(new BankQrOfferingProvider());
      if (initialOffering.kind === 'ready') {
        // Representa o payload original. Não emite cobrança nem consulta banco/API.
        initialQr = await QRCode.toDataURL(initialOffering.payload, {
          width: 320,
          margin: 4,
          errorCorrectionLevel: 'M',
          color: { dark: '#10243aff', light: '#ffffffff' },
        });
      }
    }
  } catch {
    if (!initialOffering) initialOffering = { kind: 'unavailable', reason: 'error' };
  }
  return (
    <main id="conteudo" className="pix-page">
      <ContributionPanel initialOffering={initialOffering} initialQr={initialQr} />
    </main>
  );
}
