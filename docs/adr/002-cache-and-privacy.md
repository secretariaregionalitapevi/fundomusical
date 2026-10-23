# ADR 002 — Offline neutro e sem perfil do visitante

Somente HTML offline e ícones próprios entram no precache. Documentos online são network-first sem armazenamento; indisponibilidade leva ao documento neutro. API, admin e RSC são network-only/no-store. Sem Background Sync, pagamentos em fila ou persistência de dados financeiros.

A CSP usa nonce por resposta e exige renderização dinâmica. O fallback usa hash CSS e nenhuma execução JavaScript. Fonts do sistema dispensam requisição externa. Coleta de métricas e cookies públicos estão desativados.

Referências: [MDN offline](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation), [Next CSP](https://nextjs.org/docs/app/guides/content-security-policy).
