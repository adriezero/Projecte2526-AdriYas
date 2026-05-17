export default function Separator() {
  return (
    <div className="flex items-center justify-center py-4 gap-2">
      <hr className="flex-1 border-border" />
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-accent-orange rounded-full"></span>
        <span className="w-1.5 h-1.5 bg-accent-yellow rounded-full"></span>
        <span className="w-1.5 h-1.5 bg-accent-orange rounded-full"></span>
      </div>
      <hr className="flex-1 border-border" />
    </div>
  );
}
