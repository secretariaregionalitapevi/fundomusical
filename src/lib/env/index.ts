import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATA_BACKEND: z.enum(['local', 'supabase']).default('local'),
  OFFERING_MODE: z
    .enum(['disabled', 'fund_static_pix', 'fund_dynamic_pix', 'fund_bank_integration'])
    .default('disabled'),
  DEMO_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  ADMIN_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  FUND_PURPOSE_CODE: z.literal('FUNDO_MUSICAL').default('FUNDO_MUSICAL'),
  FUND_ID: z.literal('fundo-musical-itapevi').default('fundo-musical-itapevi'),
  REGIONAL_ID: z.literal('regional-itapevi').default('regional-itapevi'),
  SUPABASE_URL: z.string().default(''),
  SUPABASE_PUBLISHABLE_KEY: z.string().default(''),
});
export type Environment = z.infer<typeof envSchema>;
export function getEnvironment(): Environment {
  const result = envSchema.safeParse(process.env);
  if (!result.success)
    throw new Error('Configuração inválida. Revise os nomes e formatos em .env.example.');
  return result.data;
}
