import GaugeComponent from 'react-gauge-component';
import { Measurement } from '@/shared/types';

interface LatestMeasurementsProps {
  measurement: Measurement;
}

const GaugeCard = ({ title, value, unit, max, min = 0 }: {
  title: string;
  value: number;
  unit: string;
  min?: number;
  max: number;
}) => (
  <div className="card p-5">
    <p className="text-xs uppercase tracking-[0.25em] text-ink-400">{title}</p>
    <div className="mt-2 text-2xl font-semibold text-ink-900">
      {value} {unit}
    </div>
    <div className="mt-4">
      <GaugeComponent
        type="radial"
        minValue={min}
        maxValue={max}
        value={value}
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
);

export const LatestMeasurements = ({ measurement }: LatestMeasurementsProps) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <GaugeCard title="Temperature" value={measurement.temperature} unit="°C" max={40} />
      <GaugeCard title="pH" value={measurement.ph} unit="" max={14} />
      <GaugeCard title="Oxygen" value={measurement.oxygen} unit="mg/L" max={15} />
      <GaugeCard title="Magnesium" value={measurement.mg} unit="ppm" max={1800} />
      <GaugeCard title="KH" value={measurement.kh} unit="dKH" max={20} />
      <GaugeCard title="Calcium" value={measurement.ca} unit="ppm" max={600} />
    </div>
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink-400">Pump</p>
          <p className="text-xl font-semibold text-ink-900">
            {measurement.pump ? 'Running' : 'Stopped'}
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
        Last updated: {new Date(measurement.timestamp).toLocaleString()}
      </p>
    </div>
  </div>
);
