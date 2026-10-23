import { z } from 'zod';
// Validação de formato, não consulta cadastral nem confirmação de titularidade.
// Compatível com CNPJ numérico e alfanumérico (Receita Federal, julho/2026).
export const cnpjFormatSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z0-9]{12}[0-9]{2}$/,
    'Informe 14 posições sem pontuação; as duas últimas devem ser numéricas.',
  );
