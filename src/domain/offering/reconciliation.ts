export interface ReconciliationBatch {
  fundId: string;
  purposeCode: string;
  amountCents: number;
  status: 'pending' | 'reconciled' | 'rejected';
}
export function reconciledTotal(batches: ReconciliationBatch[], fundId: string): number {
  if (fundId !== 'fundo-musical-itapevi') throw new Error('Fundo incompatível.');
  return batches
    .filter(
      (b) => b.fundId === fundId && b.purposeCode === 'FUNDO_MUSICAL' && b.status === 'reconciled',
    )
    .reduce((sum, b) => {
      if (
        !Number.isSafeInteger(b.amountCents) ||
        b.amountCents < 0 ||
        !Number.isSafeInteger(sum + b.amountCents)
      )
        throw new Error('Valor inválido.');
      return sum + b.amountCents;
    }, 0);
}
