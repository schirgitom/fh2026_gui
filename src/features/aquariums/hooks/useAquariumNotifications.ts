import { useEffect, useMemo, useState } from 'react';
import { LogLevel } from '@microsoft/signalr';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';
import { AquariumEvent } from '@/features/aquariums/api/eventsApi';
import { FeedingStatus } from '@/features/aquariums/api/feedingApi';
import { NotificationClient } from '@/features/aquariums/api/notifications.client';
import { apiConfig } from '@/shared/config/api';

export type NotificationConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

const MAX_EVENTS = 50;

const prependEvent = (current: AquariumEvent[], nextEvent: AquariumEvent): AquariumEvent[] =>
  [nextEvent, ...current].slice(0, MAX_EVENTS);

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Verbindung zum Event-Stream fehlgeschlagen.';
};

const createEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useAquariumNotifications = (aquariumId?: string) => {
  const token = useAuthStore((state) => state.token);
  const [events, setEvents] = useState<AquariumEvent[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<NotificationConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [latestFeedingStatus, setLatestFeedingStatus] = useState<FeedingStatus | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const client = new NotificationClient({
      baseUrl: apiConfig.signalrBaseUrl,
      logLevel: LogLevel.Warning,
      httpOptions: {
        accessTokenFactory: () => useAuthStore.getState().token ?? ''
      },
      handlers: {
        feedingUpdate: (payload) => {
          if (aquariumId && payload.aquariumId !== aquariumId) {
            return;
          }
          setLatestFeedingStatus(payload);
          setEvents((current) =>
            prependEvent(current, {
              id: createEventId(),
              type: 'feeding:update',
              aquariumId: payload.aquariumId,
              occurredAt: new Date().toISOString(),
              payload
            })
          );
        },
        ruleTriggered: (payload) => {
          if (aquariumId && payload.aquariumId !== aquariumId) {
            return;
          }
          setEvents((current) =>
            prependEvent(current, {
              id: createEventId(),
              type: 'rule:triggered',
              aquariumId: payload.aquariumId,
              occurredAt: payload.occurredAt,
              payload
            })
          );
        },
        reconnecting: (reconnectError) => {
          setConnectionStatus('reconnecting');
          setError(reconnectError ? getErrorMessage(reconnectError) : null);
        },
        reconnected: async () => {
          setConnectionStatus('connected');
          setError(null);
          try {
            if (aquariumId) {
              await client.subscribeToAquarium(aquariumId);
            }
          } catch (subscribeError) {
            setError(getErrorMessage(subscribeError));
          }
        },
        closed: (closeError) => {
          setConnectionStatus('disconnected');
          if (closeError) {
            setError(getErrorMessage(closeError));
          }
        }
      }
    });

    let isMounted = true;
    let retryTimeout: number | null = null;

    const start = async () => {
      setConnectionStatus('reconnecting');
      setError(null);

      try {
        await client.start();
        if (aquariumId) {
          await client.subscribeToAquarium(aquariumId);
        }
        if (!isMounted) {
          await client.stop();
          return;
        }
        setConnectionStatus('connected');
      } catch (startError) {
        if (!isMounted) return;
        setConnectionStatus('disconnected');
        setError(getErrorMessage(startError));
        retryTimeout = window.setTimeout(() => {
          void start();
        }, 5_000);
      }
    };

    void start();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
      if (aquariumId) {
        void client.unsubscribeFromAquarium(aquariumId).catch(() => undefined);
      }
      void client.stop();
    };
  }, [aquariumId, token]);

  return useMemo(
    () => ({
      connectionStatus,
      error,
      events,
      latestFeedingStatus,
      setLatestFeedingStatus
    }),
    [connectionStatus, error, events, latestFeedingStatus]
  );
};
