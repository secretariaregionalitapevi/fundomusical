'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/infrastructure/supabase/client';
import { headers } from 'next/headers';
import { getEnvironment } from '@/lib/env';
import { adminAttempts } from '@/lib/security/rate-limit';

export async function assertSameOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  if (origin !== new URL(getEnvironment().NEXT_PUBLIC_SITE_URL).origin)
    throw new Error('Origem não autorizada.');
}
export async function login(_state: { message: string }, form: FormData) {
  await assertSameOrigin();
  const parsed = z
    .object({ email: z.email().max(254), password: z.string().min(1).max(200) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { message: 'Confira as credenciais informadas.' };
  if (!adminAttempts.take('password', parsed.data.email))
    return { message: 'Aguarde antes de tentar novamente.' };
  try {
    const client = await createAdminClient();
    const { error } = await client.auth.signInWithPassword(parsed.data);
    if (error)
      return {
        message:
          'Acesso não autorizado. Confira as credenciais ou aguarde antes de tentar novamente.',
      };
    return { message: 'Primeira etapa concluída. Informe o código do autenticador abaixo.' };
  } catch {
    return { message: 'Autenticação indisponível.' };
  }
}
export async function verifyMfa(_state: { message: string }, form: FormData) {
  await assertSameOrigin();
  const code = z
    .string()
    .regex(/^\d{6}$/)
    .safeParse(form.get('code'));
  if (!code.success) return { message: 'Informe os seis dígitos do autenticador.' };
  try {
    const client = await createAdminClient();
    const { data: identity } = await client.auth.getUser();
    if (!identity.user || !adminAttempts.take('mfa', identity.user.id))
      return { message: 'Verificação indisponível. Aguarde ou inicie a sessão novamente.' };
    const { data } = await client.auth.mfa.listFactors();
    const factor = data?.totp.find((f) => f.status === 'verified');
    if (!factor)
      return { message: 'MFA não cadastrado. Solicite o provisionamento ao operador responsável.' };
    const { error } = await client.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code: code.data,
    });
    if (error) return { message: 'Código inválido ou expirado.' };
  } catch {
    return { message: 'Não foi possível verificar o MFA.' };
  }
  redirect('/admin');
}
export async function logout() {
  await assertSameOrigin();
  const client = await createAdminClient();
  await client.auth.signOut();
  redirect('/admin/login');
}
