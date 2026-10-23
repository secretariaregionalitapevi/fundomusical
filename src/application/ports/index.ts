import type { OfferingContext, OfferingResult } from '@/domain/offering/model';
import type { RecipientConfiguration } from '@/domain/recipient/model';
import type { MusicEvent } from '@/domain/event/model';
import type { AggregateMetric } from '@/domain/metrics/model';

export interface OfferingProvider {
  getOffering(context: OfferingContext): Promise<OfferingResult>;
}
export interface RecipientConfigurationRepository {
  getActive(): Promise<RecipientConfiguration | null>;
}
export interface EventRepository {
  listPublished(): Promise<MusicEvent[]>;
}
export interface AggregateMetricsRepository {
  listDaily(): Promise<AggregateMetric[]>;
}
export interface AuditEntry {
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  createdAt: string;
}
export interface AuditRepository {
  listRecent(): Promise<AuditEntry[]>;
}
