interface DropdownProps {
  value: string;
  options: readonly string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: string) => void;
  minWidth?: string;
  label?: string;
}

export default function Dropdown({ value, options, isOpen, onToggle, onSelect, minWidth = '140px', label }: DropdownProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-4 py-3 border-2 border-border/30 rounded-xl bg-white text-sm font-bold justify-between hover:border-primary/50 transition-all"
          style={{ minWidth }}
        >
          {value} <i className="bi bi-chevron-down text-xs" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-2 bg-white border-2 border-border/30 rounded-xl shadow-2xl w-full overflow-hidden">
            {options.map((op) => (
              <div
                key={op}
                onClick={() => onSelect(op)}
                className="px-4 py-3 text-sm font-bold hover:bg-primary/10 hover:text-primary cursor-pointer text-center transition-colors border-b border-border/10 last:border-b-0"
              >
                {op}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
