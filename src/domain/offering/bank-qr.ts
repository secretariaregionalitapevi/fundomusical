/** Lê BR Code estático já emitido pelo banco. Nunca cria chave ou payload. */
export function crc16(value: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(value)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
function fields(value: string): Map<string, string> {
  const result = new Map<string, string>();
  for (let offset = 0; offset < value.length;) {
    const header = value.slice(offset, offset + 4);
    if (!/^\d{4}$/.test(header)) throw new Error('BR Code inválido.');
    const id = header.slice(0, 2);
    const length = Number(header.slice(2));
    if (!length || offset + 4 + length > value.length || result.has(id))
      throw new Error('Campo inválido.');
    result.set(id, value.slice(offset + 4, offset + 4 + length));
    offset += 4 + length;
  }
  return result;
}
export function validateBankQr(payload: string, expectedKey: string): void {
  // Apenas BR Code ASCII estático, sem valor fixo, como o documento enviado.
  if (!/^[\x20-\x7e]{40,512}$/.test(payload) || !/6304[A-F0-9]{4}$/.test(payload))
    throw new Error('Formato não suportado.');
  if (crc16(payload.slice(0, -4)) !== payload.slice(-4)) throw new Error('CRC inválido.');
  const data = fields(payload);
  const allowed = new Set(['00', '01', '26', '52', '53', '58', '59', '60', '62', '63']);
  if ([...data.keys()].some((key) => !allowed.has(key)))
    throw new Error('Modalidade não suportada.');
  const account = fields(data.get('26') ?? '');
  const additional = fields(data.get('62') ?? '');
  if (
    data.get('00') !== '01' ||
    (data.has('01') && data.get('01') !== '11') ||
    data.get('52') !== '0000' ||
    data.get('53') !== '986' ||
    data.get('58') !== 'BR' ||
    !data.get('59') ||
    !data.get('60') ||
    !additional.get('05') ||
    account.get('00')?.toLowerCase() !== 'br.gov.bcb.pix' ||
    account.get('01') !== expectedKey ||
    account.has('25')
  )
    throw new Error('QR não corresponde ao Pix cadastrado.');
}
