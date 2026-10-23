import { describe, expect, it } from 'vitest';
import { recipientStatus, recipientSchema } from '@/domain/recipient/model';
import { recipient } from '../fixtures/recipient';
import { assertApproval } from '@/domain/recipient/approval';
describe('Conta e duas pessoas', () => {
  const now = new Date('2026-10-23T12:00:00Z');
  it('distingue ausente, pendente, aprovada e expirada', () => {
    expect(recipientStatus(null, now)).toBe('not_configured');
    expect(recipientStatus(recipient({ status: 'pending' }), now)).toBe('pending');
    expect(recipientStatus(recipient(), now)).toBe('approved');
    expect(recipientStatus(recipient({ expiresAt: now.toISOString() }), now)).toBe('expired');
  });
  it.each([
    { approvedBy: null },
    { approvedAt: null },
    { approvalEvidenceRef: null },
    { approvedBy: '22222222-2222-4222-8222-222222222222' },
    { segregationApproved: false },
    { approvedAt: '2099-01-01T00:00:00.000Z' },
  ])('rejeita aprovação incompleta: %j', (changes) =>
    expect(recipientStatus(recipient(changes), now)).toBe('unavailable'),
  );
  it('rejeita dados financeiros de outro fundo', () =>
    expect(
      recipientSchema.safeParse({ ...recipient(), purposeCode: 'OFERTA_REGULAR' }).success,
    ).toBe(false));
  it('não aceita autoaprovação, falta de MFA ou role errada', () => {
    expect(() => assertApproval('a', { id: 'a', role: 'approver', mfaVerified: true })).toThrow();
    expect(() => assertApproval('a', { id: 'b', role: 'approver', mfaVerified: false })).toThrow();
    expect(() => assertApproval('a', { id: 'b', role: 'editor', mfaVerified: true })).toThrow();
    expect(() =>
      assertApproval('a', { id: 'b', role: 'approver', mfaVerified: true }),
    ).not.toThrow();
  });
  it('trata dados inválidos como indisponível', () =>
    expect(recipientStatus({ pixKey: '<script>' }, now)).toBe('unavailable'));
});
