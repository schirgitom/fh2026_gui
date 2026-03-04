import { gqlRequest } from '@/shared/api/graphql';
import { Measurement } from '@/shared/types';

interface LatestMeasurementResponse {
  latestMeasurement: Measurement;
}

interface MeasurementsResponse {
  measurements: Measurement[];
}

export type AggregateResolution = 'FIVE_MINUTES' | 'ONE_HOUR' | 'ONE_DAY';

export interface MeasurementAggregate {
  bucket: string;
  avgTemperature: number | null;
  minTemperature: number | null;
  maxTemperature: number | null;
  stdDevTemperature: number | null;
  avgPh: number | null;
  minPh: number | null;
  maxPh: number | null;
  stdDevPh: number | null;
  avgOxygen: number | null;
  minOxygen: number | null;
  maxOxygen: number | null;
  avgMg: number | null;
  avgKh: number | null;
  avgCa: number | null;
  avgPump: number | null;
  maxPump: number | null;
}

interface MeasurementAggregatesResponse {
  aggregates: MeasurementAggregate[];
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
  },
  aggregates: async (
    aquariumId: string,
    resolution: AggregateResolution,
    from: string,
    to: string
  ) => {
    const query = `
      query MeasurementAggregates(
        $aquariumId: ID!
        $resolution: AggregateResolution!
        $from: DateTime!
        $to: DateTime!
      ) {
        aggregates(aquariumId: $aquariumId, resolution: $resolution, from: $from, to: $to) {
          bucket
          avgTemperature
          minTemperature
          maxTemperature
          stdDevTemperature
          avgPh
          minPh
          maxPh
          stdDevPh
          avgOxygen
          minOxygen
          maxOxygen
          avgMg
          avgKh
          avgCa
          avgPump
          maxPump
        }
      }
    `;

    const fromIso = from.includes('T') ? from : `${from}T00:00:00.000Z`;
    const toIso = to.includes('T') ? to : `${to}T23:59:59.999Z`;
    if (Number.isNaN(Date.parse(fromIso)) || Number.isNaN(Date.parse(toIso))) {
      throw new Error('Ungueltiger Datumsbereich fuer Aggregates.');
    }

    const data = await gqlRequest<MeasurementAggregatesResponse>(query, {
      aquariumId,
      resolution,
      from: fromIso,
      to: toIso
    });

    return data.aggregates;
  }
};
