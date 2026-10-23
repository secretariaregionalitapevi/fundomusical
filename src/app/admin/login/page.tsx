import { notFound } from 'next/navigation';
import { getEnvironment } from '@/lib/env';
import { InfoPage } from '@/components/public/info-page';
import { LoginForm } from '@/components/admin/login-form';
export default function LoginPage() {
  const env = getEnvironment();
  if (!env.ADMIN_ENABLED || env.DATA_BACKEND !== 'supabase') notFound();
  return (
    <InfoPage
      eyebrow="ACESSO RESTRITO"
      title="Administração do portal."
      intro="Acesso exclusivo a operadores provisionados. É obrigatório usar autenticação multifator."
    >
      <LoginForm />
    </InfoPage>
  );
}
