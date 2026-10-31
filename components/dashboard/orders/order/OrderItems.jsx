import TakaSymbol from "@/components/ui/TakaSymbol";
import OrderDataAccordion from "../OrderDataAccordion";

const OrderItems = ({ order }) => {
  return (
    <OrderDataAccordion
      title={"Order Items"}
      badgeColor={"badge-success"}
      badge={order.status}
    >
      <div className="collapse-content text-sm">
        <div className="flex flex-col gap-5">
          {order.products.map((product) => (
            <div
              className="flex items-center gap-5"
              key={product.size + product.color}
            >
              <img className="size-18 rounded-box" src={product.image} />
              <div className="flex-1">
                <h3 className="text-sm capitalize opacity-70">
                  {product.category}
                </h3>
                <h2 className="font-bold text-lg">{product.productName}</h2>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <p>Size - {product.size}</p>
                  <p>Color - {product.color}</p>
                </div>
              </div>
              <div className="flex justify-between gap-10 font-bold">
                <div>
                  {product.quantity} x <TakaSymbol />
                  {product.price}
                </div>
                <div>
                  <TakaSymbol />
                  {product.quantity * Number(product.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OrderDataAccordion>
  );
};

export default OrderItems;
