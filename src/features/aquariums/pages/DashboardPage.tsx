import { useMemo, useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { AquariumCard } from '@/features/aquariums/components/AquariumCard';
import { AquariumFormModal } from '@/features/aquariums/components/AquariumFormModal';
import { useAquariums, useAquariumMutations } from '@/features/aquariums/hooks/useAquariums';
import { Aquarium } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';

export const DashboardPage = () => {
  const { data, isLoading, error } = useAquariums();
  const { create, update, remove } = useAquariumMutations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editAquarium, setEditAquarium] = useState<Aquarium | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Aquarium | null>(null);

  const handleSubmit = async (payload: Omit<Aquarium, 'id'>) => {
    if (editAquarium) {
      await update.mutateAsync({ id: editAquarium.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    setModalOpen(false);
    setEditAquarium(null);
  };

  const list = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Aquariums"
        subtitle="Dashboard"
        actions={
          <Button onClick={() => setModalOpen(true)}>Create Aquarium</Button>
        }
      />

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 px-6 py-4 text-sm text-red-600">
          {(error as Error).message}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <EmptyState
          title="No aquariums yet"
          description="Create your first aquarium to start tracking livestock and measurements."
        />
      )}

      {!isLoading && list.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((aquarium) => (
            <AquariumCard
              key={aquarium.id}
              aquarium={aquarium}
              onEdit={(item) => {
                setEditAquarium(item);
                setModalOpen(true);
              }}
              onDelete={(item) => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      <AquariumFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditAquarium(null);
        }}
        onSubmit={handleSubmit}
        initial={editAquarium}
      />

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete aquarium"
        onClose={() => setDeleteTarget(null)}
      >
        <p className="text-sm text-ink-600">
          This action cannot be undone. Do you want to delete{' '}
          <span className="font-semibold">{deleteTarget?.name}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (deleteTarget) {
                await remove.mutateAsync({ id: deleteTarget.id, type: deleteTarget.type });
              }
              setDeleteTarget(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
