# Design system provisório

Direção: papel claro, verde discreto, títulos serifados e amplo espaço. Não é identidade oficial. Tokens em `src/styles/tokens.css`, marcados DRAFT_NOT_OFFICIAL. Ícone e wordmark temporários sem símbolos religiosos.

Componentes: botão primary para ação disponível; secondary para consulta; disabled com rótulo explícito; notice para pendências; cards para finalidade; detalhes nativos para informações secundárias. Alvos de ação principais com mínimo 48px; foco de 3px; redução de movimento; sem valor sugerido, rankings, urgência ou metas.

Estados do card: initial/loading, ready (só demo), copy-success, permission-failure (seleção manual), unavailable, offline, validation-expired e error. Todos têm texto e feedback aria-live. QR secundário só representa o mesmo texto de teste e está rotulado não pagável.

Meta: WCAG 2.2 AA. Axe cobre verificações automatizáveis, não substitui revisão manual. Checklist em docs/testing/manual.md. Sem promessa de conformidade integral.
