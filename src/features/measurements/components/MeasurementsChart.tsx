import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useMeasurementsRange } from '@/features/measurements/hooks/useMeasurements';
import { ToggleGroup } from '@/shared/ui/ToggleGroup';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

const colors: Record<string, string> = {
  temperature: '#1fb3ff',
  ph: '#4e6f93',
  oxygen: '#0b93db',
  mg: '#0f4765',
  kh: '#7ddcff',
  ca: '#678ab0'
};

interface MeasurementsChartProps {
  aquariumId: string;
}

const toDateInput = (date: Date) => date.toISOString().split('T')[0];

export const MeasurementsChart = ({ aquariumId }: MeasurementsChartProps) => {
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(toDateInput(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(toDateInput(today));
  const [limit, setLimit] = useState(200);
  const [selected, setSelected] = useState<string[]>(['temperature', 'ph', 'oxygen']);
  const { t, locale } = useI18n();

  const metricOptions = [
    { id: 'temperature', label: t('measurement.temperature') },
    { id: 'ph', label: t('measurement.ph') },
    { id: 'oxygen', label: t('measurement.oxygen') },
    { id: 'mg', label: t('measurement.magnesium') },
    { id: 'kh', label: t('measurement.kh') },
    { id: 'ca', label: t('measurement.calcium') }
  ];

  const { data, isLoading, error, refetch } = useMeasurementsRange(aquariumId, from, to, limit);

  const chartData = useMemo(
    () =>
      (data ?? []).map((item) => ({
        ...item,
        timestampLabel: new Date(item.timestamp).toLocaleString(locale)
      })),
    [data, locale]
  );

  const onLimitChange = (rawValue: string) => {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      setLimit(200);
      return;
    }
    const clamped = Math.max(50, Math.min(1000, Math.round(parsed)));
    setLimit(clamped);
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="subheading">{t('measurement.historical')}</p>
          <h3 className="text-xl font-semibold text-ink-900">{t('measurement.trends')}</h3>
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
            {t('common.limit')}
            <input
              type="number"
              min={50}
              max={1000}
              className="rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-700"
              value={limit}
              onChange={(event) => onLimitChange(event.target.value)}
            />
          </label>
          <Button variant="secondary" onClick={() => refetch()}>
            {t('common.apply')}
          </Button>
        </div>
      </div>

      <ToggleGroup options={metricOptions} selected={selected} onChange={setSelected} />

      {isLoading && <Skeleton className="h-72" />}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {(error as Error).message}
        </div>
      )}

      {!isLoading && chartData.length > 0 && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="timestampLabel" tick={{ fontSize: 10 }} minTickGap={30} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              {selected.map((metric) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={colors[metric]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
