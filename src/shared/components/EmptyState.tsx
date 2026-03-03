interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/70 px-6 py-12 text-center">
    <h3 className="text-lg font-semibold text-ink-800">{title}</h3>
    <p className="mt-2 text-sm text-ink-600">{description}</p>
  </div>
);
