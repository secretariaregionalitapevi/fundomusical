# Arquitetura

Atualização de escopo: a home agora é uma única tela Pix azul/branca com logo CCB e QR fornecido pelo usuário. O adapter `BankQrOfferingProvider` reapresenta os bytes do QR bancário recebido, verificando finalidade, hash e CRC. Veja [a correção de escopo](../pix-page.md); o restante deste documento descreve a base técnica da primeira entrega.

Monólito modular com Next.js App Router. A interface pública usa Server Components; somente cópia, QR de demonstração, conectividade e registro PWA executam no cliente. Tipos de domínio não importam Next ou Supabase.

Fluxo público: `ContributionPanel → GET /api/health → GET /api/offering → getOffering → OfferingProvider`. O backend retorna apenas indisponibilidade ou texto de demonstração fixo, nunca uma configuração de aprovadores. Nenhuma chave secreta pode chegar ao navegador.

Portas: OfferingProvider, RecipientConfigurationRepository, EventRepository, AggregateMetricsRepository e AuditRepository. Implementações locais retornam ausência de dados, não dados falsos. Adapters Supabase usam cliente autenticado no servidor e validação Zod. O serviço público não utiliza service role ou bypass de RLS.

O modo `local` roda integralmente sem banco. No modo `supabase`, o módulo administrativo usa cliente SSR com cookies HttpOnly e valida getUser, AAL2 e perfil ativo em toda ação. O banco repete a autorização. Escrever propostas e decisões usa RPC transacional, sem permissão de UPDATE direto.

Todas as páginas Next são dinâmicas para suportar CSP por nonce. O custo é a ausência de cache de HTML. O offline é um documento HTML estático independente, com CSS identificado por hash, sem scripts ou dados bancários. Não existe promessa de offline na primeira visita.

FundMusicBankIntegration é uma extensão bloqueada por certificação. Nenhuma escolha de OFFERING_MODE ativa um código real. A homologação da tesouraria exige código específico do banco, verificações de payload e testes autorizados antes de uma versão futura permitir pagamentos.

Referências consultadas em 23/10/2026: [App Router](https://nextjs.org/docs/app), [PWA](https://nextjs.org/docs/app/guides/progressive-web-apps), [CSP](https://nextjs.org/docs/app/guides/content-security-policy), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
