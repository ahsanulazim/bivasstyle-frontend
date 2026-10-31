import OverviewCard from "./OverviewCard";

const OrderOverview = ({ orders = [] }) => {
  const onTheWayCount = orders.filter((o) =>
    ["confirmed", "processing", "shipped"].includes(o.status),
  ).length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "pending_payment",
  ).length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;

  const overviews = [
    {
      id: 1,
      title: "On the Way",
      count: onTheWayCount,
    },
    {
      id: 2,
      title: "Delivered",
      count: deliveredCount,
    },
    {
      id: 3,
      title: "Pending",
      count: pendingCount,
    },
    {
      id: 4,
      title: "Cancelled",
      count: cancelledCount,
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {overviews.map((overview) => (
          <OverviewCard key={overview.id} overview={overview} />
        ))}
      </div>
    </section>
  );
};

export default OrderOverview;
