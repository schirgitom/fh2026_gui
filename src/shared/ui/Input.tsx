import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => (
  <label className="flex flex-col gap-2 text-sm text-ink-700">
    {label && <span className="font-medium">{label}</span>}
    <input
      className={clsx(
        'w-full rounded-xl border border-ink-200 bg-white px-4 py-2 text-ink-900 focus:border-sea-400 focus:outline-none focus:ring-2 focus:ring-sea-200',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
        className
      )}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);
