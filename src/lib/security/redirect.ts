const allowedPaths = new Set([
  '/',
  '/admin',
  '/admin/login',
  '/como-contribuir',
  '/seguranca',
  '/privacidade',
]);
export function safeRedirect(path: string): string {
  return allowedPaths.has(path) ? path : '/';
}
