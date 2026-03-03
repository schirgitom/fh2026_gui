import { FormEvent, useEffect, useState } from 'react';
import { Aquarium } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

interface AquariumFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Aquarium, 'id'>) => void;
  initial?: Aquarium | null;
}

const defaultForm: Omit<Aquarium, 'id'> = {
  name: '',
  volumeLiters: 0,
  description: '',
  type: 'freshwater'
};

export const AquariumFormModal = ({
  open,
  onClose,
  onSubmit,
  initial
}: AquariumFormModalProps) => {
  const [form, setForm] = useState<Omit<Aquarium, 'id'>>(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        volumeLiters: initial?.volumeLiters ?? 0,
        description: initial?.description ?? '',
        type: initial?.type ?? 'freshwater'
      });
    }
  }, [open, initial]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      volumeLiters: Number(form.volumeLiters)
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit aquarium' : 'Create aquarium'}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Input
          label="Volume (liters)"
          type="number"
          min={1}
          value={form.volumeLiters}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, volumeLiters: Number(event.target.value) }))
          }
          required
        />
        <Input
          label="Description"
          value={form.description ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <label className="flex flex-col gap-2 text-sm text-ink-700">
          <span className="font-medium">Type</span>
          <select
            className="rounded-xl border border-ink-200 bg-white px-4 py-2"
            value={form.type}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                type: event.target.value === 'seawater' ? 'seawater' : 'freshwater'
              }))
            }
          >
            <option value="freshwater">Freshwater</option>
            <option value="seawater">Seawater</option>
          </select>
        </label>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};
