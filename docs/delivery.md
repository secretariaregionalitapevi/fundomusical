# Entrega por fase

Atualização de escopo do usuário: a interface desta primeira entrega foi substituída por uma página única Pix, com logo CCB e o QR bancário recebido. A entrega atual está descrita em [pix-page.md](pix-page.md) e no README. Este registro permanece como histórico técnico.

## 0 — Discovery

Lido o prompt mestre. Site de referência retornou 403, sem contorno de acesso ou cópia de marca. Docs atuais de Next, PWA, CSP, Node e Supabase consultadas; versões verificadas pelo registro npm. Criados arquitetura, ADRs, auditoria de marca e checklist de homologação. Bloqueadores não impediram o piloto local.

## 1 — Portal público

Rotas Home, Como contribuir, Segurança e Privacidade; componentes públicos, tokens provisórios, layout responsivo e estados de conexão. Domínio/ports/use-cases, configuração Zod, provider disabled e testes de segregação. Não há conta ou contato inventado.

## 2 — PWA

Manifest, ícones próprios PNG/SVG/maskable, registro opcional, worker versionado e fallback HTML sem JS/dados financeiros. Health com timeout e invalidação offline/visibilidade. Testes de cache, worker antigo e jornada offline em Chromium/WebKit aprovados.

## 3 — Fluxo financeiro seguro

Demo não pagável, Copia e Cola com feedback, negação e seleção manual, QR secundário do mesmo texto e expiração. Modelo de conta, dupla aprovação e separação por fund/purpose. Integração real bloqueada por certificação e homologação; nenhuma flag ativa payload bancário. Não há gerador BR Code improvisado ou teste pagável.

## 4 — Backend opcional

Migração ativa e seeds sem conta; SQL financeiro futuro isolado. Adapters Supabase testáveis, RLS, RPCs transacionais, admin com credenciais/MFA/roles, propostas, decisões e rascunhos de ensaios. PostgreSQL embarcado validou regras SQL. Autenticação Supabase e operação real ainda exigem ambiente isolado e responsáveis.

## 5 — Hardening e entrega

CSP nonce, headers, no-store, CSRF/origem, limitação de tentativas administrativas por processo, testes e CI. Dockerfile, scripts Windows, README, inventário de licenças, privacidade, ameaças, operação e rollback. Lint, tipos, testes, build, auditoria e 18 testes móveis aprovados; resultados detalhados em testing/results.md.

Sem autorização institucional/financeira, domínio e privacidade homologados, o piloto permanece local, com OFFERING_MODE=disabled. Documentos pendentes não foram preenchidos com aprovações fictícias.
