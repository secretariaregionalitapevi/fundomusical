import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getEnvironment } from '@/lib/env';

export async function createAdminClient() {
  const env = getEnvironment();
  if (
    !env.ADMIN_ENABLED ||
    env.DATA_BACKEND !== 'supabase' ||
    !env.SUPABASE_URL ||
    !env.SUPABASE_PUBLISHABLE_KEY
  )
    throw new Error('Backend administrativo não configurado.');
  const store = await cookies();
  return createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookieOptions: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* Em Server Components, o proxy renova cookies. */
        }
      },
    },
  });
}
