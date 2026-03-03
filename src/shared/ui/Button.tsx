import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea-400 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-sea-600 text-white hover:bg-sea-700',
    secondary: 'bg-ink-100 text-ink-700 hover:bg-ink-200',
    ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};
