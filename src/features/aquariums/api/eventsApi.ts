import { http } from '@/shared/api/http';
import { apiConfig } from '@/shared/config/api';
import {
  FeedingUpdatePayload,
  RuleTriggeredPayload
} from '@/features/aquariums/api/notifications.contract';

export type AquariumEvent =
  | {
      id: string;
      type: 'feeding:update';
      aquariumId: string;
      occurredAt: string;
      payload: FeedingUpdatePayload;
    }
  | {
      id: string;
      type: 'rule:triggered';
      aquariumId: string;
      occurredAt: string;
      payload: RuleTriggeredPayload;
    };

interface PersistedEventDto {
  id: string;
  aquariumId: string;
  type: string;
  payload: string;
  occurredAtUtc: string;
}

const parseJsonPayload = <T>(payload: string): T | null => {
  try {
    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
};

const mapRuleTriggeredEvent = (item: PersistedEventDto): AquariumEvent | null => {
  const payload = parseJsonPayload<{
    AquariumId?: string;
    aquariumId?: string;
    RuleName?: string;
    ruleName?: string;
    Description?: string;
    description?: string;
    OccurredAt?: string;
    occurredAt?: string;
  }>(item.payload);

  if (!payload) {
    return null;
  }

  const aquariumId = payload.AquariumId ?? payload.aquariumId ?? item.aquariumId;
  const occurredAt = payload.OccurredAt ?? payload.occurredAt ?? item.occurredAtUtc;

  return {
    id: item.id,
    type: 'rule:triggered',
    aquariumId,
    occurredAt,
    payload: {
      aquariumId,
      ruleName: payload.RuleName ?? payload.ruleName ?? 'unknown-rule',
      description: payload.Description ?? payload.description ?? '',
      occurredAt
    }
  };
};

const mapFeedingUpdateEvent = (item: PersistedEventDto): AquariumEvent | null => {
  const payload = parseJsonPayload<{
    AquariumId?: string;
    aquariumId?: string;
    NextFeedingAt?: string;
    nextFeedingAt?: string;
    RemainingSeconds?: number;
    remainingSeconds?: number;
    IsOverdue?: boolean;
    isOverdue?: boolean;
    Message?: string | null;
    message?: string | null;
  }>(item.payload);

  if (!payload) {
    return null;
  }

  const aquariumId = payload.AquariumId ?? payload.aquariumId ?? item.aquariumId;

  return {
    id: item.id,
    type: 'feeding:update',
    aquariumId,
    occurredAt: item.occurredAtUtc,
    payload: {
      aquariumId,
      nextFeedingAt: payload.NextFeedingAt ?? payload.nextFeedingAt ?? item.occurredAtUtc,
      remainingSeconds: payload.RemainingSeconds ?? payload.remainingSeconds ?? 0,
      isOverdue: payload.IsOverdue ?? payload.isOverdue ?? false,
      message: payload.Message ?? payload.message ?? null
    }
  };
};

const mapPersistedEvent = (item: PersistedEventDto): AquariumEvent | null => {
  if (item.type.endsWith('RuleTriggeredIntegrationEvent')) {
    return mapRuleTriggeredEvent(item);
  }

  if (item.type.endsWith('FeedingUpdatedIntegrationEvent')) {
    return mapFeedingUpdateEvent(item);
  }

  return null;
};

export const eventsApi = {
  getByAquarium: async (aquariumId: string, take = 100) => {
    const { data } = await http.get<PersistedEventDto[]>(
      `${apiConfig.signalrBaseUrl}/api/events/${aquariumId}`,
      {
        params: { take }
      }
    );

    return data
      .map(mapPersistedEvent)
      .filter((event): event is AquariumEvent => event !== null);
  }
};
