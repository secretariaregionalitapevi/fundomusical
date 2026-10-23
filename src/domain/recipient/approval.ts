export type Operator = {
  id: string;
  role: 'viewer' | 'editor' | 'approver' | 'auditor';
  mfaVerified: boolean;
};
export function assertApproval(requestedBy: string, operator: Operator) {
  if (!operator.mfaVerified || operator.role !== 'approver' || requestedBy === operator.id) {
    throw new Error('A aprovação exige outro operador autorizado e MFA.');
  }
}
