interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Spinner({ size = 'md', text }: SpinnerProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-14 w-14',
    lg: 'h-20 w-20'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizes[size]}`} />
      {text && <p className="text-text font-medium text-lg">{text}</p>}
    </div>
  );
}
