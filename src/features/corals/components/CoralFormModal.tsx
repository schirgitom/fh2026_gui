import { FormEvent, useEffect, useState } from 'react';
import { Coral } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

interface CoralFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Coral, 'id' | 'aquariumId'>) => void;
  initial?: Coral | null;
}

const defaultForm: Omit<Coral, 'id' | 'aquariumId'> = {
  name: '',
  amount: 1,
  description: '',
  coralTyp: 0
};

export const CoralFormModal = ({ open, onClose, onSubmit, initial }: CoralFormModalProps) => {
  const [form, setForm] = useState<Omit<Coral, 'id' | 'aquariumId'>>(defaultForm);
  const { t } = useI18n();

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        amount: initial?.amount ?? 1,
        description: initial?.description ?? '',
        coralTyp: initial?.coralTyp ?? 0
      });
    }
  }, [open, initial]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? t('coral.modal.editTitle') : t('coral.modal.addTitle')}>
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
        <label className="flex flex-col gap-2 text-sm text-ink-700">
          <span className="font-medium">{t('coral.type')}</span>
          <select
            className="rounded-xl border border-ink-200 bg-white px-4 py-2"
            value={form.coralTyp}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, coralTyp: Number(event.target.value) as 0 | 1 }))
            }
          >
            <option value={0}>{t('coral.type.hard')}</option>
            <option value={1}>{t('coral.type.soft')}</option>
          </select>
        </label>
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
