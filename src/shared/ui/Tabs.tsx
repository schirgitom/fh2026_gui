import clsx from 'clsx';

interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  active: string;
  onChange: (id: string) => void;
}

export const Tabs = ({ tabs, active, onChange }: TabsProps) => (
  <div className="flex flex-wrap gap-2 rounded-full bg-ink-100 p-2">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={clsx(
          'rounded-full px-4 py-2 text-sm font-medium transition',
          active === tab.id
            ? 'bg-white text-ink-900 shadow-soft'
            : 'text-ink-600 hover:bg-white/70'
        )}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
