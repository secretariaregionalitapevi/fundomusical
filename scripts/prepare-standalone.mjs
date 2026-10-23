import { cp, mkdir } from 'node:fs/promises';
await mkdir('.next/standalone/.next/static', { recursive: true });
await cp('public', '.next/standalone/public', { recursive: true });
await cp('config', '.next/standalone/config', { recursive: true });
await cp('.next/static', '.next/standalone/.next/static', { recursive: true });
console.log('Servidor standalone preparado com assets e fallback offline.');
