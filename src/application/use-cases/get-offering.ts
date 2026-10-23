import type { OfferingProvider } from '@/application/ports';
import { FUND } from '@/domain/offering/model';
export async function getOffering(provider: OfferingProvider) {
  return provider.getOffering(FUND);
}
