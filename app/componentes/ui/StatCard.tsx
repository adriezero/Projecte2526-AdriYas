interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  bgColor: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function StatCard({ label, value, icon, bgColor, isActive, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white cursor-pointer rounded-2xl shadow-lg border-2 p-6 text-left transition-all hover:shadow-xl hover:-translate-y-0.5 ${
        isActive
          ? "border-primary ring-4 ring-primary/20"
          : "border-border/20 hover:border-primary/30"
      }`}
    >
      <div className="flex items-center justify-center pb-2">
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center shadow-md`}>
            <i className={`${icon} text-white text-2xl`} />
          </div>
          {isActive && (
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          )}
        </div>
        <p className="text-xs font-bold text-text/60 uppercase tracking-widest px-2">{label}</p>
        <p className="text-3xl font-black text-text pb-1">{value}</p>
      </div>
    </button>
  );
}
