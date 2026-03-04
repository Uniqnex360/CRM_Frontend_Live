import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AppPaginationProps {
  total: number;        // total items
  page: number;         // current page (1-indexed)
  size: number;         // items per page
  onPageChange: (page: number) => void; // callback when page changes
}

const AppPagination: React.FC<AppPaginationProps> = ({
  total,
  page,
  size,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / size);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-2 py-1 roundedborder-gray-300 disabled:opacity-50"
      >
        <ChevronLeft/>
      </button>

      <span>
       page {page} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-2 py-1 rounded border disabled:opacity-50"
      >
        <ChevronRight/>
      </button>
    </div>
  );
};

export default AppPagination;