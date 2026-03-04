import { FormEvent, useEffect, useState } from 'react';
import { Fish } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

interface FishFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Fish, 'id' | 'aquariumId'>) => void;
  initial?: Fish | null;
}

const defaultForm: Omit<Fish, 'id' | 'aquariumId'> = {
  name: '',
  amount: 1,
  description: '',
  deathDate: ''
};

export const FishFormModal = ({ open, onClose, onSubmit, initial }: FishFormModalProps) => {
  const [form, setForm] = useState<Omit<Fish, 'id' | 'aquariumId'>>(defaultForm);
  const [isAlive, setIsAlive] = useState(true);
  const { t } = useI18n();
  const DATE_TIME_MIN = '0001-01-01T00:00:00';
  const isMinDate = (value?: string) => Boolean(value && value.startsWith('0001-01-01'));

  useEffect(() => {
    if (open) {
      const alive = !initial?.deathDate || isMinDate(initial.deathDate);
      setIsAlive(alive);
      setForm({
        name: initial?.name ?? '',
        amount: initial?.amount ?? 1,
        description: initial?.description ?? '',
        deathDate: alive ? '' : initial?.deathDate ?? ''
      });
    }
  }, [open, initial]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      deathDate: isAlive ? DATE_TIME_MIN : form.deathDate || undefined
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? t('fish.modal.editTitle') : t('fish.modal.addTitle')}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label={t('common.name')}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Input
          label={t('common.quantity')}
          type="number"
          min={1}
          value={form.amount}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
          }
          required
        />
        <Input
          label={t('common.description')}
          value={form.description ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <label className="inline-flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={isAlive}
            onChange={(event) => {
              const nextAlive = event.target.checked;
              setIsAlive(nextAlive);
              if (nextAlive) {
                setForm((prev) => ({ ...prev, deathDate: '' }));
              }
            }}
          />
          {t('fish.isAlive')}
        </label>
        <Input
          label={t('fish.deathDate')}
          type="date"
          disabled={isAlive}
          value={form.deathDate?.slice(0, 10) ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, deathDate: event.target.value }))}
        />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit">{t('common.save')}</Button>
        </div>
      </form>
    </Modal>
  );
};
