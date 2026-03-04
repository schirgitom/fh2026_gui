import { FormEvent, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { EmptyState } from '@/shared/components/EmptyState';
import { Skeleton } from '@/shared/ui/Skeleton';
import {
  useAquariumImageMutations,
  useAquariumImages
} from '@/features/aquarium-images/hooks/useAquariumImages';
import { useI18n } from '@/i18n/LanguageProvider';

interface AquariumImageGalleryProps {
  aquariumId: string;
}

export const AquariumImageGallery = ({ aquariumId }: AquariumImageGalleryProps) => {
  const { t } = useI18n();
  const { data, isLoading, error } = useAquariumImages(aquariumId);
  const { upload, remove } = useAquariumImageMutations(aquariumId);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    await upload.mutateAsync({
      image: file,
      name: name || undefined,
      description: description || undefined
    });

    setFile(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <form className="grid gap-3 rounded-2xl border border-ink-100 bg-white p-4" onSubmit={onSubmit}>
        <Input
          label={t('images.file')}
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          required
        />
        <Input label={t('common.name')} value={name} onChange={(event) => setName(event.target.value)} />
        <Input
          label={t('common.description')}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={upload.isPending || !file}>
            {upload.isPending ? t('images.uploading') : t('images.upload')}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-2xl bg-red-50 px-6 py-4 text-sm text-red-600">{(error as Error).message}</div>
      )}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-60" />
          ))}
        </div>
      )}

      {!isLoading && (data?.length ?? 0) === 0 && (
        <EmptyState title={t('images.emptyTitle')} description={t('images.emptyDescription')} />
      )}

      {!isLoading && (data?.length ?? 0) > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((image) => (
            <article key={image.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <a href={image.imageUrl} target="_blank" rel="noreferrer" className="block">
                <img
                  src={image.imageUrl}
                  alt={image.name || 'aquarium image'}
                  className="h-44 w-full cursor-zoom-in object-cover"
                />
              </a>
              <div className="space-y-2 p-4">
                <h4 className="font-semibold text-ink-900">{image.name || t('images.defaultName')}</h4>
                <p className="text-sm text-ink-600">{image.description || t('common.noDescription')}</p>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(image.id)}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
