import { useMemo, useState } from 'react';
import { AggregateResolution } from '@/features/measurements/api/measurementApi';
import { useMeasurementAggregates } from '@/features/measurements/hooks/useMeasurements';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useI18n } from '@/i18n/LanguageProvider';

interface MeasurementAggregatesProps {
  aquariumId: string;
}

const toDateInput = (date: Date) => date.toISOString().split('T')[0];

const fmt = (value: number | null | undefined) => (value == null ? '-' : value.toFixed(2));

export const MeasurementAggregates = ({ aquariumId }: MeasurementAggregatesProps) => {
  const { t, locale } = useI18n();
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(toDateInput(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(toDateInput(today));
  const [resolution, setResolution] = useState<AggregateResolution>('ONE_HOUR');

  const { data, isLoading, error, refetch } = useMeasurementAggregates(aquariumId, resolution, from, to);

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="subheading">{t('measurement.aggregate')}</p>
          <h3 className="text-xl font-semibold text-ink-900">{t('measurement.aggregateTitle')}</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col text-xs text-ink-500">
            {t('common.from')}
            <input
              type="date"
              className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-700"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </label>
          <label className="flex flex-col text-xs text-ink-500">
            {t('common.to')}
            <input
              type="date"
              className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-700"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </label>
          <label className="flex flex-col text-xs text-ink-500">
            {t('measurement.resolution')}
            <select
              className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-700"
              value={resolution}
              onChange={(event) => setResolution(event.target.value as AggregateResolution)}
            >
              <option value="FIVE_MINUTES">{t('measurement.resolution.fiveMinutes')}</option>
              <option value="ONE_HOUR">{t('measurement.resolution.oneHour')}</option>
              <option value="ONE_DAY">{t('measurement.resolution.oneDay')}</option>
            </select>
          </label>
          <Button variant="secondary" onClick={() => refetch()}>
            {t('common.apply')}
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-72" />}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {(error as Error).message}
        </div>
      )}

      {!isLoading && !error && (data?.length ?? 0) === 0 && (
        <p className="text-sm text-ink-500">{t('measurement.aggregateEmpty')}</p>
      )}

      {!isLoading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-3 py-2">{t('measurement.bucket')}</th>
                <th className="px-3 py-2">{t('measurement.temperature')}</th>
                <th className="px-3 py-2">{t('measurement.ph')}</th>
                <th className="px-3 py-2">{t('measurement.oxygen')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data?.map((row) => (
                <tr key={`${row.bucket}-${resolution}`}>
                  <td className="px-3 py-2 text-ink-700">
                    {new Date(row.bucket).toLocaleString(locale)}
                  </td>
                  <td className="px-3 py-2 text-ink-600">
                    avg {fmt(row.avgTemperature)} / min {fmt(row.minTemperature)} / max{' '}
                    {fmt(row.maxTemperature)}
                  </td>
                  <td className="px-3 py-2 text-ink-600">
                    avg {fmt(row.avgPh)} / min {fmt(row.minPh)} / max {fmt(row.maxPh)}
                  </td>
                  <td className="px-3 py-2 text-ink-600">
                    avg {fmt(row.avgOxygen)} / min {fmt(row.minOxygen)} / max {fmt(row.maxOxygen)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
