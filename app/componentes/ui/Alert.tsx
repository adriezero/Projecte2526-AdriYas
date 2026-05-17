import { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export default function Alert({ variant = 'error', children, className = '' }: AlertProps) {
  const variants = {
    error: 'bg-red-50 border-red-300 text-red-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700'
  };

  return (
    <div className={`border px-4 py-3 rounded-lg ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
