import { useMemo, useState } from 'react';
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
import { Modal } from '@/shared/ui/Modal';
import { LatestMeasurements } from '@/features/measurements/components/LatestMeasurements';
import { MeasurementsChart } from '@/features/measurements/components/MeasurementsChart';
import { useLatestMeasurement } from '@/features/measurements/hooks/useMeasurements';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { Fish, Coral } from '@/shared/types';
import { useI18n } from '@/i18n/LanguageProvider';
import { AquariumImageGallery } from '@/features/aquarium-images/components/AquariumImageGallery';
import { useAquariumPreviewImage } from '@/features/aquarium-images/hooks/useAquariumImages';

export const AquariumDetailPage = () => {
  const { aquariumId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: aquariums } = useAquariums();
  const { t } = useI18n();
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
          <MeasurementsChart aquariumId={aquariumId ?? ''} />
        </div>
      )}
    </div>
  );
};
