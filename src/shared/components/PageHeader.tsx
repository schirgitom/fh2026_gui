import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      {subtitle && <p className="subheading">{subtitle}</p>}
      <h1 className="heading text-ink-900">{title}</h1>
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);
