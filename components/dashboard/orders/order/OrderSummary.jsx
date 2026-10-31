import TakaSymbol from "@/components/ui/TakaSymbol";
import OrderDataAccordion from "../OrderDataAccordion";

const OrderSummary = ({ order }) => {
  const totalProducts = (order?.products || []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const isPaid = order?.paymentStatus === "paid";

  return (
    <OrderDataAccordion
      title={"Order Summary"}
      badge={isPaid ? "Paid" : "Payment Pending"}
      badgeColor={isPaid ? "badge-success" : "badge-warning"}
    >
      <div className="collapse-content text-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-5">
            <div className="flex-2">Payment Method</div>
            <div className="flex-1 flex justify-end items-center font-medium uppercase">
              {order?.paymentMethod === "cod" ? "Cash on Delivery" : "Online (ZiniPay)"}
            </div>
          </div>

          {order?.transactionId && (
            <div className="flex items-center justify-between gap-5">
              <div className="flex-2">Transaction ID</div>
              <div className="flex-1 flex justify-end items-center font-mono text-xs">
                {order.transactionId}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-5">
            <div className="flex-2">Subtotal</div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                {totalProducts} {totalProducts === 1 ? "Item" : "Items"}
              </div>
              <div>
                <TakaSymbol />
                {order?.subtotal}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5">
            <div className="flex-2">Discount</div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                {order?.couponCode ? (
                  <span className="badge badge-xs badge-success font-mono">
                    {order.couponCode}
                  </span>
                ) : (
                  "No coupon"
                )}
              </div>
              <div className={order?.discountAmount > 0 ? "text-success font-semibold" : ""}>
                {order?.discountAmount > 0 ? "-" : ""}
                <TakaSymbol />
                {order?.discountAmount || order?.discount || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5">
            <div className="flex-2">Shipping</div>
            <div className="flex-1 flex justify-between items-center">
              <div>Standard Shipping</div>
              <div>
                <TakaSymbol />
                {order?.shippingCharge}
              </div>
            </div>
          </div>

          <div className="divider my-1"></div>

          <div className="flex items-center justify-between gap-5 font-bold text-base">
            <div>Total</div>
            <div>
              <TakaSymbol />
              {order?.totalPrice}
            </div>
          </div>
        </div>
      </div>
    </OrderDataAccordion>
  );
};

export default OrderSummary;
