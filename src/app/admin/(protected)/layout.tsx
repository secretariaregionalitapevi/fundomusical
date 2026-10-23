import { notFound } from 'next/navigation';
import { getEnvironment } from '@/lib/env';
import { requireAdmin } from '@/lib/security/admin';
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const env = getEnvironment();
  if (!env.ADMIN_ENABLED || env.DATA_BACKEND !== 'supabase') {
    if (env.NODE_ENV === 'production') notFound();
    return (
      <main id="conteudo" className="container info-page">
        <h1>Administração desativada.</h1>
        <p>
          Estado local de desenvolvimento: configure Supabase, operadores e MFA conforme
          supabase/README.md. Não existem credenciais padrão.
        </p>
      </main>
    );
  }
  await requireAdmin();
  return children;
}
