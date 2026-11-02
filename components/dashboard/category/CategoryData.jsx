"use client";

import { MyContext } from "@/context/MyProvider";
import moment from "moment";
import { useContext, useMemo, useRef, useState } from "react";
import {
  LuFolder,
  LuFolderOpen,
  LuSearch,
  LuSquarePen,
  LuTrash2,
} from "react-icons/lu";
import CategoryDeleteModal from "./CategoryDeleteModal";
import CategoryModal from "./CategoryModal";

const CategoryData = () => {
  const {
    categories = [],
    categoriesLoading,
    categoriesError,
    products = [],
  } = useContext(MyContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeEditCategory, setActiveEditCategory] = useState(null);
  const [activeDeleteCategory, setActiveDeleteCategory] = useState(null);

  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  const handleOpenEdit = (category) => {
    setActiveEditCategory(category);
    editModalRef.current?.showModal();
  };

  const handleOpenDelete = (category) => {
    setActiveDeleteCategory(category);
    deleteModalRef.current?.showModal();
  };

  // Calculate real product count per category
  const filteredCategories = useMemo(() => {
    let result = Array.isArray(categories) ? [...categories] : [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [categories, searchQuery]);

  const getProductCount = (category) => {
    if (Array.isArray(category?.products) && category.products.length > 0) {
      return category.products.length;
    }
    return products.filter(
      (p) =>
        p.category === category.slug ||
        p.category === category.name ||
        p.category?._id === category._id,
    ).length;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="input input-sm rounded-xl flex items-center gap-2 max-w-xs w-full bg-base-100 border border-base-300">
          <LuSearch className="size-3.5 opacity-50" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="text-xs grow"
          />
        </label>
        <span className="text-xs opacity-60">
          Total: {categories?.length || 0} categories
        </span>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-xs">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-200/80">
              <th>Thumbnail</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoriesLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={6}>
                    <div className="skeleton h-8 w-full"></div>
                  </td>
                </tr>
              ))
            ) : categoriesError ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-error text-xs">
                  Failed to load categories
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <LuFolder className="mx-auto size-8 opacity-30" />
                  <p className="mt-2 text-sm opacity-60">
                    {searchQuery
                      ? "No categories match your search"
                      : "No categories created yet"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-base-200/50">
                  {/* Thumbnail */}
                  <td>
                    <div className="size-11 rounded-xl bg-base-200 overflow-hidden border border-base-300 flex items-center justify-center shrink-0">
                      {category.coverThumbnail ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={category.coverThumbnail}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LuFolderOpen className="size-5 text-main opacity-60" />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td>
                    <div className="font-semibold text-sm">{category.name}</div>
                  </td>

                  {/* Slug */}
                  <td>
                    <span className="badge badge-sm badge-ghost font-mono text-[11px]">
                      {category.slug}
                    </span>
                  </td>

                  {/* Products count */}
                  <td>
                    <span className="badge badge-sm badge-soft badge-info font-semibold">
                      {getProductCount(category)} item
                      {getProductCount(category) === 1 ? "" : "s"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="text-xs opacity-70 whitespace-nowrap">
                    {category.createdAt
                      ? moment(category.createdAt).format("MMM DD, YYYY")
                      : "—"}
                  </td>

                  {/* Actions */}
                  <td className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(category)}
                        className="btn btn-xs btn-ghost btn-circle text-info hover:bg-info/10"
                        title="Edit Category"
                        aria-label="Edit Category"
                      >
                        <LuSquarePen className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(category)}
                        className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
                        title="Delete Category"
                        aria-label="Delete Category"
                      >
                        <LuTrash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <CategoryModal
        modalRef={editModalRef}
        category={activeEditCategory}
        isEditing={true}
        onClose={() => setActiveEditCategory(null)}
      />

      {/* Delete Confirmation Modal */}
      <CategoryDeleteModal
        modalRef={deleteModalRef}
        category={activeDeleteCategory}
        onClose={() => setActiveDeleteCategory(null)}
      />
    </div>
  );
};

export default CategoryData;
