import { FormEvent, useEffect, useState } from 'react';
import { Aquarium } from '@/shared/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

export type AquariumFormValues = Omit<Aquarium, 'id' | 'ownerId'>;

interface AquariumFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AquariumFormValues) => void;
  initial?: Aquarium | null;
}

const defaultForm: AquariumFormValues = {
  name: '',
  depth: 0,
  height: 0,
  length: 0,
  liters: 0,
  hasFreshAir: false,
  hasCo2System: false,
  isReefTank: false,
  hasWaveMachine: false,
  type: 'freshwater'
};

export const AquariumFormModal = ({
  open,
  onClose,
  onSubmit,
  initial
}: AquariumFormModalProps) => {
  const [form, setForm] = useState<AquariumFormValues>(defaultForm);
  const { t } = useI18n();

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        depth: initial?.depth ?? 0,
        height: initial?.height ?? 0,
        length: initial?.length ?? 0,
        liters: initial?.liters ?? 0,
        hasFreshAir: initial?.hasFreshAir ?? false,
        hasCo2System: initial?.hasCo2System ?? false,
        isReefTank: initial?.isReefTank ?? false,
        hasWaveMachine: initial?.hasWaveMachine ?? false,
        type: initial?.type ?? 'freshwater'
      });
    }
  }, [open, initial]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      depth: Number(form.depth),
      height: Number(form.height),
      length: Number(form.length),
      liters: Number(form.liters)
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? t('aquarium.form.editTitle') : t('aquarium.form.createTitle')}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label={t('common.name')}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <Input
          label={t('aquarium.liters')}
          type="number"
          min={1}
          value={form.liters}
          onChange={(event) => setForm((prev) => ({ ...prev, liters: Number(event.target.value) }))}
          required
        />
        <Input
          label={t('aquarium.length')}
          type="number"
          min={1}
          value={form.length}
          onChange={(event) => setForm((prev) => ({ ...prev, length: Number(event.target.value) }))}
          required
        />
        <Input
          label={t('aquarium.width')}
          type="number"
          min={1}
          value={form.depth}
          onChange={(event) => setForm((prev) => ({ ...prev, depth: Number(event.target.value) }))}
          required
        />
        <Input
          label={t('aquarium.height')}
          type="number"
          min={1}
          value={form.height}
          onChange={(event) => setForm((prev) => ({ ...prev, height: Number(event.target.value) }))}
          required
        />
        <label className="flex flex-col gap-2 text-sm text-ink-700">
          <span className="font-medium">{t('aquarium.form.type')}</span>
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
            <option value="freshwater">{t('aquarium.type.freshwater')}</option>
            <option value="seawater">{t('aquarium.type.seawater')}</option>
          </select>
        </label>

        {form.type === 'freshwater' && (
          <div className="grid gap-2 text-sm text-ink-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.hasFreshAir)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, hasFreshAir: event.target.checked }))
                }
              />
              {t('aquarium.hasFreshAir')}
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.hasCo2System)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, hasCo2System: event.target.checked }))
                }
              />
              {t('aquarium.hasCo2System')}
            </label>
          </div>
        )}

        {form.type === 'seawater' && (
          <div className="grid gap-2 text-sm text-ink-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.isReefTank)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, isReefTank: event.target.checked }))
                }
              />
              {t('aquarium.isReefTank')}
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.hasWaveMachine)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, hasWaveMachine: event.target.checked }))
                }
              />
              {t('aquarium.hasWaveMachine')}
            </label>
          </div>
        )}

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
