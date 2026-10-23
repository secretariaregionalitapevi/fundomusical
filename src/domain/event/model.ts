export interface MusicEvent {
  id: string;
  fundId: 'fundo-musical-itapevi';
  title: string;
  date: string | null;
  region: string;
  status: 'draft' | 'published' | 'archived';
}
