import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) =>
        entry.isDirectory() ? files(`${dir}/${entry.name}`) : `${dir}/${entry.name}`,
      ),
    )
  ).flat();
}
for (const file of await files('src')) {
  const source = await readFile(file, 'utf8');
  assert(!/dangerouslySetInnerHTML/.test(source), `HTML não confiável: ${file}`);
  assert(!/localStorage|indexedDB/.test(source), `Persistência de visitante: ${file}`);
  assert(!/href\s*=\s*["'][^"']*\/ofertas/.test(source), `Fluxo financeiro incorreto: ${file}`);
  assert(
    !/NEXT_PUBLIC_.*(?:SECRET|SERVICE_ROLE|PASSWORD)/.test(source),
    `Segredo público: ${file}`,
  );
}
try {
  for (const file of (await files('.next/static')).filter((f) => f.endsWith('.js'))) {
    const source = await readFile(file, 'utf8');
    assert(
      !/SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|sb_secret_[a-zA-Z0-9]{12}/.test(source),
      `Segredo no bundle: ${file}`,
    );
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
console.log(
  'Revisão automatizada: sem persistência individual, redirecionamento financeiro ou segredos identificados.',
);
