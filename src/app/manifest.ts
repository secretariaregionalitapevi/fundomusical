import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Fundo Musical — Regional Itapevi',
    short_name: 'Fundo Musical',
    description: 'Pix do Fundo Musical — Regional Itapevi.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'pt-BR',
    background_color: '#f1f5f9',
    theme_color: '#204d7a',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
