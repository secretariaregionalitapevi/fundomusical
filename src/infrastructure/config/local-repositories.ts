import type {
  RecipientConfigurationRepository,
  EventRepository,
  AggregateMetricsRepository,
  AuditRepository,
} from '@/application/ports';
export class LocalRecipientRepository implements RecipientConfigurationRepository {
  async getActive() {
    return null;
  }
}
export class LocalEventRepository implements EventRepository {
  async listPublished() {
    return [];
  }
}
export class LocalMetricsRepository implements AggregateMetricsRepository {
  async listDaily() {
    return [];
  }
}
export class LocalAuditRepository implements AuditRepository {
  async listRecent() {
    return [];
  }
}
