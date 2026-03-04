import { Fish } from '@/shared/types';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

interface FishTableProps {
  items: Fish[];
  onEdit: (fish: Fish) => void;
  onDelete: (fish: Fish) => void;
}

export const FishTable = ({ items, onEdit, onDelete }: FishTableProps) => {
  const { t } = useI18n();
  const isDeceased = (deathDate?: string) =>
    Boolean(deathDate && !deathDate.startsWith('0001-01-01'));

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
          <tr>
            <th className="px-6 py-3">{t('common.name')}</th>
            <th className="px-6 py-3">{t('common.quantity')}</th>
            <th className="px-6 py-3">{t('common.description')}</th>
            <th className="px-6 py-3">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((fish) => (
            <tr key={fish.id} className="border-t border-ink-100">
              <td className="px-6 py-4 font-medium text-ink-800">
                <div className="flex items-center gap-2">
                  {isDeceased(fish.deathDate) && (
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center text-ink-500"
                      title={t('fish.deceased')}
                      aria-label={t('fish.deceased')}
                      role="img"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M7 4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v16h3v2H4v-2h3V4zm2 0v2h6V4H9zm0 4v12h6V8H9zm1.5 2h3v2h-3v-2zm0 4h3v2h-3v-2z" />
                      </svg>
                    </span>
                  )}
                  <span>{fish.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-ink-600">{fish.amount}</td>
              <td className="px-6 py-4 text-ink-600">{fish.description || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(fish)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(fish)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
