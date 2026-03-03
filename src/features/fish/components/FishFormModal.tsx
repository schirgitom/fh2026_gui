import { FormEvent, useEffect, useState } from 'react';
import { Fish } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

interface FishFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Fish, 'id' | 'aquariumId'>) => void;
  initial?: Fish | null;
}

const defaultForm: Omit<Fish, 'id' | 'aquariumId'> = {
  name: '',
  species: '',
  quantity: 1
};

export const FishFormModal = ({ open, onClose, onSubmit, initial }: FishFormModalProps) => {
  const [form, setForm] = useState<Omit<Fish, 'id' | 'aquariumId'>>(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        species: initial?.species ?? '',
        quantity: initial?.quantity ?? 1
      });
    }
  }, [open, initial]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ ...form, quantity: Number(form.quantity) });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit fish' : 'Add fish'}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Input
          label="Species"
          value={form.species}
          onChange={(event) => setForm((prev) => ({ ...prev, species: event.target.value }))}
          required
        />
        <Input
          label="Quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))
          }
          required
        />
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
