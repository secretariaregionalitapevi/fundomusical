import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await mkdir('public/icons', { recursive: true });
const svg = await readFile('public/icons/icon.svg');
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
