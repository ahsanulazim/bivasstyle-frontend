"use client";
import PaymentCard from "@/components/cart/checkout/payment/PaymentCard";
import Spinner from "@/components/skeleton/Spinner";
import Link from "next/link";
import { LuCheck, LuHouse, LuShoppingBag } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect } from "react";
import { MyContext } from "@/context/MyProvider";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useContext(MyContext);

  useEffect(() => {
    if (clearCart) {
      clearCart();
    }
  }, [clearCart]);

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
              <li>
                <Link href="/cart/checkout">Checkout</Link>
              </li>
              <li>Order Placed</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="my-10 px-5">
        <PaymentCard>
          <div className="bg-success text-success-content rounded-full p-3 w-fit">
            <LuCheck className="text-3xl" />
          </div>
          <h2 className="text-2xl text-success font-bold text-center">
            Order Placed Successfully!
          </h2>

          {orderId && (
            <div className="badge badge-lg badge-neutral gap-2 font-mono">
              Order ID: #{orderId.slice(-8).toUpperCase()}
            </div>
          )}

          <p className="text-center text-sm max-w-md text-base-content/80">
            Thank you for your order! We have received your order (Cash on Delivery) and our team will contact you shortly to confirm delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mt-2">
            <Link href="/products">
              <button className="btn btn-main gap-2">
                <LuShoppingBag /> Continue Shopping
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn btn-outline">View Order Dashboard</button>
            </Link>
          </div>

          <p className="text-center text-xs opacity-70 mt-4">
            Need help? Contact our support team at{" "}
            <a
              className="link text-main link-hover"
              href="mailto:support@bivasstyle.com"
            >
              support@bivasstyle.com
            </a>
          </p>
        </PaymentCard>
      </section>
    </>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
