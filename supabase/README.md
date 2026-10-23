# Backend administrativo opcional

Não é necessário para o portal local. Não foram usadas credenciais ou conta real. Faça homologação em projeto **isolado**, com usuários fictícios.

1. Preparar Supabase CLI + Docker conforme documentação oficial. Inicializar configuração local com `supabase init` (não executado aqui).
2. Aplicar `migrations/202610230001_core.sql` e seed.sql no banco descartável (`supabase db reset` após init). Não aplicar `future/` antes da autorização financeira.
3. Criar dois usuários de teste distintos por Auth e inserir admin_profiles por SQL administrativo revisado: editor e approver. Não há INSERT/UPDATE em perfis por usuário autenticado.
4. Provisionar TOTP de cada usuário em fluxo de enrollment seguro; confirmar fator antes de acessar este módulo. O piloto só verifica fatores já provisionados, não permite criar contas ou MFA publicamente.
5. Definir DATA_BACKEND=supabase, ADMIN_ENABLED=true, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY e NEXT_PUBLIC_SITE_URL exata. Nenhuma secret key é necessária no fluxo administrativo implementado; campo reservado na env não é utilizado.
6. Testar login, MFA, perfis revogados e tentativas indevidas. Rodar `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql` em banco local, nunca contra produção sem revisão.
7. Propor conta não pagável com dados fictícios; verificar outro operador, rejeição de self-approval via RPC, expiração e auditoria. Não considerar fixtures como aprovação institucional.

RLS habilitado em todas as tabelas; anon sem grants. authenticated só SELECT com policies por perfil/AAL2. Escritas administrativas somente funções SECURITY DEFINER limitadas, search_path fixo, auth.uid/role/AAL2 e auditoria na mesma transação. Não existe policy genérica de acesso público ou alteração de role. A chave Pix institucional fica no servidor e no banco, protegida por RLS, nunca no cache do navegador.

`Supabase*Repository` usa cliente de usuário autenticado, valida resultados e filtra Fundo Musical. Falhas são indisponibilidade, sem fallback financeiro. A fonte pública não consulta banco com bypass ou secret key.

Migrations financeiras futuras ficam fora da pasta ativa: sem ingestão de extratos/PII, sem registro de transferências individuais, sem acesso público. Nenhum relatório é apresentado como valor real neste piloto.

Referências: [CLI local](https://supabase.com/docs/guides/local-development), [SSR](https://supabase.com/docs/guides/auth/server-side), [MFA](https://supabase.com/docs/guides/auth/auth-mfa), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
