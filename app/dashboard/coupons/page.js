"use client";

import {
  applyBulkProductDiscount,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  toggleCouponStatus,
  updateCoupon,
} from "@/api/couponApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import TakaSymbol from "@/components/ui/TakaSymbol";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useContext, useMemo, useState } from "react";
import {
  LuCheck,
  LuCopy,
  LuFlame,
  LuMegaphone,
  LuPercent,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuSparkles,
  LuSquarePen,
  LuTag,
  LuTrash2,
  LuTruck,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";

const INITIAL_FORM = {
  code: "",
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountAmount: "",
  minOrderAmount: "",
  minQuantity: "",
  applicableTo: "all",
  targetCategories: [],
  targetProducts: [],
  excludeDiscountedProducts: false,
  firstOrderOnly: false,
  usageLimit: "",
  perUserLimit: "",
  startDate: "",
  endDate: "",
  isActive: true,
  isPublic: true,
  showBanner: false,
};

const getCouponComputedStatus = (coupon) => {
  if (!coupon.isActive) {
    return { key: "paused", label: "Paused", badge: "badge-neutral" };
  }
  const now = new Date();
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    return { key: "scheduled", label: "Scheduled", badge: "badge-info" };
  }
  if (coupon.endDate && new Date(coupon.endDate) < now) {
    return { key: "expired", label: "Expired", badge: "badge-error" };
  }
  if (
    Number(coupon.usageLimit) > 0 &&
    Number(coupon.usedCount || 0) >= Number(coupon.usageLimit)
  ) {
    return { key: "depleted", label: "Limit Reached", badge: "badge-warning" };
  }
  return { key: "active", label: "Active", badge: "badge-success" };
};

const CouponsPage = () => {
  const queryClient = useQueryClient();
  const { categories = [], products = [] } = useContext(MyContext);

  const [activeMainTab, setActiveMainTab] = useState("coupons"); // "coupons" | "bulk"
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [copiedCode, setCopiedCode] = useState(null);

  // Bulk Discount State
  const [bulkScope, setBulkScope] = useState("category");
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkSelectedProducts, setBulkSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState("percentage");
  const [bulkValue, setBulkValue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
  });

  const coupons = data?.coupons || [];

  // Summary metrics
  const stats = useMemo(() => {
    const activeCount = coupons.filter(
      (c) => getCouponComputedStatus(c).key === "active",
    ).length;
    const totalRedemptions = coupons.reduce(
      (sum, c) => sum + Number(c.usedCount || 0),
      0,
    );
    const totalSavings = coupons.reduce(
      (sum, c) => sum + Number(c.totalDiscountGiven || 0),
      0,
    );
    return {
      total: coupons.length,
      activeCount,
      totalRedemptions,
      totalSavings,
    };
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const computed = getCouponComputedStatus(coupon);
      if (statusFilter !== "all" && computed.key !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          coupon.code?.toLowerCase().includes(q) ||
          coupon.title?.toLowerCase().includes(q) ||
          coupon.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [coupons, statusFilter, searchQuery]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingCouponId
        ? updateCoupon({ id: editingCouponId, ...payload })
        : createCoupon(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Coupon saved successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["publicCoupons"] });
      setIsModalOpen(false);
      setEditingCouponId(null);
      setFormData(INITIAL_FORM);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save coupon");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCouponStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["publicCoupons"] });
      toast.success("Coupon status updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["publicCoupons"] });
      toast.success("Coupon deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    },
  });

  const bulkDiscountMutation = useMutation({
    mutationFn: applyBulkProductDiscount,
    onSuccess: (res) => {
      toast.success(res.message || "Bulk discount applied!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setBulkValue("");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to apply bulk discount",
      );
    },
  });

  const handleOpenCreate = () => {
    setEditingCouponId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCouponId(coupon._id);
    setFormData({
      code: coupon.code || "",
      title: coupon.title || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue ?? "",
      maxDiscountAmount: coupon.maxDiscountAmount || "",
      minOrderAmount: coupon.minOrderAmount || "",
      minQuantity: coupon.minQuantity || "",
      applicableTo: coupon.applicableTo || "all",
      targetCategories: coupon.targetCategories || [],
      targetProducts: coupon.targetProducts || [],
      excludeDiscountedProducts: Boolean(coupon.excludeDiscountedProducts),
      firstOrderOnly: Boolean(coupon.firstOrderOnly),
      usageLimit: coupon.usageLimit || "",
      perUserLimit: coupon.perUserLimit || "",
      startDate: coupon.startDate
        ? moment(coupon.startDate).format("YYYY-MM-DD")
        : "",
      endDate: coupon.endDate
        ? moment(coupon.endDate).format("YYYY-MM-DD")
        : "",
      isActive: Boolean(coupon.isActive),
      isPublic: coupon.isPublic !== undefined ? Boolean(coupon.isPublic) : true,
      showBanner: Boolean(coupon.showBanner),
    });
    setIsModalOpen(true);
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "OIKI-";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code: result }));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleTargetCategory = (slug) => {
    setFormData((prev) => {
      const exists = prev.targetCategories.includes(slug);
      return {
        ...prev,
        targetCategories: exists
          ? prev.targetCategories.filter((c) => c !== slug)
          : [...prev.targetCategories, slug],
      };
    });
  };

  const toggleTargetProduct = (id) => {
    setFormData((prev) => {
      const exists = prev.targetProducts.includes(id);
      return {
        ...prev,
        targetProducts: exists
          ? prev.targetProducts.filter((p) => p !== id)
          : [...prev.targetProducts, id],
      };
    });
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      return toast.error("Coupon code is required");
    }
    if (
      formData.discountType !== "free_shipping" &&
      (!formData.discountValue || Number(formData.discountValue) <= 0)
    ) {
      return toast.error("Please enter a valid discount value");
    }
    saveMutation.mutate(formData);
  };

  // Preview products affected by Bulk Discount
  const affectedBulkProducts = useMemo(() => {
    if (bulkScope === "all") return products;
    if (bulkScope === "category") {
      return bulkCategory
        ? products.filter((p) => p.category === bulkCategory)
        : [];
    }
    if (bulkScope === "products") {
      return products.filter((p) => bulkSelectedProducts.includes(p._id));
    }
    return [];
  }, [products, bulkScope, bulkCategory, bulkSelectedProducts]);

  const discountedProductsCount = useMemo(() => {
    return products.filter(
      (p) =>
        (Number(p.discount) > 0 && Number(p.discount) < Number(p.price)) ||
        (p.variantDetails || []).some((v) =>
          (v.sizes || []).some(
            (s) => Number(s.discount) > 0 && Number(s.discount) < Number(s.price),
          ),
        ),
    ).length;
  }, [products]);

  const handleApplyBulk = (e) => {
    e.preventDefault();
    if (bulkAction !== "clear" && (!bulkValue || Number(bulkValue) <= 0)) {
      return toast.error("Please enter a valid discount amount/percentage");
    }
    bulkDiscountMutation.mutate({
      scope: bulkScope,
      category: bulkCategory,
      productIds: bulkSelectedProducts,
      action: bulkAction,
      discountValue: Number(bulkValue) || 0,
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs title="Coupons & Discounts" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl">
            Coupon & Discount Control Center
          </h2>
          <p className="text-xs opacity-60">
            Manage promo codes, usage limits, category targeting, storefront
            banners, and bulk flash sales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div role="tablist" className="tabs tabs-box bg-base-100">
            <button
              type="button"
              role="tab"
              onClick={() => setActiveMainTab("coupons")}
              className={`tab gap-1.5 font-medium ${
                activeMainTab === "coupons" ? "tab-active" : ""
              }`}
            >
              <LuTag className="size-4" /> Promo Codes
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => setActiveMainTab("bulk")}
              className={`tab gap-1.5 font-medium ${
                activeMainTab === "bulk" ? "tab-active" : ""
              }`}
            >
              <LuFlame className="size-4 text-warning" /> Bulk & Flash Sale
            </button>
          </div>
          {activeMainTab === "coupons" && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn btn-main btn-sm gap-1.5"
            >
              <LuPlus className="size-4" /> Create Coupon
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Total Coupons
            </p>
            <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            <p className="text-xs opacity-60 mt-0.5">
              {stats.activeCount} currently active
            </p>
          </div>
          <div className="p-3 rounded-full bg-main/10 text-main">
            <LuTag size={22} />
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Total Redemptions
            </p>
            <h3 className="text-2xl font-bold mt-1 text-info">
              {stats.totalRedemptions}
            </h3>
            <p className="text-xs opacity-60 mt-0.5">Orders used promo codes</p>
          </div>
          <div className="p-3 rounded-full bg-info/10 text-info">
            <LuUsers size={22} />
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Total Discount Given
            </p>
            <h3 className="text-2xl font-bold mt-1 text-success">
              <TakaSymbol />
              {stats.totalSavings.toLocaleString()}
            </h3>
            <p className="text-xs opacity-60 mt-0.5">Customer coupon savings</p>
          </div>
          <div className="p-3 rounded-full bg-success/10 text-success">
            <LuPercent size={22} />
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-box border border-base-300 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase opacity-60 font-semibold">
              Products On Sale
            </p>
            <h3 className="text-2xl font-bold mt-1 text-warning">
              {discountedProductsCount} / {products.length}
            </h3>
            <p className="text-xs opacity-60 mt-0.5">
              Direct product discounts
            </p>
          </div>
          <div className="p-3 rounded-full bg-warning/10 text-warning">
            <LuFlame size={22} />
          </div>
        </div>
      </div>

      {/* TAB 1: PROMO CODES TABLE */}
      {activeMainTab === "coupons" && (
        <div className="bg-base-100 rounded-box border border-base-300 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" className="tabs tabs-box">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "scheduled", label: "Scheduled" },
                { key: "expired", label: "Expired" },
                { key: "paused", label: "Paused" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  onClick={() => setStatusFilter(t.key)}
                  className={`tab text-xs ${
                    statusFilter === t.key ? "tab-active" : ""
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <label className="input input-sm rounded-full flex items-center gap-2 w-full sm:w-64">
              <LuSearch className="opacity-50" />
              <input
                type="search"
                placeholder="Search code or campaign..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="grow"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm align-middle">
              <thead>
                <tr className="bg-base-200/70">
                  <th>Code & Campaign</th>
                  <th>Discount</th>
                  <th>Rules & Targeting</th>
                  <th>Usage & Savings</th>
                  <th>Validity</th>
                  <th>Status</th>
                  <th>Top Banner</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <span className="loading loading-spinner"></span>
                    </td>
                  </tr>
                ) : filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 opacity-60">
                      No coupons found. Click &ldquo;Create Coupon&rdquo; to
                      launch a promotion!
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => {
                    const statusInfo = getCouponComputedStatus(coupon);
                    return (
                      <tr key={coupon._id} className="hover:bg-base-200/40">
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-main/10 text-main border border-main/20">
                              {coupon.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(coupon.code)}
                              className="btn btn-ghost btn-xs btn-circle"
                              title="Copy code"
                            >
                              {copiedCode === coupon.code ? (
                                <LuCheck className="text-success" />
                              ) : (
                                <LuCopy />
                              )}
                            </button>
                          </div>
                          <p className="font-medium text-xs mt-1">
                            {coupon.title}
                          </p>
                          {coupon.description && (
                            <p className="text-[11px] opacity-60 line-clamp-1">
                              {coupon.description}
                            </p>
                          )}
                        </td>

                        <td>
                          {coupon.discountType === "percentage" ? (
                            <div>
                              <span className="font-bold text-main text-sm">
                                {coupon.discountValue}% OFF
                              </span>
                              {Number(coupon.maxDiscountAmount) > 0 && (
                                <p className="text-[11px] opacity-60">
                                  Up to <TakaSymbol />
                                  {coupon.maxDiscountAmount}
                                </p>
                              )}
                            </div>
                          ) : coupon.discountType === "fixed" ? (
                            <span className="font-bold text-success text-sm">
                              <TakaSymbol />
                              {coupon.discountValue} OFF
                            </span>
                          ) : (
                            <span className="badge badge-info badge-sm gap-1">
                              <LuTruck className="size-3" /> Free Shipping
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-1 max-w-56">
                            <span className="badge badge-xs badge-outline">
                              {coupon.applicableTo === "all"
                                ? "Storewide"
                                : coupon.applicableTo === "categories"
                                  ? `${coupon.targetCategories?.length || 0} Categorie(s)`
                                  : `${coupon.targetProducts?.length || 0} Product(s)`}
                            </span>
                            {Number(coupon.minOrderAmount) > 0 && (
                              <span className="badge badge-xs badge-ghost">
                                Min ৳{coupon.minOrderAmount}
                              </span>
                            )}
                            {Number(coupon.minQuantity) > 0 && (
                              <span className="badge badge-xs badge-ghost">
                                Min {coupon.minQuantity} pcs
                              </span>
                            )}
                            {coupon.firstOrderOnly && (
                              <span className="badge badge-xs badge-warning badge-soft">
                                1st Order Only
                              </span>
                            )}
                            {coupon.excludeDiscountedProducts && (
                              <span className="badge badge-xs badge-error badge-soft">
                                No Sale Items
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="text-xs">
                            <span className="font-bold">
                              {coupon.usedCount || 0}
                            </span>
                            {" / "}
                            <span>
                              {Number(coupon.usageLimit) > 0
                                ? coupon.usageLimit
                                : "∞"}
                            </span>
                            <span className="opacity-60 ml-1">used</span>
                          </div>
                          {Number(coupon.perUserLimit) > 0 && (
                            <p className="text-[11px] opacity-60">
                              Max {coupon.perUserLimit}/user
                            </p>
                          )}
                          <p className="text-[11px] text-success font-medium mt-0.5">
                            Saved: <TakaSymbol />
                            {Number(
                              coupon.totalDiscountGiven || 0,
                            ).toLocaleString()}
                          </p>
                        </td>

                        <td className="text-xs">
                          {coupon.startDate ? (
                            <div>
                              <span className="opacity-60">From:</span>{" "}
                              {moment(coupon.startDate).format("MMM DD, YY")}
                            </div>
                          ) : (
                            <span className="opacity-50">Immediate</span>
                          )}
                          {coupon.endDate ? (
                            <div>
                              <span className="opacity-60">Until:</span>{" "}
                              {moment(coupon.endDate).format("MMM DD, YY")}
                            </div>
                          ) : (
                            <div className="opacity-50">No Expiry</div>
                          )}
                        </td>

                        <td>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="toggle toggle-xs toggle-success"
                              checked={Boolean(coupon.isActive)}
                              onChange={(e) =>
                                toggleMutation.mutate({
                                  id: coupon._id,
                                  field: "isActive",
                                  value: e.target.checked,
                                })
                              }
                            />
                            <span
                              className={`badge badge-xs ${statusInfo.badge}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            className="toggle toggle-xs toggle-warning"
                            checked={Boolean(coupon.showBanner)}
                            title="Show in storefront top announcement bar"
                            onChange={(e) =>
                              toggleMutation.mutate({
                                id: coupon._id,
                                field: "showBanner",
                                value: e.target.checked,
                              })
                            }
                          />
                        </td>

                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(coupon)}
                              className="btn btn-xs btn-ghost btn-circle text-info"
                              title="Edit Coupon"
                            >
                              <LuSquarePen className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Delete coupon "${coupon.code}"?`,
                                  )
                                ) {
                                  deleteMutation.mutate(coupon._id);
                                }
                              }}
                              className="btn btn-xs btn-ghost btn-circle text-error"
                              title="Delete Coupon"
                            >
                              <LuTrash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BULK & FLASH SALE ENGINE */}
      {activeMainTab === "bulk" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <form
            onSubmit={handleApplyBulk}
            className="lg:col-span-5 bg-base-100 p-5 rounded-box border border-base-300 space-y-4"
          >
            <div className="flex items-center gap-2">
              <LuFlame className="text-warning text-xl" />
              <div>
                <h3 className="font-bold text-lg">
                  Bulk Product & Category Discount
                </h3>
                <p className="text-xs opacity-60">
                  Instantly apply or remove sale prices on products & size
                  variants.
                </p>
              </div>
            </div>

            <div className="divider my-1"></div>

            <div className="fieldset">
              <label className="label text-xs font-semibold">
                1. Select Target Scope
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "category", label: "By Category" },
                  { key: "products", label: "Select Products" },
                  { key: "all", label: "Entire Store" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setBulkScope(opt.key)}
                    className={`btn btn-sm ${
                      bulkScope === opt.key ? "btn-main" : "btn-outline"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {bulkScope === "category" && (
              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Choose Category
                </label>
                <select
                  className="select select-bordered w-full"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name} ({cat.slug})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {bulkScope === "products" && (
              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Select Products ({bulkSelectedProducts.length} selected)
                </label>
                <div className="max-h-44 overflow-y-auto border border-base-300 rounded-box p-2 space-y-1">
                  {products.map((prod) => (
                    <label
                      key={prod._id}
                      className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-base-200 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs"
                          checked={bulkSelectedProducts.includes(prod._id)}
                          onChange={() => {
                            setBulkSelectedProducts((prev) =>
                              prev.includes(prod._id)
                                ? prev.filter((id) => id !== prod._id)
                                : [...prev, prod._id],
                            );
                          }}
                        />
                        <span className="font-medium">{prod.productName}</span>
                      </div>
                      <span className="opacity-60">৳{prod.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="fieldset">
              <label className="label text-xs font-semibold">
                2. Discount Action
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBulkAction("percentage")}
                  className={`btn btn-sm ${
                    bulkAction === "percentage" ? "btn-info" : "btn-outline"
                  }`}
                >
                  % Percentage Off
                </button>
                <button
                  type="button"
                  onClick={() => setBulkAction("fixed")}
                  className={`btn btn-sm ${
                    bulkAction === "fixed" ? "btn-success" : "btn-outline"
                  }`}
                >
                  ৳ Flat Taka Off
                </button>
                <button
                  type="button"
                  onClick={() => setBulkAction("clear")}
                  className={`btn btn-sm ${
                    bulkAction === "clear" ? "btn-error" : "btn-outline"
                  }`}
                >
                  Clear Discounts
                </button>
              </div>
            </div>

            {bulkAction !== "clear" && (
              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  {bulkAction === "percentage"
                    ? "Discount Percentage (%)"
                    : "Flat Discount Amount (৳)"}
                </label>
                <input
                  type="number"
                  min="1"
                  max={bulkAction === "percentage" ? "95" : undefined}
                  placeholder={
                    bulkAction === "percentage" ? "e.g. 20" : "e.g. 300"
                  }
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={
                bulkDiscountMutation.isPending ||
                affectedBulkProducts.length === 0
              }
              className={`btn w-full ${
                bulkAction === "clear" ? "btn-error" : "btn-main"
              }`}
            >
              {bulkDiscountMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : bulkAction === "clear" ? (
                `Remove Discounts from ${affectedBulkProducts.length} Product(s)`
              ) : (
                `Apply Discount to ${affectedBulkProducts.length} Product(s)`
              )}
            </button>
          </form>

          {/* Live Impact Preview */}
          <div className="lg:col-span-7 bg-base-100 p-5 rounded-box border border-base-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">
                  Live Price Impact Preview ({affectedBulkProducts.length}{" "}
                  Products)
                </h3>
                <p className="text-xs opacity-60">
                  Preview how regular prices and variant prices will change.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="table table-xs">
                <thead>
                  <tr className="bg-base-200">
                    <th>Product</th>
                    <th>Category</th>
                    <th>Regular Price</th>
                    <th>Current Sale Price</th>
                    <th>New Sale Price (Preview)</th>
                  </tr>
                </thead>
                <tbody>
                  {affectedBulkProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 opacity-60">
                        Select a category or products on the left to preview
                        price changes.
                      </td>
                    </tr>
                  ) : (
                    affectedBulkProducts.map((p) => {
                      const reg = Number(p.price) || 0;
                      let previewNew = "No Discount";
                      if (bulkAction !== "clear" && Number(bulkValue) > 0) {
                        if (bulkAction === "percentage") {
                          previewNew = `৳${Math.max(
                            Math.round(reg - (reg * Number(bulkValue)) / 100),
                            1,
                          )}`;
                        } else if (bulkAction === "fixed") {
                          const d = Math.round(reg - Number(bulkValue));
                          previewNew = d > 0 ? `৳${d}` : "Unchanged";
                        }
                      }
                      return (
                        <tr key={p._id}>
                          <td className="font-medium">{p.productName}</td>
                          <td>
                            <span className="badge badge-xs badge-ghost">
                              {p.category}
                            </span>
                          </td>
                          <td>৳{reg}</td>
                          <td>
                            {Number(p.discount) > 0 ? (
                              <span className="text-warning font-semibold">
                                ৳{p.discount}
                              </span>
                            ) : (
                              <span className="opacity-40">—</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`font-bold ${
                                bulkAction === "clear"
                                  ? "text-error"
                                  : "text-success"
                              }`}
                            >
                              {previewNew}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT COUPON MODAL */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <div className="flex items-center gap-2">
                <LuSparkles className="text-main text-xl" />
                <h3 className="font-bold text-lg">
                  {editingCouponId ? "Edit Coupon" : "Create New Coupon"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <LuX />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 mt-4">
              {/* Row 1: Code & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Coupon Code <span className="text-error">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. EID25"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="input input-bordered w-full font-mono uppercase"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="btn btn-outline btn-square"
                      title="Auto-generate code"
                    >
                      <LuRefreshCw />
                    </button>
                  </div>
                </div>

                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Campaign Title <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eid-ul-Fitr Special 25% Off"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Description / Customer Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get 25% off on all Panjabi & Abaya orders above ৳1500!"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>

              {/* Row 2: Discount Type & Value */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200/50 p-4 rounded-box">
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Discount Type
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value,
                      })
                    }
                  >
                    <option value="percentage">Percentage (% Off)</option>
                    <option value="fixed">Fixed Amount (৳ Off)</option>
                    <option value="free_shipping">
                      Free Shipping (Delivery Waiver)
                    </option>
                  </select>
                </div>

                {formData.discountType !== "free_shipping" && (
                  <div className="fieldset">
                    <label className="label text-xs font-semibold">
                      {formData.discountType === "percentage"
                        ? "Discount Percentage (%)"
                        : "Discount Amount (৳)"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={
                        formData.discountType === "percentage"
                          ? "100"
                          : undefined
                      }
                      placeholder={
                        formData.discountType === "percentage" ? "20" : "200"
                      }
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                )}

                {formData.discountType === "percentage" && (
                  <div className="fieldset">
                    <label className="label text-xs font-semibold">
                      Max Discount Cap (৳) (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0 = No cap (e.g. 500)"
                      value={formData.maxDiscountAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscountAmount: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                    />
                  </div>
                )}
              </div>

              {/* Row 3: Minimum Requirements & Usage Limits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Min Order Subtotal (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = None"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Min Item Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = None"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minQuantity: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Limit Per Customer
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = Unlimited"
                    value={formData.perUserLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perUserLimit: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Row 4: Target Scope (All / Categories / Products) */}
              <div className="fieldset">
                <label className="label text-xs font-semibold">
                  Applicable Products / Categories
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { key: "all", label: "All Products (Storewide)" },
                    { key: "categories", label: "Specific Categories" },
                    { key: "products", label: "Specific Products" },
                  ].map((scope) => (
                    <button
                      key={scope.key}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, applicableTo: scope.key })
                      }
                      className={`btn btn-xs ${
                        formData.applicableTo === scope.key
                          ? "btn-main"
                          : "btn-outline"
                      }`}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>

                {formData.applicableTo === "categories" && (
                  <div className="flex flex-wrap gap-2 p-3 border border-base-300 rounded-box">
                    {categories.map((cat) => {
                      const selected = formData.targetCategories.includes(
                        cat.slug,
                      );
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => toggleTargetCategory(cat.slug)}
                          className={`btn btn-xs ${
                            selected ? "btn-info" : "btn-ghost border-base-300"
                          }`}
                        >
                          {selected && <LuCheck className="size-3" />}
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {formData.applicableTo === "products" && (
                  <div className="max-h-36 overflow-y-auto p-3 border border-base-300 rounded-box grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {products.map((prod) => {
                      const selected = formData.targetProducts.includes(
                        prod._id,
                      );
                      return (
                        <label
                          key={prod._id}
                          className="flex items-center gap-2 text-xs p-1 rounded hover:bg-base-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs"
                            checked={selected}
                            onChange={() => toggleTargetProduct(prod._id)}
                          />
                          <span className="truncate">{prod.productName}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Row 5: Validity Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="fieldset">
                  <label className="label text-xs font-semibold">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Row 6: Advanced Restriction & Visibility Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base-200/50 p-4 rounded-box text-xs">
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <div>
                    <p className="font-semibold">
                      Exclude Already Discounted Items
                    </p>
                    <p className="opacity-60">
                      Prevent double-discounting on sale items
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-error"
                    checked={formData.excludeDiscountedProducts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excludeDiscountedProducts: e.target.checked,
                      })
                    }
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <div>
                    <p className="font-semibold">First Order Only</p>
                    <p className="opacity-60">
                      Only valid for new first-time customers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-warning"
                    checked={formData.firstOrderOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstOrderOnly: e.target.checked,
                      })
                    }
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <div>
                    <p className="font-semibold">Show as Checkout Suggestion</p>
                    <p className="opacity-60">
                      Let customers see & click to apply at checkout
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-info"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <div>
                    <p className="font-semibold flex items-center gap-1">
                      <LuMegaphone className="text-warning" /> Top Announcement
                      Banner
                    </p>
                    <p className="opacity-60">
                      Highlight this promo code at the top of the store
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-success"
                    checked={formData.showBanner}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showBanner: e.target.checked,
                      })
                    }
                  />
                </label>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="btn btn-main"
                >
                  {saveMutation.isPending && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                  {editingCouponId ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;

