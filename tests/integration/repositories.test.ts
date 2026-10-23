import { expect, it, vi } from 'vitest';
import {
  LocalRecipientRepository,
  LocalEventRepository,
} from '@/infrastructure/config/local-repositories';
import { SupabaseEventRepository } from '@/infrastructure/supabase/repositories';
import type { SupabaseClient } from '@supabase/supabase-js';
it('storage local não inventa conta ou eventos', async () => {
  expect(await new LocalRecipientRepository().getActive()).toBeNull();
  expect(await new LocalEventRepository().listPublished()).toEqual([]);
});
it('adapter Supabase filtra fundo e valida o contrato sem acesso a rede', async () => {
  const chain = { select: vi.fn(), eq: vi.fn(), order: vi.fn() };
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.order.mockResolvedValue({
    data: [
      {
        id: '11111111-1111-4111-8111-111111111111',
        fund_id: 'fundo-musical-itapevi',
        title: 'FIXTURE',
        event_date: null,
        region: 'TESTE',
        status: 'published',
      },
    ],
    error: null,
  });
  const client = { from: vi.fn().mockReturnValue(chain) } as unknown as SupabaseClient;
  expect(await new SupabaseEventRepository(client).listPublished()).toHaveLength(1);
  expect(chain.eq).toHaveBeenCalledWith('fund_id', 'fundo-musical-itapevi');
  expect(chain.eq).toHaveBeenCalledWith('status', 'published');
});
