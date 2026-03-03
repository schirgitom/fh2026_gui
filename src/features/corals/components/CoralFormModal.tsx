import { FormEvent, useEffect, useState } from 'react';
import { Coral } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

interface CoralFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Coral, 'id' | 'aquariumId'>) => void;
  initial?: Coral | null;
}

const defaultForm: Omit<Coral, 'id' | 'aquariumId'> = {
  name: '',
  species: '',
  quantity: 1
};

export const CoralFormModal = ({ open, onClose, onSubmit, initial }: CoralFormModalProps) => {
  const [form, setForm] = useState<Omit<Coral, 'id' | 'aquariumId'>>(defaultForm);

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
    <Modal open={open} onClose={onClose} title={initial ? 'Edit coral' : 'Add coral'}>
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
