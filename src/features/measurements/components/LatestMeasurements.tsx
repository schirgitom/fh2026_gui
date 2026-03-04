import GaugeComponent from 'react-gauge-component';
import { Measurement } from '@/shared/types';
import { useI18n } from '@/i18n/LanguageProvider';

interface LatestMeasurementsProps {
  measurement: Measurement;
  singleLineValues?: boolean;
  singleRow?: boolean;
}

const GaugeCard = ({
  title,
  value,
  unit,
  max,
  min = 0,
  singleLineValue = false,
  singleRow = false
}: {
  title: string;
  value: number | null | undefined;
  unit: string;
  min?: number;
  max: number;
  singleLineValue?: boolean;
  singleRow?: boolean;
}) => {
  const hasValue = typeof value === 'number' && Number.isFinite(value);
  const gaugeValue = hasValue ? value : min;
  const gaugeWidth = singleRow ? 224 : 140;
  const gaugeHeight = singleRow ? 128 : 78;

  return (
    <div className={`card overflow-hidden ${singleRow ? 'min-w-[320px] p-5' : 'min-w-0 p-4'}`}>
      <div className={`flex gap-4 ${singleRow ? 'items-start justify-between' : 'flex-col'}`}>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink-400">{title}</p>
          <div
            className={`mt-1 whitespace-nowrap font-semibold text-ink-900 ${
              singleLineValue ? 'text-2xl leading-tight' : 'text-3xl'
            }`}
          >
            {hasValue ? value.toFixed(2) : '--'} {unit}
          </div>
        </div>
        <div
          className={`${
            singleRow ? 'h-32 w-56 self-end' : 'h-[78px] w-[140px] self-center'
          } shrink-0 overflow-hidden`}
        >
          <GaugeComponent
            type="radial"
            minValue={min}
            maxValue={max}
            value={gaugeValue}
            style={{ width: gaugeWidth, height: gaugeHeight }}
            arc={{
              subArcs: [
                { limit: max * 0.5, color: '#7ddcff' },
                { limit: max * 0.75, color: '#4ecbff' },
                { color: '#1fb3ff' }
              ]
            }}
            pointer={{ type: 'arrow', elastic: true }}
            labels={{ valueLabel: { hide: true } }}
          />
        </div>
      </div>
    </div>
  );
};

export const LatestMeasurements = ({
  measurement,
  singleLineValues = false,
  singleRow = false
}: LatestMeasurementsProps) => {
  const { t, locale } = useI18n();

  const gaugeCards = (
    <>
      <GaugeCard
        title={t('measurement.temperature')}
        value={measurement.temperature}
        unit="°C"
        max={40}
        singleLineValue={singleLineValues}
        singleRow={singleRow}
      />
      <GaugeCard
        title={t('measurement.ph')}
        value={measurement.ph}
        unit=""
        max={14}
        singleLineValue={singleLineValues}
        singleRow={singleRow}
      />
      <GaugeCard
        title={t('measurement.oxygen')}
        value={measurement.oxygen}
        unit="mg/L"
        max={15}
        singleLineValue={singleLineValues}
        singleRow={singleRow}
      />
      <GaugeCard
        title={t('measurement.magnesium')}
        value={measurement.mg}
        unit="ppm"
        max={1800}
        singleLineValue={singleLineValues}
        singleRow={singleRow}
      />
      <GaugeCard
        title={t('measurement.kh')}
        value={measurement.kh}
        unit="dKH"
        max={20}
        singleLineValue={singleLineValues}
        singleRow={singleRow}
      />
      <GaugeCard
        title={t('measurement.calcium')}
        value={measurement.ca}
        unit="ppm"
        max={600}
        singleLineValue={singleLineValues}
        singleRow={singleRow}
      />
    </>
  );

  return (
    <div className="space-y-6">
      {singleRow ? (
        <div className="flex gap-4 overflow-x-auto pb-2">{gaugeCards}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{gaugeCards}</div>
      )}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink-400">{t('measurement.pump')}</p>
            <p className="text-xl font-semibold text-ink-900">
              {measurement.pump ? t('measurement.pumpRunning') : t('measurement.pumpStopped')}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              measurement.pump ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {measurement.pump ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-500">
          {t('measurement.lastUpdated', {
            value: new Date(measurement.timestamp).toLocaleString(locale)
          })}
        </p>
      </div>
    </div>
  );
};
