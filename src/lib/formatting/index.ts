export function formatBRL(cents: number) {
  if (!Number.isSafeInteger(cents)) throw new Error('Valor em centavos inválido.');
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}
