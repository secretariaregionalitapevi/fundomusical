import { expect, it } from 'vitest';
import { crc16, validateBankQr } from '@/domain/offering/bank-qr';
it('CRC16 usa o vetor padrão de CCITT-FALSE', () => expect(crc16('123456789')).toBe('29B1'));
it('texto de demonstração não pode ser tratado como QR bancário', () =>
  expect(() => validateBankQr('SIMULACAO-NAO-PAGAVEL', 'SIMULACAO')).toThrow());
it('BR Code truncado ou com CRC incorreto não é disponibilizado', () =>
  expect(() =>
    validateBankQr('000201-DADOS-INVALIDOS-SEM-CHAVE-REAL63040000', 'NAO-PAGAVEL'),
  ).toThrow());
