import { NextRequest, NextResponse } from 'next/server';
import { contentSecurityPolicy } from '@/lib/security/headers';
import { refreshAdminSession } from '@/infrastructure/supabase/proxy-session';

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = contentSecurityPolicy(nonce, process.env.NODE_ENV === 'development');
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);
  const admin = request.nextUrl.pathname.startsWith('/admin');
  const disabled = process.env.ADMIN_ENABLED !== 'true' || process.env.DATA_BACKEND !== 'supabase';
  if (admin && disabled && process.env.NODE_ENV === 'production') {
    return new NextResponse('Área administrativa indisponível.', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Security-Policy': csp,
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }
  const cookies = admin && !disabled ? await refreshAdminSession(request, headers) : [];
  const response = NextResponse.next({ request: { headers } });
  cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Cache-Control', 'no-store');
  if (admin || !process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://'))
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|icons/|branding/|sw.js|offline.html|favicon.ico).*)'],
};
