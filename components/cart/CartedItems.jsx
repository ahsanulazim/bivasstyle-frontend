"use client";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
import TakaSymbol from "../ui/TakaSymbol";
import { LuTrash2 } from "react-icons/lu";

const CartedItems = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity } =
    useContext(MyContext);

  return (
    <div className="bg-base-100 rounded-box p-5">
      <h2 className="font-bold text-xl">Your Products</h2>
      <div className="divider"></div>
      <div className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-5 items-center gap-5"
          >
            <div className="flex gap-5 md:col-span-3">
              <img
                src={item.image}
                alt={item.productName}
                className="rounded-box size-20"
              />
              <div className="flex-1">
                <h3>{item.productName}</h3>
                <h4 className="text-sm">
                  Size: <span className="font-bold">{item.size}</span> Color:{" "}
                  <span className="font-bold">{item.color}</span>
                </h4>
                <h4 className="text-sm">
                  Price:{" "}
                  <span className="font-bold">
                    <TakaSymbol />
                    {item.price}
                  </span>
                </h4>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <div className="join border border-base-300 rounded-box bg-base-100">
                <button
                  className="btn btn-sm btn-ghost join-item"
                  onClick={() =>
                    updateCartItemQuantity(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="px-4 py-1 flex items-center font-semibold text-sm">
                  {item.quantity}
                </span>
                <button
                  className="btn btn-sm btn-ghost join-item"
                  onClick={() =>
                    updateCartItemQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <div className="flex items-center justify-end">
                <h4 className="xs:text-lg font-bold mr-5 whitespace-nowrap">
                  <TakaSymbol /> {item.quantity * item.price}
                </h4>
                <button
                  className="btn btn-square btn-sm btn-error"
                  onClick={() => removeFromCart(item.id)}
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartedItems;
