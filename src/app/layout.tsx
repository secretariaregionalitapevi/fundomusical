import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { PwaRegistration } from '@/components/pwa/register';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: { default: 'Fundo Musical — Regional Itapevi', template: '%s | Fundo Musical' },
  description:
    'Pix do Fundo Musical — Regional Itapevi. Copie o código ou escaneie o QR Code e conclua no aplicativo do seu banco.',
  applicationName: 'Fundo Musical',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Fundo Musical' },
  icons: { icon: '/icons/icon.svg', apple: '/icons/apple-touch-icon.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#204d7a' };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await headers(); // Renderização dinâmica: nonce CSP por resposta, sem HTML bancário cacheado.
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo" tabIndex={0}>
          Pular para o conteúdo
        </a>
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
