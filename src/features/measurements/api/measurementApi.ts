import { gqlRequest } from '@/shared/api/graphql';
import { Measurement } from '@/shared/types';

interface LatestMeasurementResponse {
  latestMeasurement: Measurement;
}

interface MeasurementsResponse {
  measurements: Measurement[];
}

export const measurementApi = {
  latest: async (aquariumId: string) => {
    const query = `
      query LatestMeasurement($aquariumId: ID!) {
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
      query Measurements($aquariumId: ID!, $from: DateTime!, $to: DateTime!, $limit: Int!) {
        measurements(aquariumId: $aquariumId, from: $from, to: $to, limit: $limit) {
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

    const fromIso = from.includes('T') ? from : `${from}T00:00:00.000Z`;
    const toIso = to.includes('T') ? to : `${to}T23:59:59.999Z`;
    if (Number.isNaN(Date.parse(fromIso)) || Number.isNaN(Date.parse(toIso))) {
      throw new Error('Ungueltiger Datumsbereich fuer Measurements.');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error('Limit muss eine positive Ganzzahl sein.');
    }

    const data = await gqlRequest<MeasurementsResponse>(query, {
      aquariumId,
      from: fromIso,
      to: toIso,
      limit
    });
    return data.measurements;
  }
};
