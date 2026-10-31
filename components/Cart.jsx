"use client";
import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { LuShoppingBag, LuTrash2 } from "react-icons/lu";
import TakaSymbol from "./ui/TakaSymbol";

const Cart = () => {
  const { cartItems, removeFromCart, calculateTotalItem, calculateTotalPrice } =
    useContext(MyContext);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
        <div className="indicator">
          <LuShoppingBag className="h-5 w-5" />
          {calculateTotalItem() > 0 && (
            <span className="badge badge-xs badge-primary indicator-item bg-main border-main">
              {calculateTotalItem()}
            </span>
          )}
        </div>
      </div>
      <div
        className={`dropdown-content bg-base-100 rounded-box z-1 w-75 xs:w-90 shadow-sm `}
        tabIndex="-1"
      >
        <ul
          className={`menu flex-nowrap w-full p-0 ${
            cartItems.length > 3 ? "h-64 overflow-y-auto" : "h-fit"
          }`}
        >
          {cartItems.length === 0 ? (
            <li>
              <div className="hover:bg-transparent text-center block">
                <h2>Empty Cart</h2>
                <h3>No items in cart</h3>
              </div>
            </li>
          ) : (
            cartItems.map((item) => (
              <li key={item.id}>
                <div className="p-2 hover:rounded-box">
                  <img
                    src={item.image}
                    className="rounded-box size-15 object-cover"
                    alt={item.productName}
                  />
                  <div>
                    <h3>
                      {item.productName}-{item.size}
                    </h3>
                    <p className="text-xs font-bold">
                      {item.quantity}x <TakaSymbol />
                      {item.price} = <TakaSymbol />
                      {item.quantity * item.price}
                    </p>
                  </div>
                  <button
                    className="btn btn-square btn-sm btn-error"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {cartItems.length > 0 && (
          <div className="p-3 border-t border-base-300">
            <p className="mb-2">
              Total:{" "}
              <span className="font-bold">
                <TakaSymbol />
                {calculateTotalPrice()}
              </span>
            </p>
            <div className="flex gap-3">
              <Link href="/cart" className="flex-1">
                <button className="btn btn-main btn-sm w-full">Cart</button>
              </Link>
              <Link href="/cart/checkout" className="flex-1">
                <button className="btn btn-main btn-sm w-full">Checkout</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
