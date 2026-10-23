# PROMPT MESTRE PARA CODEX — FUNDO MUSICAL CCB

> Cole integralmente este documento no Codex, dentro de um repositório vazio ou da pasta escolhida para o projeto. Papel: principal engineer, security architect, senior frontend engineer, QA lead e technical writer. Data de referência: outubro de 2026.

## 0. Missão e modo de execução

Você é responsável por **implementar**, não apenas descrever, um produto web completo e de nível profissional chamado **Fundo Musical — Regional Itapevi**. Construa a aplicação, arquivos de configuração, documentação, testes, migrações futuras, seeds fictícias, CI e recursos de PWA. Inicie inspecionando o repositório e as versões atuais e estáveis suportadas de cada dependência; não fixe versões obsoletas com base em suposições. Trabalhe em etapas verificáveis, efetue alterações nos arquivos e execute os testes locais. Não afirme que algo funciona sem testar. Onde houver credenciais, conta Pix, marca institucional, domínio oficial ou aprovação faltantes, entregue configuração demonstrativa segura e registre um bloqueador explícito para produção — **nunca invente uma conta bancária ou marque titularidade como validada**.

Objetivo: permitir que participantes de ensaios regionais acessem, de forma **voluntária, discreta e sem cadastro**, informações para contribuição ao Fundo Musical e, quando houver autorização, copiem um Pix oficial para finalizar no app bancário. As contribuições destinam-se à compra e reforma de instrumentos para irmãos e irmãs necessitados, conforme orientação institucional. O sistema não recebe, movimenta, retém nem intermedeia recursos.

### Princípios inegociáveis

- Institucional e sóbrio, nunca linguagem de venda, urgência, pressão, gamificação, rankings de ofertas, notificações insistentes ou sugestões invasivas de valor.
- Não coletar nome, CPF, telefone, filiação religiosa, identificação dos visitantes nem associação entre dispositivo e valor ofertado.
- Diferenciar claramente **conta cadastrada**, **conta formalmente aprovada** e **titular confirmado pelo próprio aplicativo bancário**. Nenhum selo do nosso site é prova bancária.
- **Não executar Pix offline.** O navegador pode disponibilizar conteúdo institucional offline, mas não confirmar, registrar como concluído ou enfileirar uma transferência.
- **Não disponibilizar Pix real antes de aprovação explícita da administração e conferência de conta/destinatário.** Em dev/staging usar apenas código simulado NÃO PAGÁVEL; não criar payload real de demonstração.
- **Não copiar identidade visual ou marca sem autorização**; referências visuais do site oficial devem ser tratadas como referências sujeitas a aprovação, e registrar procedência das peças. Não sugerir que o subdomínio é oficial sem confirmação.
- **Separação financeira obrigatória**: o sistema de “Ofertas” regulares do site institucional NÃO é destino válido para contribuições do Fundo Musical. Não direcionar, misturar, usar a mesma cobrança sem classificação comprovada, nem oferecer fallback para ofertas regulares. A identidade visual do site pode ser consultada, mas seu fluxo financeiro não integra o produto. Exigir aprovação da tesouraria/administração quanto ao mecanismo de segregação, identificação e conciliação da verba do Fundo Musical.
- Nunca alegar total conformidade à LGPD apenas por não haver formulário: revisar logs de servidor/CDN, IPs, cookies, analytics, cache, fornecedores e retenção.


## 0.1 Regra financeira fundamental — segregação do Fundo Musical (CRÍTICO)

A CCB já possui uma página/sistema institucional de **ofertas regulares**. ESSE SISTEMA TEM OUTRA FINALIDADE E NÃO DEVE SER USADO, VINCULADO NEM OFERECIDO COMO FALLBACK. O projeto destina-se **exclusivamente** às ofertas voluntárias vinculadas ao **Fundo Musical dos Ensaios Regionais da Regional Itapevi**, cuja finalidade é aquisição/reforma de instrumentos para doação a necessitados. Separar a finalidade financeira é requisito funcional e critério de aceite, não detalhe visual.

**Antes de ativar o Pix real, a administração financeira da CCB deve definir e homologar uma das estratégias de rastreabilidade abaixo:**
1. **Preferida**: conta bancária/conta de recebimento específica e formalmente autorizada para o Fundo Musical, com extratos e conciliação isolados, respeitando a titularidade oficial da instituição.
2. **Alternativa**: recebimento na conta institucional existente SOMENTE SE o banco/sistema da tesouraria fornecer mecanismo comprovado e auditável para classificar cada Pix do Fundo Musical (por exemplo, cobranças Pix dinâmicas com `txid`/identificador de cobrança associado à finalidade e ao ensaio, e conciliação bancária/ERP preservando essa classificação). Confirmar junto ao banco que a modalidade, o identificador e o extrato/API permitem essa segregação de verdade. **Não presumir que descrição, texto de mensagem, chave igual ou QR estático comum garantem rastreabilidade**.
3. Se não houver mecanismo comprovado de segregação, **desabilitar emissão/cópia do Pix** em produção e manter somente orientação institucional até que haja aprovação da solução financeira correta.

Modelar `fund_id`, `purpose_code` constante `FUNDO_MUSICAL`, `regional_id` e `event_id` (quando necessário) como metadados de negócio não pessoais; não assumir que esses campos serão transmitidos pelo Pix automaticamente. Todos os pagamentos válidos para o Fundo Musical devem poder ser conciliados em relatório próprio, sem misturar com as ofertas regulares. O mesmo arranjo pode agrupar três ensaios por ano, com identificação opcional por evento se a tesouraria exigir. Não exibir número ou valor de ofertas individuais no portal público.

**Critérios de aceite de segregação**: um Pix de oferta regular NÃO entra no relatório do Fundo Musical; um Pix do Fundo Musical NÃO entra como oferta regular; valores reconciliados batem com extratos/relatórios homologados; cobranças não conciliadas são sinalizadas para revisão por operadores financeiros autorizados, sem associar identidade do doador ao portal público. Documentar testes com dados fictícios e homologação financeira por responsáveis, sem simular aprovação.

## 1. Contexto, públicos e jornadas

Três ensaios regionais por ano envolvendo músicos, organistas e irmandade de diversas comuns da Regional Itapevi. No modelo atual, um QR Code físico tem baixa utilização. A experiência precisa ser excelente em celulares de baixo custo, conexões móveis instáveis, idosos, iOS Safari e Android Chrome. Deve funcionar também via link do WhatsApp, QR de acesso e cartão NFC que **abre uma URL HTTPS**, sem pedir permissões de NFC nem contato telefônico.

**Jornada pública (sem conta):**
1. Entrar por URL curta confiável, QR de acesso ou NFC.
2. Visualizar nome da instituição, identificação da Regional, explicação breve da finalidade e orientações de segurança.
3. Visualizar o status da conta: `não configurada`, `aguardando validação`, `validada administrativamente`, `indisponível`, sem falsificar aval bancário.
4. Se o recurso estiver formalmente liberado e online, ver favorecido + CNPJ autorizado, valor livre e instruções. O produto prioriza **Pix Copia e Cola** com botão grande de copiar, confirmação de cópia e guia de abertura do app bancário. Oferecer QR do Pix somente como opção secundária para transferência iniciada em outro dispositivo; o QR físico principal aponta para o portal, não para cobrança antiga.
5. Exigir confirmação *informativa*, não bloqueante, de que os dados exibidos no app bancário precisam coincidir com titular e CNPJ informados; em caso de divergência, cancelar no banco e comunicar o canal institucional.
6. Não perguntar se a pessoa pagou, não exigir comprovante e não apresentar mensagem enganosa de pagamento realizado.
7. Se online mas conta/canal específico do Fundo Musical não autorizado, mostrar apenas informação institucional e aviso de indisponibilidade; **nunca redirecionar para a página de ofertas regulares**.

**Jornada de administradores** (somente após habilitação de backend e autenticação): ver configuração, revisar propostas de alteração da conta, autorizar publicação em processo de duas pessoas, configurar ensaios, ver métricas agregadas estritamente necessárias e registros de auditoria técnica, sem perfil de doador.

## 2. Levantamento obrigatório da marca e governança

Referência pública: https://congregacaocristanobrasil.org.br/ . Verificar se o site responde e analisar somente assets acessíveis legitimamente; não contornar restrições de acesso. Observar logo, tipografia, tons, padrões gráficos e espaçamentos, **sem reutilizar o fluxo de Ofertas regulares**; escrever `docs/branding-audit.md` identificando referências com URL, observações, itens não confirmados e aprovações necessárias. Se não conseguir inspecionar, **não inventar paleta oficial**. Criar tokens em `src/styles/tokens.css` com valores provisórios claramente marcados `DRAFT_NOT_OFFICIAL`; preferir neutros elegantes e uma cor de destaque discreta configurável. Criar interface institucional premium sem cruzes nem iconografia religiosa não adotada. Logo real só após disponibilização e autorização; até lá, wordmark tipográfico temporário indicado como tal.

O domínio, chave Pix, instituição bancária, CNPJ e pessoa com autoridade para validar são *dados pendentes de configuração*. Criar `docs/approvals-and-go-live.md` com checklist obrigatório de homologação/assinaturas e decisões financeiras. Não publicar em domínio que se faça passar pelo oficial; a preferência é por domínio/subdomínio efetivamente aprovado e verificável.

## 3. Stack tecnológica e padrão arquitetural

- **Next.js App Router estável e suportado**, React compatível, TypeScript `strict`, Node.js LTS compatível; seguir docs oficiais atuais na data da implementação.
- Tailwind CSS estável + CSS custom properties/tokens; componentes base acessíveis via Radix ou shadcn/ui quando úteis, sem dependências cosméticas em excesso; ícones Lucide.
- pnpm e lockfile; ESLint, Prettier, TypeScript check, commit hooks opcionais, Dependabot/Renovate configurável e GitHub Actions para validação.
- Zod para validação e contratos; Server Components para conteúdo público estático; Client Components somente para copiar código, detecção de conectividade e interações.
- **Arquitetura modular por domínio/ports-and-adapters, sem microservices**: `domain`, `application`, `infrastructure`, `presentation`; portas `OfferingProvider`, `RecipientConfigurationRepository`, `EventRepository`, `AggregateMetricsRepository`, `AuditRepository`. O frontend não deve depender diretamente do Supabase.
- Implementar `MockOfferingProvider` seguro para desenvolvimento, `DisabledOfferingProvider` (padrão produção sem conta aprovada), adaptador `FundMusicBankIntegration` para conta/arranjo financeiro exclusivo do Fundo Musical, e adaptador bancário futuro sob feature flag. Nada de credenciais sensíveis no client bundle.
- Storage inicial baseado em configuração tipada, **sem precisar de Supabase para rodar o MVP**. Criar interfaces e migrations para upgrade, não fazer fake Supabase em produção.
- Preferir deploy simples em plataforma com HTTPS e proteção; documentar Vercel, Docker e alternativa sem exigir uma VPS. Nunca prometer disponibilidade offline antes do primeiro carregamento/caching bem-sucedido.

## 4. Estrutura mínima de diretórios

```text
.
├─ src/
│  ├─ app/
│  │  ├─ (public)/page.tsx
│  │  ├─ (public)/como-contribuir/page.tsx
│  │  ├─ (public)/seguranca/page.tsx
│  │  ├─ (public)/privacidade/page.tsx
│  │  ├─ offline/page.tsx
│  │  ├─ api/health/route.ts
│  │  ├─ admin/(protected)/layout.tsx
│  │  ├─ admin/(protected)/page.tsx
│  │  ├─ manifest.ts
│  │  └─ layout.tsx
│  ├─ components/{ui,public,admin,pwa}/
│  ├─ domain/{offering,recipient,event,metrics}/
│  ├─ application/{ports,use-cases}/
│  ├─ infrastructure/{config,offering,supabase,telemetry}/
│  ├─ lib/{security,env,validation,formatting}/
│  └─ styles/{globals.css,tokens.css}
├─ public/{icons,branding}/
├─ public/sw.js
├─ supabase/{migrations,seed.sql,README.md}
├─ tests/{unit,integration,e2e,security}/
├─ docs/{architecture,adr,security,privacy,branding-audit,approvals-and-go-live,operations,testing,roadmap}/
├─ .github/workflows/ci.yml
├─ .env.example
├─ .gitignore
├─ AGENTS.md
├─ README.md
└─ package.json
```

Ajustar rotas/grupos conforme convenções do Next.js, sem colidir URL nem duplicar layouts. Não criar páginas administrativas públicas com dados simulados que pareçam reais; quando backend/auth não estiverem habilitados, bloquear `/admin` corretamente, mostrando estado de configuração a operador local apenas em desenvolvimento.

## 5. Experiência visual — qualidade premium

Mobile-first 320–430px; tablet e desktop elegantes. Hero discreto com “Fundo Musical”, indicação “Regional Itapevi”, propósito em até 2 linhas, identificação institucional e bloco de segurança como foco visual. Espaçamento amplo, tipografia legível, botões com área de toque confortável, skeletons, erro/empty/offline states e animações sutis compatíveis com `prefers-reduced-motion`. WCAG 2.2 AA como meta verificável: contraste, foco visível, navegação por teclado, labels semânticos, feedback via `aria-live`, testes de zoom 200% e responsividade. Idioma pt-BR e valores `Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})`. A contribuição é voluntária: campo de valor livre ou sem valor conforme política da administração; não predefinir valor nem ordenar opções como estímulo. Não usar contadores de urgência nem ranking.

Criar design system documentado, com variantes de botões, avisos e cards, além de estados detalhados: `initial`, `loading`, `ready`, `copy-success`, `permission-failure`, `unavailable`, `offline`, `validation-expired`, `error`. Evitar qualquer CTA que possa ser confundido com liquidação da transferência no próprio site.

## 6. Segurança de Pix e prevenção contra fraude (CRÍTICO)

**Arquitetura padrão mais segura**: o site apresenta dados oficiais previamente validados e Pix Copia e Cola emitido a partir da fonte aprovada. **Não criar uma chave Pix ou um payload pagável em ambiente de testes.**

Política da conta:
- Campos `beneficiaryLegalName`, `beneficiaryDocument`, `pixKey`, `bankName?`, `sourceType`, `approvedBy`, `approvalEvidenceRef`, `approvedAt`, `expiresAt`, `version`, `status` e `checksum`; armazenar no servidor e validar entradas; ocultar dados de quem aprovou no client. Uma chave Pix não deve ser tratada como segredo por si só, mas alterações devem ser extremamente protegidas.
- A aprovação deve exigir **dois operadores distintos** quando houver módulo administrativo: solicitante e aprovador, com MFA e auditoria. Uma pessoa não pode aprovar a própria modificação. Publicar apenas versão ativa aprovada, nunca draft.
- Se o favorecido/conta variar, bloquear exibição até reaprovação. Não atualizar identificador bancário silenciosamente por arquivo remoto/CMS.
- Para Pix estático, verificar aderência à especificação BR Code/EMV do Banco Central, CRC16, campos obrigatórios, limites, codificação e valores; preferir **payload fornecido pelo banco** ou geração via biblioteca avaliada e testada com vetores oficiais. Não implementar formato improvisado. Separar modo sem valor de modo com valor variável; garantir que qualquer valor tenha efeito real no payload apenas se modo aprovado suportar.
- O mesmo Pix Copia e Cola e QR devem representar exatamente o mesmo payload, com testes de round-trip e checksum.
- Oferecer cópia da chave Pix oficial como fallback somente se aprovada, com instruções claras; não inferir identidade bancária apenas pelo texto da chave.
- Validação final e pagamento ocorrem no aplicativo bancário, com exibição de nome/CNPJ pelo banco; explicar explicitamente que o site não autentica a transação nem conhece sua confirmação.
- Não guardar comprovantes nem CPF/dados do pagador; eventual conciliação financeira futura é responsabilidade do banco e de operadores formalmente autorizados.
- Nunca expor endpoints para marcar Pix como `paid` por input do visitante. Integração futura com instituição financeira exige autenticação, validação de assinatura/origem quando ofertada, idempotência, deduplicação, escopo de autorização e auditoria.

## 7. PWA e disponibilidade com internet instável

Implementar `manifest.ts`, ícones próprios autorizados (192/512 e maskable se compatível), instalação opcional e SW versionado. Usar abordagem deliberada e auditável, seguindo as docs oficiais do Next.js e MDN. Não usar cache indiscriminado de todas as URLs.

**Estratégia cache:**
- Precache apenas shell, tipografia hospedada localmente, CSS/JS essencial e página explicativa offline sem dados bancários. Assets versionados; higiene de cache nas atualizações.
- Network-first para documentos institucionais públicos não sensíveis; fall back para página offline neutra. URLs administrativas, rotas de API, respostas autenticadas, tokens, cookies e recursos Pix/conta: **network-only + `Cache-Control: no-store`**. Nunca salvá-los no Cache Storage do SW, IndexedDB ou localStorage.
- Quando offline, mostrar “Sem conexão. Você pode consultar as orientações, mas não é possível verificar os dados atuais para realizar a contribuição neste momento.” Desabilitar qualquer ação que dependa da validação atual da conta. **Não exibir Pix bancário antigo vindo do cache**.
- Detector `navigator.onLine` é apenas sinal, não evidência suficiente: validar conectividade a endpoint público de health com timeout e tratamento de erro; não fazer polling excessivo. Não fazer promessa de rede funcional baseada apenas em estado online.
- Não usar Background Sync para pagamentos, não enfileirar transações, não simular confirmação e não oferecer “pagar depois automaticamente”.
- Garantir testes da jornada após primeira visita online, modo avião, retorno online, mudança da conta oficial, service worker antigo, browser sem SW e Safari iOS.

## 8. LGPD, observabilidade e métricas agregadas

Public area sem login, cookies de marketing, pixel de publicidade, Google Analytics por padrão, fingerprinting, localização, WhatsApp SDK ou armazenamento de histórico de acesso individual. Métricas opcionais: `page_views_aggregated`, `pix_copy_clicks_aggregated`, `source_channel_aggregated` com valores agregados e sem identificadores persistentes; não rastrear quem ofertou nem enviar payload Pix nos eventos. Evitar identificadores de device/IP no banco analítico. Se necessário, agregação server-side em janelas com retenção definida e revisão jurídica.

Reconhecer que hospedagem, proxy, CDN e sistemas antifraude podem registrar IP e metadados; documentar controles, minimização, acesso, retenção e necessidade de base legal. Criar `docs/privacy/data-inventory.md`, `privacy-impact-review.md`, `retention-policy.md`, `incident-response.md`; elaborar aviso de privacidade objetivo, sujeito a revisão institucional/jurídica.

Não mostrar “Pix confirmados”, valores arrecadados ou taxa de conversão como reais enquanto não houver fonte bancária autorizada, **segregada e conciliada especificamente para o Fundo Musical**. No painel, diferenciar indicadores do portal (cliques/agregados) de dados financeiros **manuais validados**, ou integração futura. Nenhum ranking por comum, nome ou contribuinte.

## 9. Preparação real para Supabase (sem dependência inicial)

Criar `.env.example` com `DATA_BACKEND=local|supabase`, `OFFERING_MODE=disabled|fund_static_pix|fund_dynamic_pix|fund_bank_integration`, `NEXT_PUBLIC_SITE_URL`, `FUND_PURPOSE_CODE`, `FUND_RECIPIENT_ACCOUNT_ID`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` ou nomenclatura atual, e flags necessárias. Apenas variáveis estritamente públicas podem usar prefixo `NEXT_PUBLIC_`.

Criar migrações SQL versionadas e documentadas para Postgres/Supabase:
- `funds`: id, purpose_code único, descrição, status, timestamps; para o piloto, registro explícito `FUNDO_MUSICAL` sem misturar fundos/receitas.
- `events`: id, fund_id obrigatório, titulo, data, municipio/regiao, status, timestamps.
- `recipient_config_versions`: id, nome, documento, chave protegida no servidor, provider, status, versão, criado_em, aprovado_em, expiração.
- `recipient_change_approvals`: id, versão, solicitante, aprovador, decisão, datas; impedir self-approval.
- `admin_profiles`: auth_user_id, role enum (`viewer`, `editor`, `approver`, `auditor`), status.
- `audit_events`: actor, action, resource_type, resource_id, redacted_diff, created_at; não armazenar segredos/identificadores de visitantes.
- `aggregate_metrics_daily`: day, event_id nullable, channel enum, page_views, copy_clicks; sem ID de visitante.
- `financial_totals` **somente se autorizado**: fund_id obrigatório, event_id opcional, total_amount, source manual_verified/bank, verified_by, verified_at, reconciliation_reference, sem transferências individuais na camada pública.
- `financial_reconciliation_batches` **somente após integração autorizada**: fund_id, event_id opcional, source, period_start/end, amount, count, reference, reconciliation_status, verified_by; sem PII de pagadores ou extrato cru no analytics.

Aplicar `RLS` em TODAS as tabelas, revogar acesso público por padrão e não criar policies permissivas genéricas. Criar políticas estritamente por role e funções `SECURITY DEFINER` somente com justificativa, `search_path` fixo e testes. Proteger server routes independentemente do RLS. Usar Supabase Auth para admins com MFA disponível, sessões em cookies HttpOnly/Secure/SameSite conforme SDK atual, `@supabase/ssr` se ainda for recomendação oficial, validação server-side com `getClaims`/`getUser` e checagem de roles no servidor; não confiar em `getSession` isoladamente para autorização. Auth administrativo protegido contra força bruta, CSRF e escalação de privilégios. Secret/service-role nunca no browser nem nos logs. No modo local, admin de produção fica desativado; não criar credenciais padrão. Seeds sempre fictícias sem Pix pagável.

Implementar `Supabase*Repository` como adapters testáveis, conectados mediante flag, e testes de políticas em banco local quando CLI estiver disponível. A ausência do Supabase não deve impedir `dev`, `build` ou testes do piloto.

## 10. Segurança web e cadeia de suprimentos

Implementar Security Headers com CSP rigorosa compatível com Next.js (preferir nonce/hashes conforme arquitetura), HSTS somente HTTPS de produção, `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, Permissions-Policy mínima e proteção contra open redirect. Sanitizar inputs, validar redirect oficial por allowlist exata, restringir uploads (preferir não tê-los), aplicar rate limiting a endpoints apropriados e configurar páginas sem `index` para administração/staging.

Sem segredos em git; `.env.example` com placeholders e `.gitignore`. Revisar dependências e licenças, lockfile, CI de `lint`, `typecheck`, `test`, `build`, scans de segredos, auditoria de dependências e Playwright smoke test. Registros estruturados sem conteúdo Pix/identificadores de pessoas. Separar dev/staging/prod; implantação exige checklist de liberação e rollback documentados. Usar headers `no-store` no fluxo de conta/validação, e nas páginas administrativas.

## 11. Qualidade, testes e critérios de aceite

Implementar:
- Unitários (Vitest) para zod, estados da conta, adapters, regras de dual-control, formatação e payload Pix **somente em fixtures não pagáveis**.
- Integração para checar que conta ausente/expirada/não aprovada jamais libera copiar Pix.
- E2E (Playwright) para Android-like viewport, iPhone-like viewport, acessibilidade básica, estados online/offline, ausência de login público, cópia com e sem permissão, navegação teclado, erro de conectividade, e proteção de rotas administrativas.
- Axe ou equivalente para acessibilidade automatizada e checklist manual (screen reader, zoom, contraste, iOS).
- Testes de segurança: XSS, open redirect, cache indevido, privilégio admin, alterações de favorecido, resposta de service worker antigo e ausência de segredos no bundle.
- Testes financeiros de isolamento: nenhum link para ofertas regulares; nenhum fallback para modalidade regular; mudança de `purpose_code`/`fund_id` bloqueada; relatórios por `fund_id` não somam lançamentos regulares; falha de classificação desabilita emissão do Pix real.
- Verificar `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e e2e quando ambiente permitir; registrar comandos e resultados reais.

**Gate para liberar o Pix em produção:** 0) mecanismo financeiro de segregação, rastreabilidade e conciliação específica do Fundo Musical homologado pela tesouraria, com demonstração de que não se mistura às ofertas regulares; 1) autorização institucional escrita; 2) conta e CNPJ validados por responsáveis; 3) conformidade da modalidade Pix com banco; 4) domínio e certificado aprovados; 5) testes reais de pagamento de valor simbólico organizados por responsáveis autorizados e conferidos no banco; 6) evidência de rollback; 7) revisão de privacidade e política de retenção; 8) auditoria básica de dependências, WAF/rate limit e service worker; 9) conteúdo e identidade visual aprovados. Sem qualquer desses itens, `OFFERING_MODE=disabled`. Jamais substituir o caminho do Fundo Musical por ofertas regulares.

## 12. Plano de entrega e execução no Codex

**Fase 0 — Discovery:** inspecionar repo/site e docs oficiais; criar `docs/architecture/overview.md`, ADRs das principais decisões, `docs/branding-audit.md`, `docs/approvals-and-go-live.md`, lista de bloqueadores; seguir com implementações não bloqueadas. Não pedir credenciais logo no início.

**Fase 1 — Design system e MVP público:** montar aplicação, shell responsivo, Home, Como Contribuir, Segurança, Privacidade, placeholders claramente marcados, adapter `disabled`, contratos para Pix exclusivo do Fundo Musical e testes de separação de destinação, feature flags, testes e documentação.

**Fase 2 — PWA conservador:** manifest, SW, offline fallback, atualização, cache seguro e testes de comportamento em redes ruins.

**Fase 3 — Fluxo Pix do Fundo Musical com segurança:** contratos, validações, configurador server-side e mecanismos de identificação e conciliação segregados das ofertas regulares, estritamente atrás de feature flag de aprovação; permitir staging com fixtures explicitamente não pagáveis. Priorizar conta específica ou funcionalidade oficial bancária/institucional que identifique inequivocamente o destino Fundo Musical.

**Fase 4 — Base de dados futura:** SQL migrations, RBAC, RLS, adapters Supabase, testes de policies e painel sem métricas falsas. Não tornar produção dependente de backend ainda não configurado.

**Fase 5 — Hardening & entrega:** CI, documentação operacional, testes, revisão de acessibilidade, threat model, runbook de incidentes, checklist de deploy/rollback, orientação de divulgação discreta durante os eventos.

Crie scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `format`, `check`. Documente `pnpm install`, `cp .env.example .env.local`, `pnpm dev`, deploy e teste do PWA. Atualize `AGENTS.md` com regras permanentes de segurança e UX. Crie `docs/roadmap.md` com pendências classificadas em `MVP`, `Before go-live`, `Future`, incluindo links a documentos oficiais. Ao concluir cada fase, informe arquivos alterados, comandos executados, testes que passaram/falharam e decisões pendentes; depois prossiga para a fase seguinte sem aguardar confirmação, exceto operações externas destrutivas, gastos, publicação pública e uso de credenciais reais, que exigem aprovação humana.

## 13. Entrega obrigatória

Entregue código funcional, README operativo, estrutura revisada, PWA com fallback offline seguro, modo demo que não produz Pix pagável, testes automatizados, adapters para Supabase, migrações SQL versionadas, aviso de privacidade provisório, auditoria de marca, documentação de ameaça/segurança e uma checklist específica de go-live. Não pare em mockups, pseudocódigo ou documento de arquitetura. Não declarar um recurso como pronto se ele está apenas planejado.

### Referências técnicas primárias a consultar e citar nos documentos

- Site da CCB: https://congregacaocristanobrasil.org.br/
- Next.js App Router: https://nextjs.org/docs/app
- Next.js PWA: https://nextjs.org/docs/app/guides/progressive-web-apps
- MDN PWA offline: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation
- Supabase + Next.js: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Banco Central Pix: https://www.bcb.gov.br/estabilidadefinanceira/pix
- Banco Central documentação Pix: https://www.bcb.gov.br/estabilidadefinanceira/pix
- LGPD (texto legal): https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- ANPD: https://www.gov.br/anpd/pt-br

**COMANDO FINAL AO AGENTE:** Comece agora pela inspeção do diretório e criação real do projeto. Implemente todas as fases não bloqueadas, fazendo commits lógicos se o repositório permitir e relatando resultados verificáveis. Mantenha Pix real e publicação em produção bloqueados até autorização formal e verificação bancária.
