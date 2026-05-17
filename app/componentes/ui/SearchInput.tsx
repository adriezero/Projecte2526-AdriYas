interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Buscar...", label }: SearchInputProps) {
  return (
    <div className="flex-1 min-w-70">
      {label && (
        <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-border">
          <i className="bi bi-search text-lg" />
        </span>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-12 pr-4 py-3 border-2 border-border/30 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full text-sm font-medium transition-all"
        />
      </div>
    </div>
  );
}
