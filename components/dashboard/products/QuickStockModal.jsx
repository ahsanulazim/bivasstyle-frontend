"use client";

import { quickUpdateProductStock } from "@/api/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LuBoxes, LuCheck, LuX } from "react-icons/lu";
import { toast } from "react-toastify";

const QuickStockModal = ({ product, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [stockVal, setStockVal] = useState(product?.stock ?? 0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const mutation = useMutation({
    mutationFn: quickUpdateProductStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock quantity updated successfully!");
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update stock");
    },
  });

  if (!isOpen || !product) return null;

  const hasVariants =
    Array.isArray(product.variantDetails) && product.variantDetails.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedVariant) {
      mutation.mutate({
        id: product._id,
        stock: Number(stockVal),
        color: selectedVariant.color,
        size: selectedVariant.size,
      });
    } else {
      mutation.mutate({
        id: product._id,
        stock: Number(stockVal),
      });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-6 rounded-3xl border border-base-300 bg-base-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <LuX className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <LuBoxes className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Quick Stock Adjustment</h3>
            <p className="text-xs text-base-content/60 line-clamp-1">
              {product.productName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasVariants ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold block text-base-content/70">
                Select Variant / Size to Adjust:
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-base-200/50 rounded-xl border border-base-300">
                {product.variantDetails.map((v) => {
                  if (Array.isArray(v.sizes) && v.sizes.length > 0) {
                    return v.sizes.map((s, idx) => {
                      const isSelected =
                        selectedVariant?.color === v.color &&
                        selectedVariant?.size === s.size;
                      return (
                        <div
                          key={`${v.color}-${s.size}-${idx}`}
                          onClick={() => {
                            setSelectedVariant({ color: v.color, size: s.size });
                            setStockVal(s.stock);
                          }}
                          className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary text-primary-content font-bold shadow-xs"
                              : "hover:bg-base-300/60"
                          }`}
                        >
                          <span>
                            {v.color} - Size {s.size}
                          </span>
                          <span className="badge badge-sm badge-neutral">
                            {s.stock} in stock
                          </span>
                        </div>
                      );
                    });
                  }
                  const isSelected =
                    selectedVariant?.color === v.color &&
                    !selectedVariant?.size;
                  return (
                    <div
                      key={v.color}
                      onClick={() => {
                        setSelectedVariant({ color: v.color, size: null });
                        setStockVal(v.stock ?? 0);
                      }}
                      className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-primary text-primary-content font-bold shadow-xs"
                          : "hover:bg-base-300/60"
                      }`}
                    >
                      <span>{v.color} (Color Only)</span>
                      <span className="badge badge-sm badge-neutral">
                        {v.stock ?? 0} in stock
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold block mb-1 text-base-content/70">
              {selectedVariant
                ? `New Stock for ${selectedVariant.color} (${selectedVariant.size})`
                : "New Stock Quantity"}
            </label>
            <input
              type="number"
              min="0"
              value={stockVal}
              onChange={(e) => setStockVal(e.target.value)}
              className="input input-bordered w-full rounded-xl"
              required
            />
          </div>

          <div className="modal-action pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-sm btn-main gap-1"
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <LuCheck className="size-4" />
              )}
              Save Stock
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-xs" onClick={onClose} />
    </div>
  );
};

export default QuickStockModal;

