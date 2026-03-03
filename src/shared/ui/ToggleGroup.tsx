import clsx from 'clsx';

interface ToggleOption {
  id: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export const ToggleGroup = ({ options, selected, onChange }: ToggleGroupProps) => {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <button
            key={option.id}
            className={clsx(
              'rounded-full border px-4 py-2 text-sm font-medium transition',
              active
                ? 'border-sea-500 bg-sea-100 text-sea-700'
                : 'border-ink-200 bg-white text-ink-600 hover:border-sea-300'
            )}
            onClick={() => toggle(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
