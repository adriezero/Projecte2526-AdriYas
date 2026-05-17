interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-10 border-l-4 border-primary pl-6">
      <h1 className="text-4xl font-bold text-primary tracking-tight">{title}</h1>
      {subtitle && <p className="text-text/70 mt-2 text-base font-medium">{subtitle}</p>}
    </div>
  );
}
