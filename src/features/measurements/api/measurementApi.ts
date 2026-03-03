import { gqlRequest } from '@/shared/api/graphql';
import { Measurement } from '@/shared/types';

interface LatestMeasurementResponse {
  latestMeasurement: Measurement;
}

interface MeasurementsResponse {
  getMeasurementsAsync: Measurement[];
}

export const measurementApi = {
  latest: async (aquariumId: string) => {
    const query = `
      query LatestMeasurement($aquariumId: String!) {
        latestMeasurement(aquariumId: $aquariumId) {
          aquariumId
          timestamp
          temperature
          mg
          kh
          ca
          ph
          oxygen
          pump
        }
      }
    `;

    const data = await gqlRequest<LatestMeasurementResponse>(query, { aquariumId });
    return data.latestMeasurement;
  },
  range: async (aquariumId: string, from: string, to: string, limit: number) => {
    const query = `
      query Measurements($aquariumId: String!, $from: String!, $to: String!, $limit: Int!) {
        getMeasurementsAsync(aquariumId: $aquariumId, from: $from, to: $to, limit: $limit) {
          aquariumId
          timestamp
          temperature
          mg
          kh
          ca
          ph
          oxygen
          pump
        }
      }
    `;

    const data = await gqlRequest<MeasurementsResponse>(query, { aquariumId, from, to, limit });
    return data.getMeasurementsAsync;
  }
};
