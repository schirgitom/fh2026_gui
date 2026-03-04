import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  aquariumImageApi,
  UploadAquariumImagePayload
} from '@/features/aquarium-images/api/aquariumImageApi';
import { AquariumImage } from '@/shared/types';

export interface AquariumImageWithUrl extends AquariumImage {
  imageUrl: string;
}

export interface AquariumPreviewImage {
  id: string;
  imageUrl: string;
  name?: string;
}

export const useAquariumImages = (aquariumId: string) => {
  const query = useQuery({
    queryKey: ['aquarium-images', aquariumId],
    queryFn: async () => {
      const images = await aquariumImageApi.getByAquarium(aquariumId);
      const withUrls: AquariumImageWithUrl[] = [];

      for (const item of images) {
        if (!item.id) {
          continue;
        }
        try {
          const blob = await aquariumImageApi.getContent(item.id);
          withUrls.push({
            ...item,
            imageUrl: URL.createObjectURL(blob)
          });
        } catch {
          // Skip broken image records so one bad item does not break the whole gallery.
        }
      }

      return withUrls;
    },
    enabled: Boolean(aquariumId)
  });

  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = query.data?.map((item) => item.imageUrl) ?? [];

    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current = [];
    };
  }, [query.data]);

  return query;
};

export const useAquariumImageMutations = (aquariumId: string) => {
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: (payload: Omit<UploadAquariumImagePayload, 'aquariumId'>) =>
      aquariumImageApi.upload({ ...payload, aquariumId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquarium-images', aquariumId] })
  });

  const remove = useMutation({
    mutationFn: (imageId: string) => aquariumImageApi.remove(imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquarium-images', aquariumId] })
  });

  return { upload, remove };
};

export const useAquariumPreviewImage = (aquariumId: string) => {
  const query = useQuery({
    queryKey: ['aquarium-image-preview', aquariumId],
    queryFn: async () => {
      const images = await aquariumImageApi.getByAquarium(aquariumId);
      for (const item of images) {
        if (!item.id) {
          continue;
        }
        try {
          const blob = await aquariumImageApi.getContent(item.id);
          return {
            id: item.id,
            name: item.name,
            imageUrl: URL.createObjectURL(blob)
          } satisfies AquariumPreviewImage;
        } catch {
          // Try next image if one content endpoint fails.
        }
      }
      return null;
    },
    enabled: Boolean(aquariumId)
  });

  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    urlRef.current = query.data?.imageUrl ?? null;

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
      urlRef.current = null;
    };
  }, [query.data]);

  return query;
};
