import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await mkdir('public/icons', { recursive: true });
const logo = await readFile('public/branding/ccb-logo.png');
const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="72" fill="#fff"/><image href="data:image/png;base64,${logo.toString('base64')}" x="24" y="138" width="464" height="236"/></svg>`,
);
await writeFile('public/icons/icon.svg', svg);
for (const size of [192, 512])
  await sharp(svg).resize(size).png().toFile(`public/icons/icon-${size}.png`);
await sharp(svg).resize(180).png().toFile('public/icons/apple-touch-icon.png');
const padded = await sharp(svg).resize(320).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#204d7a' } })
  .composite([{ input: padded, gravity: 'center' }])
  .png()
  .toFile('public/icons/maskable-512.png');
const offline = await readFile('public/offline.html', 'utf8');
const style = offline.match(/<style>([\s\S]*?)<\/style>/)[1];
const hash = createHash('sha256').update(style).digest('base64');
await writeFile(
  'public/offline.html',
  offline.replace(/style-src 'sha256-[^']*'/, `style-src 'sha256-${hash}'`),
);
console.log('Ícones próprios e hash CSP offline gerados.');
