# Regras permanentes

- Responder e escrever a interface em pt-BR. Produto institucional, voluntário e discreto.
- Não gerar Pix pagável em testes ou demonstração. O usuário forneceu um QR do Bradesco do Fundo Musical: a página deve reapresentar exatamente esse payload, sem gerar outra cobrança ou declarar titularidade validada.
- Nunca redirecionar para ofertas regulares. Preservar fund_id e FUNDO_MUSICAL em todo contrato financeiro.
- Não inventar autorização, favorecido, CNPJ, domínio, ensaio, contato, marca ou métricas reais.
- Nenhum dado bancário, API ou sessão pode entrar no cache do SW, localStorage ou IndexedDB.
- Nenhum dado pessoal do visitante, comprovante, identificação persistente ou confirmação de pagamento.
- O usuário autorizou explicitamente a publicação técnica da página com o QR existente em 23/10/2026, no GitHub secretariaregionalitapevi/fundomusical e na Vercel secretaria-regional/fundomusical. Isso não constitui assinatura do checklist institucional. Novas integrações bancárias e ativação do admin continuam sujeitas à homologação de docs/approvals-and-go-live.md.
- Admin exige getUser no servidor, perfil ativo, AAL2 e RLS. Nunca usar secret key no navegador.
- Aprovação de conta exige dois operadores distintos e auditoria transacional. Não permitir UPDATE direto.
- Usar Node 24 LTS e pnpm com lockfile. Executar lint, typecheck, test, build e e2e após mudanças relevantes.
- Registrar limitações reais de validação. Nenhuma declaração de conformidade LGPD ou certificação bancária presumida.
- Escopo corrigido pelo usuário: uma única tela de contribuição, azul e branco da referência, logo CCB, QR visível e botão copiar. Sem landing page, hero promocional, menu, login público ou seções institucionais.
- A abertura automática ao conectar ao Wi-Fi exige configuração do captive portal no roteador. Nunca condicionar acesso à rede a uma contribuição.
- Requisito mais recente e mandatório: Android E iPhone; escolher o banco e encaminhar efetivamente ao ambiente bancário para a transferência. Copiar código e mostrar instruções NÃO satisfaz esse requisito. Não declarar o fluxo pronto sem integração autorizada e teste real em dispositivos físicos.
- Não inventar esquemas pix://, links de bancos, listas de aplicativos instalados ou redirecionamento universal. Usar URLs oficiais retornadas por uma integração autorizada, preservando exclusivamente a conta do Fundo Musical. QR de acesso ao portal (HTTPS) e QR bancário BR Code são objetos distintos.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
