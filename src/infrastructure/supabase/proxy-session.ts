import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
export async function refreshAdminSession(request: NextRequest, headers: Headers) {
  const updates: { name: string; value: string; options: CookieOptions }[] = [];
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return updates;
  const client = createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          updates.push({ name, value, options });
        });
        headers.set('cookie', request.cookies.toString());
      },
    },
  });
  try {
    await client.auth.getClaims();
  } catch {
    /* O guard server-side nega a sessão indisponível. */
  }
  return updates;
}
