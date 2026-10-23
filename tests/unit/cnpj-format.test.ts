import { expect, it } from 'vitest';
import { cnpjFormatSchema } from '@/lib/validation/cnpj';
it('preserva formato numérico sem alegar consulta cadastral', () =>
  expect(cnpjFormatSchema.parse('00000000000000')).toBe('00000000000000'));
it('aceita letras nas primeiras doze posições e normaliza caixa', () =>
  expect(cnpjFormatSchema.parse(' aaaaaaaaaaaa00 ')).toBe('AAAAAAAAAAAA00'));
it('rejeita pontuação, tamanho incorreto e letras nos verificadores', () => {
  for (const value of ['000.000', 'AAAAAAAAAAAAAA', '<script>', '123'])
    expect(cnpjFormatSchema.safeParse(value).success).toBe(false);
});
