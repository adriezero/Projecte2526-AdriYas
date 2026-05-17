interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2.5 border-2 border-border/30 rounded-xl text-sm font-bold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text transition-all"
      >
        <i className="bi bi-chevron-left" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${
            currentPage === p
              ? "bg-primary text-white border-primary shadow-md"
              : "border-border/30 hover:bg-primary/10 hover:border-primary/50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 border-2 border-border/30 rounded-xl text-sm font-bold hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text transition-all"
      >
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}
