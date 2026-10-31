"use client";

import Link from "next/link";
import { LuHouse } from "react-icons/lu";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "@/context/MyProvider";
import { useRouter } from "next/navigation";
import ShippingForm from "@/components/cart/checkout/ShippingForm";
import Overview from "@/components/cart/Overview";
import Spinner from "@/components/skeleton/Spinner";
import PaymentMethod from "@/components/cart/checkout/PaymentMethod";

const page = () => {
  const router = useRouter();
  const { cartItems, isHydrated } = useContext(MyContext);
  const [isPending, setIsPending] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (isHydrated && cartItems.length === 0 && !orderCompleted) {
      router.push("/cart");
    }
  }, [isHydrated, cartItems, orderCompleted, router]);

  const checkoutRef = useRef(null);

  if (!isHydrated) {
    return <Spinner />;
  }

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
              <li>
                <Link href="/cart">Cart</Link>
              </li>
              <li>Checkout</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="px-5 mb-5">
        <div className="max-w-360 mx-auto grid grid-cols-1 lg:grid-cols-8 gap-5">
          <div className="lg:col-span-4">
            <div className="bg-base-100 p-5 rounded-box">
              <h2 className="text-xl font-bold">Shipping & Billing</h2>
              <div className="divider"></div>
              <div>
                <ShippingForm
                  ref={checkoutRef}
                  setIsPending={setIsPending}
                  setOrderCompleted={setOrderCompleted}
                  paymentMethod={paymentMethod}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>
          <div className="lg:col-span-2">
            <Overview
              paymentMethod={paymentMethod}
              ref={checkoutRef}
              isCheckout={true}
              isPending={isPending}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
