import { Coral } from '@/shared/types';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

interface CoralTableProps {
  items: Coral[];
  onEdit: (coral: Coral) => void;
  onDelete: (coral: Coral) => void;
}

export const CoralTable = ({ items, onEdit, onDelete }: CoralTableProps) => {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
          <tr>
            <th className="px-6 py-3">{t('common.name')}</th>
            <th className="px-6 py-3">{t('common.quantity')}</th>
            <th className="px-6 py-3">{t('coral.type')}</th>
            <th className="px-6 py-3">{t('common.description')}</th>
            <th className="px-6 py-3">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((coral) => (
            <tr key={coral.id} className="border-t border-ink-100">
              <td className="px-6 py-4 font-medium text-ink-800">{coral.name}</td>
              <td className="px-6 py-4 text-ink-600">{coral.amount}</td>
              <td className="px-6 py-4 text-ink-600">
                {coral.coralTyp === 0 ? t('coral.type.hard') : t('coral.type.soft')}
              </td>
              <td className="px-6 py-4 text-ink-600">{coral.description || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(coral)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(coral)}>
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
