# Operação e deploy

## Local

Node 24 LTS. `pnpm install --frozen-lockfile`, copiar `.env.example`, `pnpm dev`. Demo somente em desenvolvimento com DEMO_ENABLED=true. `pnpm build && pnpm start` testa produção, com demo e admin local negados.

## PWA

Testar produção em localhost (contexto seguro) ou HTTPS aprovado. Abrir online uma vez, aguardar registro/cache e recarregar; depois desconectar. Apenas offline.html/ícones são armazenados. Sem SW ou antes de completar cache, não existe garantia offline. Não usar dev mode como validação do SW.

Atualização: alterar nome versionado do cache ao modificar assets pré-cacheados. Novo SW aguarda fechamento das abas; interface informa atualização disponível. Não usar skipWaiting automático. O worker novo remove caches antigos com prefixo do portal. Respostas de API/admin e RSC nunca entram no cache.

## Vercel (não executado)

Importar repositório privado após aprovação. Node 24, preset Next.js, install `pnpm install --frozen-lockfile`, build `pnpm build`. Configurar origem HTTPS exata, OFFERING_MODE=disabled e ADMIN_ENABLED=false. Proteger previews e usar dados fictícios. Desativar analytics, revisar retenção/logs/CDN. Supabase opcional só após homologação. Não conectar uma conta de ofertas regulares.

## Docker (não executado neste ambiente)

`docker build -t fundo-musical .` e `docker run --rm -p 3000:3000 --env-file .env.local fundo-musical`. Usar proxy TLS/WAF gerenciado aprovado à frente; não expor admin sem controles. Container roda como usuário node e tem health check. Segredos entram no runtime, nunca no Dockerfile. Qualquer NEXT_PUBLIC é incorporado no build; reconstruir se mudar metadado público.

## Incidente e rollback

1. Suspender canal financeiro e admin no ambiente e aplicar bloqueio no proxy/WAF; esta versão já não emite Pix real.
2. Preservar auditoria e versão de configuração, sem exportar segredos ou PII.
3. Restaurar versão anterior aprovada; reexecutar health, no-store, CSP e smoke móvel.
4. Conta alterada requer nova dupla revisão. Não restaurar código financeiro antigo de cache.
5. Reabrir após tesouraria/segurança conferirem conta e conciliação. Registrar motivo e responsáveis.

Não aplicar rollback SQL destrutivo. Usar migração corretiva revisada e backup testado. Antes de go-live, ensaiar restauração e perda de conectividade. Configurar WAF/rate limit com limites medidos: health é pequeno e sem efeito, mas não deve ser alvo de carga irrestrita. Login deve usar os controles de Auth do Supabase e proteção de borda. Não há rate limiter distribuído implementado no piloto.

## Divulgação

Após domínio autorizado, imprimir QR de **acesso ao portal**, não cobrança antiga. Cartão NFC grava apenas URL HTTPS. Conferir impressão e origem no celular; comunicação discreta, sem pressão. Não publicar nome de contribuintes ou métricas de arrecadação não conciliadas.
