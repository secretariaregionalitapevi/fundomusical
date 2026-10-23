import type { OfferingProvider, RecipientConfigurationRepository } from '@/application/ports';
import {
  assertFund,
  DEMO_PAYLOAD,
  type OfferingContext,
  type OfferingResult,
} from '@/domain/offering/model';
import { recipientStatus } from '@/domain/recipient/model';

export class DisabledOfferingProvider implements OfferingProvider {
  async getOffering(context: OfferingContext): Promise<OfferingResult> {
    assertFund(context);
    return { kind: 'unavailable', reason: 'not_configured' };
  }
}
export class MockOfferingProvider implements OfferingProvider {
  constructor(private readonly environment: string) {}
  async getOffering(context: OfferingContext): Promise<OfferingResult> {
    assertFund(context);
    if (this.environment === 'production')
      return { kind: 'unavailable', reason: 'integration_not_certified' };
    return {
      kind: 'demo',
      payload: DEMO_PAYLOAD,
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      purposeCode: 'FUNDO_MUSICAL',
    };
  }
}
/** Ponto de extensão deliberadamente bloqueado até certificação bancária documentada.
 * Não gera BR Code, não aceita payload arbitrário e não faz chamadas financeiras. */
export class FundMusicBankIntegration implements OfferingProvider {
  constructor(private readonly recipients: RecipientConfigurationRepository) {}
  async getOffering(context: OfferingContext): Promise<OfferingResult> {
    assertFund(context);
    const status = recipientStatus(await this.recipients.getActive());
    if (status === 'not_configured' || status === 'pending' || status === 'expired')
      return { kind: 'unavailable', reason: status };
    return { kind: 'unavailable', reason: 'integration_not_certified' };
  }
}
