export const HUB_PATH = '/hubs/notifications';

export const SIGNALR_EVENTS = {
  FEEDING_UPDATE: 'feeding:update',
  RULE_TRIGGERED: 'rule:triggered'
} as const;

export const HUB_METHODS = {
  SUBSCRIBE_TO_AQUARIUM: 'SubscribeToAquarium',
  UNSUBSCRIBE_FROM_AQUARIUM: 'UnsubscribeFromAquarium',
  SUBSCRIBE_TO_ALL: 'SubscribeToAll',
  UNSUBSCRIBE_FROM_ALL: 'UnsubscribeFromAll'
} as const;

export interface FeedingUpdatePayload {
  aquariumId: string;
  nextFeedingAt: string;
  remainingSeconds: number;
  isOverdue: boolean;
  message: string | null;
}

export interface RuleTriggeredPayload {
  aquariumId: string;
  ruleName: string;
  description: string;
  occurredAt: string;
}
