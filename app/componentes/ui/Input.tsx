import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="py-2">
      {label && <label className="text-gray-700">{label}</label>}
      <input
        className={`w-full mt-1 px-3 py-2 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
