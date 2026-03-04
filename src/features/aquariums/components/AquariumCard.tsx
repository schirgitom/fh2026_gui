import { Link } from 'react-router-dom';
import { Aquarium } from '@/shared/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';
import { useAquariumPreviewImage } from '@/features/aquarium-images/hooks/useAquariumImages';

interface AquariumCardProps {
  aquarium: Aquarium;
  onEdit: (aquarium: Aquarium) => void;
  onDelete: (aquarium: Aquarium) => void;
}

export const AquariumCard = ({ aquarium, onEdit, onDelete }: AquariumCardProps) => {
  const { t } = useI18n();
  const { data: previewImage } = useAquariumPreviewImage(aquarium.id);

  return (
    <div className="card flex h-full flex-col gap-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink-900">{aquarium.name}</h3>
          <p className="text-sm text-ink-500">{aquarium.liters} L</p>
        </div>
        <Badge
          label={
            aquarium.type === 'freshwater'
              ? t('aquarium.type.freshwater')
              : t('aquarium.type.seawater')
          }
          variant={aquarium.type === 'freshwater' ? 'info' : 'success'}
        />
      </div>
      <p className="text-sm text-ink-600">
        {aquarium.length} x {aquarium.depth} x {aquarium.height} cm
      </p>
      <div className="overflow-hidden rounded-xl border border-ink-100">
        {previewImage ? (
          <img
            src={previewImage.imageUrl}
            alt={previewImage.name || t('images.defaultName')}
            className="h-36 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-ink-50 to-sea-50 text-sm text-ink-500">
            {t('images.emptyTitle')}
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-wrap gap-3">
        <Link to={`/aquariums/${aquarium.id}`} className="flex-1">
          <Button className="w-full">{t('aquarium.card.open')}</Button>
        </Link>
        <Button variant="secondary" className="flex-1" onClick={() => onEdit(aquarium)}>
          {t('common.edit')}
        </Button>
        <Button variant="ghost" className="flex-1" onClick={() => onDelete(aquarium)}>
          {t('common.delete')}
        </Button>
      </div>
    </div>
  );
};
