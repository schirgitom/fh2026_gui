import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Tabs } from '@/shared/ui/Tabs';
import { PageHeader } from '@/shared/components/PageHeader';
import { useAquariums } from '@/features/aquariums/hooks/useAquariums';
import { Card } from '@/shared/ui/Card';
import { FishTable } from '@/features/fish/components/FishTable';
import { FishFormModal } from '@/features/fish/components/FishFormModal';
import { useFish, useFishMutations } from '@/features/fish/hooks/useFish';
import { CoralTable } from '@/features/corals/components/CoralTable';
import { CoralFormModal } from '@/features/corals/components/CoralFormModal';
import { useCorals, useCoralMutations } from '@/features/corals/hooks/useCorals';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { LatestMeasurements } from '@/features/measurements/components/LatestMeasurements';
import { MeasurementsChart } from '@/features/measurements/components/MeasurementsChart';
import { MeasurementAggregates } from '@/features/measurements/components/MeasurementAggregates';
import { useLatestMeasurement } from '@/features/measurements/hooks/useMeasurements';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { Fish, Coral } from '@/shared/types';
import { useI18n } from '@/i18n/LanguageProvider';
import { AquariumImageGallery } from '@/features/aquarium-images/components/AquariumImageGallery';
import { useAquariumPreviewImage } from '@/features/aquarium-images/hooks/useAquariumImages';
import { Badge } from '@/shared/ui/Badge';
import { AquariumEvent } from '@/features/aquariums/api/eventsApi';
import { useAquariumEvents } from '@/features/aquariums/hooks/useAquariumEvents';
import { useAquariumNotifications } from '@/features/aquariums/hooks/useAquariumNotifications';
import {
  useAquariumFeeding,
  useAquariumFeedingInterval,
  useAquariumFeedingIntervalValue,
  useAquariumFeedingStatus
} from '@/features/aquariums/hooks/useAquariumFeeding';
import { FeedingStatus } from '@/features/aquariums/api/feedingApi';

const formatDateTime = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

const getEventKey = (event: AquariumEvent) => {
  if (event.type === 'rule:triggered') {
    return [event.type, event.payload.ruleName, event.occurredAt].join(':');
  }

  return [event.type, event.payload.nextFeedingAt, event.occurredAt].join(':');
};

const formatRemainingTime = (remainingSeconds: number, locale: string) => {
  const totalSeconds = Math.abs(remainingSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formatter = new Intl.NumberFormat(locale);

  return [hours, minutes, seconds]
    .map((part) => formatter.format(part).padStart(2, '0'))
    .join(':');
};

const getFeedingStatusVariant = (
  status: FeedingStatus | null
): 'danger' | 'info' | 'success' => {
  if (!status) return 'info';
  return status.isOverdue ? 'danger' : 'success';
};

export const AquariumDetailPage = () => {
  const { aquariumId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: aquariums } = useAquariums();
  const { t, locale } = useI18n();
  const aquarium = useMemo(
    () => aquariums?.find((item) => item.id === aquariumId),
    [aquariums, aquariumId]
  );
  const { data: previewImage } = useAquariumPreviewImage(aquariumId ?? '');
  const isFreshwater = aquarium?.type === 'freshwater';
  const tabOptions = [
    { id: 'overview', label: t('detail.tabs.overview') },
    { id: 'fish', label: t('detail.tabs.fish') },
    { id: 'images', label: t('detail.tabs.images') },
    { id: 'measurements', label: t('detail.tabs.measurements') }
  ];
  if (!isFreshwater) {
    tabOptions.splice(2, 0, { id: 'corals', label: t('detail.tabs.corals') });
  }
  const activeTabParam = searchParams.get('tab') ?? 'overview';
  const activeTab = tabOptions.some((tab) => tab.id === activeTabParam)
    ? activeTabParam
    : 'overview';
  const setActiveTab = (tabId: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set('tab', tabId);
      return next;
    });
  };

  const { data: fish, isLoading: fishLoading } = useFish(aquariumId ?? '');
  const { create: createFish, update: updateFish, remove: removeFish } = useFishMutations(
    aquariumId ?? ''
  );
  const [fishModalOpen, setFishModalOpen] = useState(false);
  const [fishEdit, setFishEdit] = useState<Fish | null>(null);
  const [fishDelete, setFishDelete] = useState<Fish | null>(null);

  const { data: corals, isLoading: coralsLoading } = useCorals(aquariumId ?? '');
  const { create: createCoral, update: updateCoral, remove: removeCoral } = useCoralMutations(
    aquariumId ?? ''
  );
  const [coralModalOpen, setCoralModalOpen] = useState(false);
  const [coralEdit, setCoralEdit] = useState<Coral | null>(null);
  const [coralDelete, setCoralDelete] = useState<Coral | null>(null);

  const { data: latestMeasurement, isLoading: measurementLoading } = useLatestMeasurement(
    aquariumId ?? ''
  );
  const { connectionStatus, error: notificationError, events, latestFeedingStatus, setLatestFeedingStatus } =
    useAquariumNotifications(aquariumId);
  const {
    data: persistedEvents,
    isLoading: persistedEventsLoading,
    error: persistedEventsError
  } = useAquariumEvents(aquariumId ?? '', 100);
  const feedMutation = useAquariumFeeding(aquariumId ?? '', {
    onSuccess: (status) => setLatestFeedingStatus(status)
  });
  const { data: feedingStatus } = useAquariumFeedingStatus(aquariumId ?? '');
  const { data: currentFeedingInterval } = useAquariumFeedingIntervalValue(aquariumId ?? '');
  const feedingIntervalMutation = useAquariumFeedingInterval(aquariumId ?? '', {
    onSuccess: (status) => {
      if (status) {
        setLatestFeedingStatus(status);
      }
      setIntervalMinutes((current) => {
        const parsed = Number.parseInt(current, 10);
        return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : current;
      });
    }
  });
  const [intervalMinutes, setIntervalMinutes] = useState('60');
  const [intervalError, setIntervalError] = useState<string | null>(null);
  const combinedRuleEvents = useMemo(() => {
    const merged = [...events, ...(persistedEvents ?? [])].filter(
      (event): event is Extract<AquariumEvent, { type: 'rule:triggered' }> =>
        event.type === 'rule:triggered'
    );
    const uniqueEvents = new Map<string, Extract<AquariumEvent, { type: 'rule:triggered' }>>();

    for (const event of merged) {
      const key = getEventKey(event);
      if (!uniqueEvents.has(key)) {
        uniqueEvents.set(key, event);
      }
    }

    return [...uniqueEvents.values()].sort(
      (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime()
    );
  }, [events, persistedEvents]);
  const displayedFeedingStatus = latestFeedingStatus ?? feedingStatus ?? null;

  useEffect(() => {
    if (typeof currentFeedingInterval === 'number' && currentFeedingInterval > 0) {
      setIntervalMinutes(String(currentFeedingInterval));
    }
  }, [currentFeedingInterval]);

  if (!aquarium) {
    return (
      <Card>
        <p className="text-ink-600">{t('detail.notFound')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={aquarium.name}
        subtitle={
          aquarium.type === 'freshwater'
            ? t('aquarium.type.freshwater')
            : t('aquarium.type.seawater')
        }
      />

      <Tabs tabs={tabOptions} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="flex h-full flex-col">
            <h3 className="text-lg font-semibold text-ink-900">{t('detail.summary')}</h3>
            <div className="mt-4 grid gap-4 text-sm text-ink-600">
              <div className="flex items-center justify-between">
                <span>{t('detail.volume')}</span>
                <span className="font-semibold text-ink-900">{aquarium.liters} L</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('detail.dimensions')}</span>
                <span className="font-semibold text-ink-900">
                  {aquarium.length} x {aquarium.depth} x {aquarium.height} cm
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('detail.fishCount')}</span>
                <span className="font-semibold text-ink-900">{fish?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('detail.coralCount')}</span>
                <span className="font-semibold text-ink-900">{isFreshwater ? '-' : corals?.length ?? 0}</span>
              </div>
            </div>
            <div className="mt-6 min-h-48 flex-1 overflow-hidden rounded-xl border border-ink-100">
              {previewImage ? (
                <img
                  src={previewImage.imageUrl}
                  alt={previewImage.name || t('images.defaultName')}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-50 to-sea-50 text-sm text-ink-500">
                  {t('images.emptyTitle')}
                </div>
              )}
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-sea-50 via-white to-ink-100">
            <h3 className="text-lg font-semibold text-ink-900">{t('detail.latestMeasurement')}</h3>
            {measurementLoading && <Skeleton className="mt-4 h-40" />}
            {!measurementLoading && latestMeasurement && (
              <div className="mt-4">
                <LatestMeasurements measurement={latestMeasurement} />
              </div>
            )}
            {!measurementLoading && !latestMeasurement && (
              <div className="mt-4">
                <EmptyState
                  title={t('measurement.emptyTitle')}
                  description={t('measurement.emptyDescription')}
                />
              </div>
            )}
          </Card>
          <Card className="space-y-6 lg:col-span-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-ink-900">{t('detail.feeding.title')}</h3>
                  <Badge
                    label={t(`detail.connection.${connectionStatus}`)}
                    variant={
                      connectionStatus === 'connected'
                        ? 'success'
                        : connectionStatus === 'reconnecting'
                          ? 'warning'
                          : 'info'
                    }
                  />
                  {displayedFeedingStatus && (
                    <Badge
                      label={
                        displayedFeedingStatus.isOverdue
                          ? t('detail.feeding.overdue')
                          : t('detail.feeding.onSchedule')
                      }
                      variant={getFeedingStatusVariant(displayedFeedingStatus)}
                    />
                  )}
                </div>
                <p className="mt-2 text-sm text-ink-600">{t('detail.feeding.description')}</p>
              </div>
              <Button
                onClick={() => {
                  if (!aquariumId) return;
                  feedMutation.reset();
                  void feedMutation.mutateAsync();
                }}
                disabled={!aquariumId || feedMutation.isPending}
              >
                {feedMutation.isPending ? t('detail.feeding.pending') : t('detail.feeding.action')}
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <Input
                type="number"
                min={1}
                step={1}
                label={t('detail.feeding.intervalLabel')}
                value={intervalMinutes}
                error={intervalError ?? undefined}
                onChange={(event) => {
                  setIntervalError(null);
                  setIntervalMinutes(event.target.value);
                }}
              />
              <Button
                variant="secondary"
                disabled={!aquariumId || feedingIntervalMutation.isPending}
                onClick={() => {
                  if (!aquariumId) return;

                  const parsed = Number.parseInt(intervalMinutes, 10);
                  if (!Number.isFinite(parsed) || parsed <= 0) {
                    setIntervalError(t('detail.feeding.intervalInvalid'));
                    return;
                  }

                  setIntervalError(null);
                  feedingIntervalMutation.reset();
                  void feedingIntervalMutation.mutateAsync(parsed);
                }}
              >
                {feedingIntervalMutation.isPending
                  ? t('detail.feeding.intervalSaving')
                  : t('detail.feeding.intervalAction')}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-ink-100 bg-ink-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">
                  {t('detail.feeding.last')}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-900">
                  {displayedFeedingStatus
                    ? displayedFeedingStatus.lastFeedingAt
                      ? formatDateTime(displayedFeedingStatus.lastFeedingAt, locale)
                      : t('detail.feeding.never')
                    : t('detail.feeding.awaitingData')}
                </p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-ink-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">
                  {t('detail.feeding.next')}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-900">
                  {displayedFeedingStatus
                    ? formatDateTime(displayedFeedingStatus.nextFeedingAt, locale)
                    : t('detail.feeding.awaitingData')}
                </p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-ink-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">
                  {t('detail.feeding.remaining')}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    displayedFeedingStatus?.isOverdue ? 'text-red-700' : 'text-ink-900'
                  }`}
                >
                  {displayedFeedingStatus
                    ? displayedFeedingStatus.isOverdue
                      ? t('detail.feeding.overdue')
                      : formatRemainingTime(displayedFeedingStatus.remainingSeconds, locale)
                    : t('detail.feeding.awaitingData')}
                </p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-ink-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">
                  {t('detail.feeding.status')}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    displayedFeedingStatus?.isOverdue ? 'text-red-700' : 'text-ink-900'
                  }`}
                >
                  {displayedFeedingStatus
                    ? displayedFeedingStatus.isOverdue
                      ? t('detail.feeding.overdue')
                      : t('detail.feeding.onSchedule')
                    : t('detail.feeding.awaitingData')}
                </p>
              </div>
            </div>

            {(feedMutation.error || feedingIntervalMutation.error || notificationError) && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {feedMutation.error instanceof Error
                  ? feedMutation.error.message
                  : feedingIntervalMutation.error instanceof Error
                    ? feedingIntervalMutation.error.message
                  : notificationError ?? t('detail.feeding.genericError')}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-ink-900">{t('detail.events.title')}</h4>
                <span className="text-sm text-ink-500">{t('detail.events.latestFirst')}</span>
              </div>

              {persistedEventsLoading && combinedRuleEvents.length === 0 ? (
                <Skeleton className="h-40" />
              ) : combinedRuleEvents.length === 0 ? (
                <EmptyState
                  title={t('detail.events.emptyTitle')}
                  description={t('detail.events.emptyDescription')}
                />
              ) : (
                <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-2">
                  {combinedRuleEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-ink-100 bg-white px-4 py-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              label={t(`detail.events.type.${event.type}`)}
                              variant="danger"
                            />
                            <span className="text-sm font-medium text-ink-900">{event.payload.ruleName}</span>
                          </div>
                          <p className="text-sm text-ink-600">{event.payload.description}</p>
                        </div>
                        <div className="text-sm text-ink-500">
                          {formatDateTime(event.occurredAt, locale)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {persistedEventsError instanceof Error && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t('detail.events.historyError')}: {persistedEventsError.message}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'fish' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-ink-900">{t('fish.inventory')}</h3>
            <Button onClick={() => setFishModalOpen(true)}>{t('fish.add')}</Button>
          </div>
          {fishLoading && <Skeleton className="h-48" />}
          {!fishLoading && (fish?.length ?? 0) === 0 && (
            <EmptyState title={t('fish.emptyTitle')} description={t('fish.emptyDescription')} />
          )}
          {!fishLoading && (fish?.length ?? 0) > 0 && (
            <FishTable
              items={fish ?? []}
              onEdit={(item) => {
                setFishEdit(item);
                setFishModalOpen(true);
              }}
              onDelete={(item) => setFishDelete(item)}
            />
          )}

          <FishFormModal
            open={fishModalOpen}
            onClose={() => {
              setFishModalOpen(false);
              setFishEdit(null);
            }}
            initial={fishEdit}
            onSubmit={async (payload) => {
              if (fishEdit) {
                await updateFish.mutateAsync({ id: fishEdit.id, payload });
              } else {
                await createFish.mutateAsync(payload);
              }
              setFishModalOpen(false);
              setFishEdit(null);
            }}
          />

          <Modal
            open={Boolean(fishDelete)}
            title={t('fish.modal.removeTitle')}
            onClose={() => setFishDelete(null)}
          >
            <p className="text-sm text-ink-600">
              {t('fish.modal.removeQuestion', { name: fishDelete?.name ?? '' })}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setFishDelete(null)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (fishDelete) {
                    await removeFish.mutateAsync(fishDelete.id);
                  }
                  setFishDelete(null);
                }}
              >
                {t('common.delete')}
              </Button>
            </div>
          </Modal>
        </div>
      )}

      {!isFreshwater && activeTab === 'corals' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-ink-900">{t('coral.collection')}</h3>
            <Button onClick={() => setCoralModalOpen(true)}>{t('coral.add')}</Button>
          </div>
          {coralsLoading && <Skeleton className="h-48" />}
          {!coralsLoading && (corals?.length ?? 0) === 0 && (
            <EmptyState title={t('coral.emptyTitle')} description={t('coral.emptyDescription')} />
          )}
          {!coralsLoading && (corals?.length ?? 0) > 0 && (
            <CoralTable
              items={corals ?? []}
              onEdit={(item) => {
                setCoralEdit(item);
                setCoralModalOpen(true);
              }}
              onDelete={(item) => setCoralDelete(item)}
            />
          )}

          <CoralFormModal
            open={coralModalOpen}
            onClose={() => {
              setCoralModalOpen(false);
              setCoralEdit(null);
            }}
            initial={coralEdit}
            onSubmit={async (payload) => {
              if (coralEdit) {
                await updateCoral.mutateAsync({ id: coralEdit.id, payload });
              } else {
                await createCoral.mutateAsync(payload);
              }
              setCoralModalOpen(false);
              setCoralEdit(null);
            }}
          />

          <Modal
            open={Boolean(coralDelete)}
            title={t('coral.modal.removeTitle')}
            onClose={() => setCoralDelete(null)}
          >
            <p className="text-sm text-ink-600">
              {t('coral.modal.removeQuestion', { name: coralDelete?.name ?? '' })}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setCoralDelete(null)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (coralDelete) {
                    await removeCoral.mutateAsync(coralDelete.id);
                  }
                  setCoralDelete(null);
                }}
              >
                {t('common.delete')}
              </Button>
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'images' && <AquariumImageGallery aquariumId={aquariumId ?? ''} />}

      {activeTab === 'measurements' && (
        <div className="space-y-6">
          {measurementLoading && <Skeleton className="h-64" />}
          {!measurementLoading && latestMeasurement && (
            <LatestMeasurements measurement={latestMeasurement} singleLineValues singleRow />
          )}
          {!measurementLoading && !latestMeasurement && (
            <EmptyState
              title={t('measurement.emptyTitle')}
              description={t('measurement.emptyDescription')}
            />
          )}
          <MeasurementsChart aquariumId={aquariumId ?? ''} />
          <MeasurementAggregates aquariumId={aquariumId ?? ''} />
        </div>
      )}
    </div>
  );
};
