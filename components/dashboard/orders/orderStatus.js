// Shared order status → badge styling map for dashboard views
const STATUS_MAP = {
  pending: { color: "badge-warning border-warning", dot: "status-warning", label: "Pending" },
  confirmed: { color: "badge-info border-info", dot: "status-info", label: "Confirmed" },
  processing: { color: "badge-info border-info", dot: "status-info", label: "Processing" },
  shipped: { color: "badge-primary border-primary", dot: "status-primary", label: "Shipped" },
  delivered: { color: "badge-success border-success", dot: "status-success", label: "Delivered" },
  hold: { color: "badge-neutral border-neutral", dot: "status-neutral", label: "On Hold" },
  cancelled: { color: "badge-error border-error", dot: "status-error", label: "Cancelled" },
};

export const getOrderStatusBadge = (status) => {
  if (STATUS_MAP[status]) return STATUS_MAP[status];
  // Unknown statuses should not be mislabeled as "Cancelled"
  const label = status
    ? String(status).charAt(0).toUpperCase() + String(status).slice(1)
    : "Unknown";
  return { color: "badge-ghost", dot: "status-neutral", label };
};

