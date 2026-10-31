const OrderDataAccordion = ({ title, children, badge, badgeColor }) => {
  return (
    <details
      className="collapse collapse-arrow bg-base-100 border border-base-300"
      open
    >
      <summary className="collapse-title font-semibold">
        {title}{" "}
        {badge && (
          <div className={`badge capitalize ${badgeColor || "badge-error"}`}>
            {badge}
          </div>
        )}
      </summary>
      {children}
    </details>
  );
};

export default OrderDataAccordion;
