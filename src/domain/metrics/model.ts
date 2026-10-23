export interface AggregateMetric {
  day: string;
  eventId: string | null;
  channel: 'direct' | 'qr' | 'nfc' | 'whatsapp';
  pageViews: number;
  copyClicks: number;
}
