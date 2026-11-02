"use client";

import {
  LuArchive,
  LuCheck,
  LuCheckSquare,
  LuEye,
  LuSquarePen,
  LuTrash2,
  LuX,
} from "react-icons/lu";

const ProductBulkActionBar = ({
  selectedCount,
  onClearSelection,
  onBulkStatus,
  onBulkDelete,
  isPending,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-neutral text-neutral-content p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <span className="badge badge-primary font-bold text-xs">
          {selectedCount} selected
        </span>
        <span className="text-xs opacity-80">
          Bulk operations across chosen items:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onBulkStatus("published")}
          disabled={isPending}
          className="btn btn-xs btn-success gap-1 text-xs font-semibold"
        >
          <LuCheck className="size-3" /> Publish
        </button>
        <button
          onClick={() => onBulkStatus("draft")}
          disabled={isPending}
          className="btn btn-xs btn-warning gap-1 text-xs font-semibold"
        >
          <LuSquarePen className="size-3" /> Set Draft
        </button>
        <button
          onClick={() => onBulkStatus("archived")}
          disabled={isPending}
          className="btn btn-xs btn-neutral gap-1 text-xs font-semibold"
        >
          <LuArchive className="size-3" /> Archive
        </button>
        <button
          onClick={onBulkDelete}
          disabled={isPending}
          className="btn btn-xs btn-error gap-1 text-xs font-semibold"
        >
          <LuTrash2 className="size-3" /> Delete Selected
        </button>
        <button
          onClick={onClearSelection}
          className="btn btn-xs btn-ghost btn-circle"
          title="Clear Selection"
        >
          <LuX className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ProductBulkActionBar;
