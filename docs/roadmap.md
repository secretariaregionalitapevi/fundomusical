# Roadmap

Escopo atual: [página Pix única](pix-page.md), com o QR Bradesco recebido e acesso preparado para portal Wi-Fi. A primeira landing page foi substituída. As seções abaixo são histórico e possibilidades futuras; não são requisitos para usar a nova tela local.

## MVP

Implementados: portal público, design provisório, informação de segurança/privacidade, estados online/offline, demo não pagável, SW neutro, testes automatizados, arquitetura por portas e adapters locais/Supabase. Módulo administrativo implementado para backend opcional: autenticação, MFA, rascunhos, revisão dupla e auditoria. Não homologado em conta Supabase real.

## Before go-live

Pendentes obrigatórios: todas as assinaturas em approvals-and-go-live.md, marca/domínio/canal de privacidade, homologação do SQL/RLS/Auth com operadores distintos, proteção contra força bruta em Auth/WAF, revisão jurídica e retenção, teste em dispositivos reais, auditoria de licenças e pipeline remoto, operação/rollback.

Para habilitar pagamentos: implementar e certificar adapter com banco autorizado, conta dedicada ou classificação dinâmica comprovada, validar payload oficial/CRC e isolamento QR/Copia e Cola, revogação e conciliação segregada. Flags atuais não ativam esse recurso. Não é bloqueio a resolver com chave Pix inventada.

## Future

Publicação administrativa de agenda após revisão; integração financeira com callbacks autenticados, idempotentes e conciliados; relatórios agregados homologados restritos a operadores; métricas opcionais após revisão de privacidade; autenticação por convites e provisionamento TOTP assistido. Sem rankings ou perfil do doador.

Referências: [Next.js](https://nextjs.org/docs/app), [PWA](https://nextjs.org/docs/app/guides/progressive-web-apps), [Supabase Auth SSR](https://supabase.com/docs/guides/auth/server-side), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix), [ANPD](https://www.gov.br/anpd/pt-br).
