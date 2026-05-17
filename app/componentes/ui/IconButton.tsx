import { ButtonHTMLAttributes } from 'react';

type IconButtonVariant = 'primary' | 'danger' | 'success' | 'neutral';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: IconButtonVariant;
}

export default function IconButton({ icon, variant = 'primary', title, className = '', ...props }: IconButtonProps) {
  const variants = {
    primary: 'text-primary hover:bg-primary hover:text-white border-primary/20 hover:border-primary',
    danger: 'text-red-600 hover:bg-red-600 hover:text-white border-red-200 hover:border-red-600',
    success: 'text-green-700 hover:bg-green-600 hover:text-white border-green-200 hover:border-green-600',
    neutral: 'text-text hover:bg-text hover:text-white border-border/30 hover:border-text'
  };

  return (
    <button
      className={`p-2.5 rounded-lg transition-all border ${variants[variant]} ${className}`}
      title={title}
      {...props}
    >
      <i className={`${icon} text-base`} />
    </button>
  );
}
