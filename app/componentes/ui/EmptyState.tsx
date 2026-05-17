import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="w-20 h-20 bg-border/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <p className="text-text/40 text-sm font-bold uppercase tracking-wide">{title}</p>
      {subtitle && <p className="text-text/30 text-xs">{subtitle}</p>}
    </div>
  );
}
