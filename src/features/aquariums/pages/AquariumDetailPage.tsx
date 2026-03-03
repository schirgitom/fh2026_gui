import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const tabOptions = [
  { id: 'overview', label: 'Overview' },
  { id: 'fish', label: 'Fish' },
  { id: 'corals', label: 'Corals' },
  { id: 'measurements', label: 'Measurements' }
];

export const AquariumDetailPage = () => {
  const { aquariumId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: aquariums } = useAquariums();
  const aquarium = useMemo(
    () => aquariums?.find((item) => item.id === aquariumId),
    [aquariums, aquariumId]
  );

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
        <p className="text-ink-600">Aquarium not found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={aquarium.name}
        subtitle={aquarium.type === 'freshwater' ? 'Freshwater' : 'Seawater'}
      />

      <Tabs tabs={tabOptions} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <h3 className="text-lg font-semibold text-ink-900">Aquarium summary</h3>
            <div className="mt-4 grid gap-4 text-sm text-ink-600">
              <div className="flex items-center justify-between">
                <span>Volume</span>
                <span className="font-semibold text-ink-900">{aquarium.volumeLiters} L</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Description</span>
                <span className="font-semibold text-ink-900">
                  {aquarium.description || 'No description'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fish count</span>
                <span className="font-semibold text-ink-900">{fish?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Coral count</span>
                <span className="font-semibold text-ink-900">{corals?.length ?? 0}</span>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-sea-50 via-white to-ink-100">
            <h3 className="text-lg font-semibold text-ink-900">Latest measurement</h3>
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
            <h3 className="text-xl font-semibold text-ink-900">Fish inventory</h3>
            <Button onClick={() => setFishModalOpen(true)}>Add fish</Button>
          </div>
          {fishLoading && <Skeleton className="h-48" />}
          {!fishLoading && (fish?.length ?? 0) === 0 && (
            <EmptyState
              title="No fish added"
              description="Start tracking fish species and quantities in this aquarium."
            />
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

          <Modal open={Boolean(fishDelete)} title="Remove fish" onClose={() => setFishDelete(null)}>
            <p className="text-sm text-ink-600">
              Remove <span className="font-semibold">{fishDelete?.name}</span> from this aquarium?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setFishDelete(null)}>
                Cancel
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
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'corals' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-ink-900">Coral collection</h3>
            <Button onClick={() => setCoralModalOpen(true)}>Add coral</Button>
          </div>
          {coralsLoading && <Skeleton className="h-48" />}
          {!coralsLoading && (corals?.length ?? 0) === 0 && (
            <EmptyState
              title="No corals added"
              description="Log coral species and quantities for this aquarium."
            />
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
            title="Remove coral"
            onClose={() => setCoralDelete(null)}
          >
            <p className="text-sm text-ink-600">
              Remove <span className="font-semibold">{coralDelete?.name}</span> from this aquarium?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setCoralDelete(null)}>
                Cancel
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
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      )}

      {activeTab === 'measurements' && (
        <div className="space-y-6">
          {measurementLoading && <Skeleton className="h-64" />}
          {!measurementLoading && latestMeasurement && (
            <LatestMeasurements measurement={latestMeasurement} />
          )}
          <MeasurementsChart aquariumId={aquariumId ?? ''} />
        </div>
      )}
    </div>
  );
};
