import 'server-only';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createAdminClient } from '@/infrastructure/supabase/client';
export const profileSchema = z.object({
  auth_user_id: z.uuid(),
  role: z.enum(['viewer', 'editor', 'approver', 'auditor']),
  status: z.literal('active'),
});
export async function requireAdmin(
  roles: z.infer<typeof profileSchema>['role'][] = ['viewer', 'editor', 'approver', 'auditor'],
) {
  const client = await createAdminClient();
  const { data: identity, error } = await client.auth.getUser();
  if (error || !identity.user) redirect('/admin/login');
  const { data: assurance } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== 'aal2') redirect('/admin/login');
  const { data } = await client
    .from('admin_profiles')
    .select('auth_user_id,role,status')
    .eq('auth_user_id', identity.user.id)
    .eq('status', 'active')
    .maybeSingle();
  const profile = profileSchema.safeParse(data);
  if (!profile.success || !roles.includes(profile.data.role))
    throw new Error('Acesso administrativo não autorizado.');
  return { client, profile: profile.data };
}
