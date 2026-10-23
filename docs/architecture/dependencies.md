# Dependências verificadas — 23/10/2026

Versões foram consultadas no registro npm durante a implementação, e não inferidas da memória. As versões efetivamente instaladas estão em package.json e pnpm-lock.yaml. Ambiente de validação: Node 24.22.1 LTS portátil, pnpm 10, Next.js 16.4.3 e React 19.3.1.

TypeScript 7 era o dist-tag latest, mas plugins TypeScript do ESLint declaravam suporte `<6.1`; foi escolhida a linha 6.0.3 compatível. ESLint 9 estava marcado deprecated; usamos ESLint 10.13.0 com `@eslint/compat` oficial sobre as regras do Next. Alguns plugins transitivos ainda declaram peer máximo 9: o aviso é conhecido e o lint completo foi executado, não suprimido. Reavaliar o shim e os peers em cada atualização.

O pnpm ignora por padrão scripts de build não autorizados (`unrs-resolver`). O lint funcionou com os pacotes binários opcionais instalados; não foi habilitada execução irrestrita de scripts de terceiros.

Inventário de licenças extraído do pnpm em `../security/dependency-licenses.json`, sem caminhos pessoais. Inclui dependências transitivas e binários de plataforma. A combinação Apache/LGPL corresponde a componentes nativos de imagem, e o inventário também contém CC-BY-4.0: revisar os avisos e atribuições dos pacotes efetivamente distribuídos antes de produção. Não houve parecer jurídico de licenças.

Auditoria `pnpm audit --prod --audit-level=high`: nenhum problema conhecido retornado na data da implementação. Isso é uma consulta pontual, não garantia futura. CI repete a auditoria.

O cadastro administrativo aceita o formato CNPJ numérico e alfanumérico de 14 posições, conforme a [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/julho/receita-federal-gera-o-primeiro-cnpj-em-formato-alfanumerico). A validação é somente sintática: não consulta cadastro, não calcula prova de titularidade e não substitui a homologação da conta. Nenhum número foi preenchido como destinatário real.

Referências: [Node LTS](https://nodejs.org/en/about/previous-releases), [Next instalação](https://nextjs.org/docs/app/getting-started/installation), [ESLint 10](https://eslint.org/docs/latest/use/migrate-to-10.0.0), [PostgreSQL hashes nativos](https://www.postgresql.org/docs/current/functions-binarystring.html), [PGlite](https://pglite.dev/docs/).
