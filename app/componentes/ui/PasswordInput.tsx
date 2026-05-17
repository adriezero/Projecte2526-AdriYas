import { useState } from 'react';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function PasswordInput({ label, placeholder, value, onChange, required }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="py-2">
      {label && <label className="text-gray-700">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          required={required}
          className="w-full mt-1 px-3 py-2 pr-10 border border-border text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-text/60 hover:text-primary bg-gray-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
        >
          {showPassword ? (
            <i className="bi bi-eye text-xl"></i>
          ) : (
            <i className="bi bi-eye-slash text-xl"></i>
          )}
        </button>
      </div>
    </div>
  );
}
