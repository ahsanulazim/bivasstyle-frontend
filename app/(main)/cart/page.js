"use client";

import CartedItems from "@/components/cart/CartedItems";
import Overview from "@/components/cart/Overview";
import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { LuHouse } from "react-icons/lu";

const page = () => {
  const { cartItems } = useContext(MyContext);

  return (
    <>
      <section className="px-5">
        <div className="max-w-360 mx-auto">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/">
                  <LuHouse />
                </Link>
              </li>
              <li>Cart</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="px-5 mb-5">
        <div
          className={`max-w-360 mx-auto ${cartItems.length === 0 ? "min-h-[calc(100dvh-180px)] flex items-center justify-center" : "grid grid-cols-1 lg:grid-cols-3 gap-5"}`}
        >
          {cartItems.length === 0 ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-main">Empty Cart</h3>
              <p className="my-2">Please Add Product to View</p>
              <Link href="/">
                <button className="btn btn-main">Back to Shop</button>
              </Link>
            </div>
          ) : (
            <>
              <div className="col-span-2">
                <CartedItems />
              </div>
              <div className="col-span-1">
                <Overview isCheckout={false} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
