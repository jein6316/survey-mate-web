import * as React from "react";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const blockSize = 10;
  const currentBlock = Math.floor((page - 1) / blockSize);
  const blockStart = currentBlock * blockSize + 1;
  const blockEnd = Math.min(blockStart + blockSize - 1, totalPages);

  const pages = [];
  for (let i = blockStart; i <= blockEnd; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
      <button
        disabled={currentBlock === 0}
        onClick={() => onPageChange(blockStart - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${
            p === page ? "bg-gray-300 font-bold" : ""
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={blockEnd === totalPages}
        onClick={() => onPageChange(blockEnd + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
};
