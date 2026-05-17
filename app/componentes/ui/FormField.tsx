interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export default function FormField({ label, value, onChange, type = 'text' }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-border/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}
