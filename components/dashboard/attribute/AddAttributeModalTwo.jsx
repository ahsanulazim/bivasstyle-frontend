"use client";

import { useState, useEffect } from "react";
import { createAttribute, updateAttribute } from "@/api/attributeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuX, LuSparkles } from "react-icons/lu";
import { toast } from "react-toastify";

const normalizeVariations = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") {
      return { name: item, value: item };
    }
    return {
      name: item?.name || item?.value || "",
      value: item?.value || item?.name || "",
      swatchImage: item?.swatchImage || null,
    };
  });
};

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const AddAttributeModalTwo = ({ ref, isEditing, attribute }) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("button");
  const [variations, setVariations] = useState([]);

  // Input states for adding new terms
  const [termName, setTermName] = useState("");
  const [termValue, setTermValue] = useState("");
  const [termColor, setTermColor] = useState("#000000");
  const [bulkInput, setBulkInput] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  // Sync state when editing or attribute changes
  useEffect(() => {
    if (isEditing && attribute) {
      setName(attribute.name || "");
      setSlug(attribute.slug || "");
      const detectedType =
        attribute.type ||
        (attribute.slug === "color" || attribute.name?.toLowerCase() === "color"
          ? "color"
          : "button");
      setType(detectedType);
      setVariations(normalizeVariations(attribute.variations));
    } else if (!isEditing) {
      setName("");
      setSlug("");
      setType("button");
      setVariations([]);
    }
  }, [isEditing, attribute]);

  const handleNameChange = (val) => {
    setName(val);
    const newSlug = slugify(val);
    setSlug(newSlug);
    if (!isEditing) {
      if (newSlug === "color" || val.toLowerCase().includes("color")) {
        setType("color");
      } else {
        setType("button");
      }
    }
  };

  const handleAddSingleTerm = (e) => {
    e?.preventDefault();
    if (!termName.trim()) {
      toast.warn("Please enter a value name / label");
      return;
    }

    const valueToSave =
      type === "color"
        ? termColor
        : termValue.trim() || termName.trim();

    // Check duplicate
    const exists = variations.some(
      (v) => v.name.toLowerCase() === termName.trim().toLowerCase(),
    );
    if (exists) {
      toast.warn(`"${termName}" is already added`);
      return;
    }

    setVariations((prev) => [
      ...prev,
      {
        name: termName.trim(),
        value: valueToSave,
      },
    ]);

    setTermName("");
    setTermValue("");
  };

  const handleAddBulk = () => {
    if (!bulkInput.trim()) return;
    const parts = bulkInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const existingNames = new Set(
      variations.map((v) => v.name.toLowerCase()),
    );

    const newItems = [];
    for (const part of parts) {
      if (!existingNames.has(part.toLowerCase())) {
        newItems.push({
          name: part,
          value: type === "color" ? "#000000" : part,
        });
        existingNames.add(part.toLowerCase());
      }
    }

    if (newItems.length > 0) {
      setVariations((prev) => [...prev, ...newItems]);
      setBulkInput("");
      setShowBulk(false);
      toast.success(`Added ${newItems.length} variation value(s)`);
    } else {
      toast.info("No new unique variation values to add");
    }
  };

  const handleRemoveTerm = (index) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const addMutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Attribute created successfully");
      handleClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Failed to create attribute",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Attribute updated successfully");
      handleClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update attribute",
      );
    },
  });

  const handleClose = () => {
    ref.current?.close();
    if (!isEditing) {
      setName("");
      setSlug("");
      setType("button");
      setVariations([]);
      setTermName("");
      setTermValue("");
      setBulkInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Attribute name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Attribute slug is required");
      return;
    }
    if (variations.length === 0) {
      toast.error("Please add at least one variation value");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      type,
      variations,
    };

    if (isEditing) {
      updateMutation.mutate({ attributeData: payload, id: attribute._id });
    } else {
      addMutation.mutate(payload);
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-xl p-6 bg-base-100">
        <div className="flex justify-between items-center pb-3 border-b border-base-200">
          <div>
            <h3 className="font-bold text-lg">
              {isEditing ? "Edit Product Attribute" : "Add New Product Attribute"}
            </h3>
            <p className="text-xs text-base-content/60">
              Define dimensions like Color or Size and their available options.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Row 1: Name and Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs font-semibold">
                Attribute Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Color, Size, Material"
                className="input input-sm w-full"
                required
              />
            </div>
            <div>
              <label className="label text-xs font-semibold">
                Slug <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="e.g. color, size"
                className="input input-sm w-full font-mono text-xs"
                required
              />
            </div>
          </div>

          {/* Row 2: Type selector */}
          <div>
            <label className="label text-xs font-semibold">Display Type</label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                  type === "color"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-base-300 hover:bg-base-200/50"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="color"
                  checked={type === "color"}
                  onChange={() => setType("color")}
                  className="hidden"
                />
                <span className="size-3 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400" />
                Color Swatch
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                  type === "button"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-base-300 hover:bg-base-200/50"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="button"
                  checked={type === "button"}
                  onChange={() => setType("button")}
                  className="hidden"
                />
                <span className="badge badge-xs badge-neutral">S</span>
                Button / Size
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                  type === "select"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-base-300 hover:bg-base-200/50"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="select"
                  checked={type === "select"}
                  onChange={() => setType("select")}
                  className="hidden"
                />
                Dropdown
              </label>
            </div>
          </div>

          {/* Row 3: Add Variation Term */}
          <div className="p-3.5 bg-base-200/50 rounded-xl border border-base-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                Add Variation Value
              </span>
              <button
                type="button"
                onClick={() => setShowBulk(!showBulk)}
                className="text-xs text-primary hover:underline font-medium"
              >
                {showBulk ? "Single Value Mode" : "Paste Comma-Separated"}
              </button>
            </div>

            {showBulk ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="e.g. Red, Blue, Green, Yellow"
                  className="input input-sm w-full"
                />
                <button
                  type="button"
                  onClick={handleAddBulk}
                  className="btn btn-sm btn-primary w-full"
                >
                  <LuPlus /> Add Values in Bulk
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <input
                  type="text"
                  value={termName}
                  onChange={(e) => setTermName(e.target.value)}
                  placeholder={
                    type === "color"
                      ? "Color name (e.g. Crimson Red)"
                      : "Value label (e.g. Large, 256GB)"
                  }
                  className="input input-sm flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSingleTerm();
                    }
                  }}
                />

                {type === "color" ? (
                  <div className="flex items-center gap-1.5 bg-base-100 border border-base-300 rounded-lg px-2 py-1">
                    <input
                      type="color"
                      value={termColor}
                      onChange={(e) => setTermColor(e.target.value)}
                      className="size-6 border-0 rounded cursor-pointer p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={termColor}
                      onChange={(e) => setTermColor(e.target.value)}
                      className="w-16 text-xs font-mono uppercase bg-transparent outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={termValue}
                    onChange={(e) => setTermValue(e.target.value)}
                    placeholder="Code (e.g. L)"
                    className="input input-sm w-24 font-mono text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSingleTerm();
                      }
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={handleAddSingleTerm}
                  className="btn btn-sm btn-neutral"
                >
                  <LuPlus /> Add
                </button>
              </div>
            )}
          </div>

          {/* Row 4: Values List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">
                Current Values ({variations.length})
              </label>
              {variations.length > 0 && (
                <button
                  type="button"
                  onClick={() => setVariations([])}
                  className="text-[11px] text-error hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {variations.length === 0 ? (
              <div className="p-4 border border-dashed border-base-300 rounded-xl text-center text-xs text-base-content/50">
                No values added yet. Add one above.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-base-200/30 rounded-xl border border-base-200">
                {variations.map((item, index) => {
                  const isColor =
                    typeof item.value === "string" &&
                    (item.value.startsWith("#") || item.value.startsWith("rgb"));

                  return (
                    <span
                      key={index}
                      className="badge badge-neutral badge-soft gap-2 py-2.5 px-3 text-xs flex items-center shadow-2xs"
                    >
                      {isColor && (
                        <span
                          className="size-3 rounded-full border border-black/10 inline-block shadow-2xs"
                          style={{ backgroundColor: item.value }}
                        />
                      )}
                      <span className="font-medium">{item.name}</span>
                      {type !== "color" && item.value && item.value !== item.name && (
                        <span className="text-[10px] opacity-60 font-mono">
                          ({item.value})
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(index)}
                        className="hover:text-error transition-colors ml-0.5"
                      >
                        <LuX className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action border-t border-base-200 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-ghost"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : isEditing ? (
                "Update Attribute"
              ) : (
                "Save Attribute"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddAttributeModalTwo;
