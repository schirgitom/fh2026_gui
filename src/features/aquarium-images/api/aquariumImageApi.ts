import { http } from '@/shared/api/http';
import { AquariumImage } from '@/shared/types';

interface AquariumImageDto {
  id?: string | null;
  Id?: string | null;
  aquariumId?: string | null;
  AquariumId?: string | null;
  name?: string | null;
  Name?: string | null;
  description?: string | null;
  Description?: string | null;
}

const mapImage = (item: AquariumImageDto): AquariumImage => ({
  id: item.id ?? item.Id ?? '',
  aquariumId: item.aquariumId ?? item.AquariumId ?? '',
  name: item.name ?? item.Name ?? undefined,
  description: item.description ?? item.Description ?? undefined
});

export interface UploadAquariumImagePayload {
  aquariumId: string;
  image: File;
  name?: string;
  description?: string;
}

export const aquariumImageApi = {
  getByAquarium: async (aquariumId: string) => {
    const { data } = await http.get<AquariumImageDto[]>(
      `/api/AquariumImage/GetImagesForAquarium/${aquariumId}`
    );
    return data.map(mapImage);
  },
  getContent: async (imageId: string) => {
    const { data } = await http.get<Blob>(`/api/AquariumImage/${imageId}/content`, {
      responseType: 'blob'
    });
    return data;
  },
  upload: async (payload: UploadAquariumImagePayload) => {
    const formData = new FormData();
    formData.append('AquariumId', payload.aquariumId);
    formData.append('Image', payload.image);
    if (payload.name) {
      formData.append('Name', payload.name);
    }
    if (payload.description) {
      formData.append('Description', payload.description);
    }

    await http.post('/api/AquariumImage/upload', formData);
  },
  remove: async (imageId: string) => {
    await http.delete(`/api/AquariumImage/${imageId}`);
  }
};
