import type { RecipientConfiguration } from '@/domain/recipient/model';
export function recipient(overrides: Partial<RecipientConfiguration> = {}): RecipientConfiguration {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    fundId: 'fundo-musical-itapevi',
    purposeCode: 'FUNDO_MUSICAL',
    regionalId: 'regional-itapevi',
    beneficiaryLegalName: 'FIXTURE NÃO É CONTA REAL',
    beneficiaryDocument: '00000000000000',
    pixKey: 'SIMULACAO-NAO-PAGAVEL',
    sourceType: 'dedicated_account',
    status: 'approved',
    requestedBy: '22222222-2222-4222-8222-222222222222',
    approvedBy: '33333333-3333-4333-8333-333333333333',
    approvalEvidenceRef: 'FIXTURE-SEM-APROVACAO-REAL',
    approvedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2099-01-01T00:00:00.000Z',
    version: 1,
    checksum: 'a'.repeat(64),
    segregationApproved: true,
    ...overrides,
  };
}
