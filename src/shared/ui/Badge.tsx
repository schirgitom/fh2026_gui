import clsx from 'clsx';

interface BadgeProps {
  label: string;
  variant?: 'danger' | 'info' | 'success' | 'warning';
}

export const Badge = ({ label, variant = 'info' }: BadgeProps) => (
  <span
    className={clsx(
      'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
      variant === 'danger' && 'bg-red-100 text-red-700',
      variant === 'info' && 'bg-sea-100 text-sea-700',
      variant === 'success' && 'bg-emerald-100 text-emerald-700',
      variant === 'warning' && 'bg-amber-100 text-amber-700'
    )}
  >
    {label}
  </span>
);
