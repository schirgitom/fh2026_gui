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
              <td className="px-6 py-4 font-medium text-ink-800">{fish.name}</td>
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
