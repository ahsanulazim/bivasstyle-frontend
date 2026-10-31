import PaymentCard from "@/components/cart/checkout/payment/PaymentCard";
import Link from "next/link";
import { LuHouse, LuX } from "react-icons/lu";

const page = () => {
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
              <li>Payment Cancelled</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <PaymentCard>
          <div className="bg-error text-error-content rounded-full p-2 w-fit">
            <LuX className="text-2xl" />
          </div>
          <h2 className="text-xl text-error font-semibold">
            Payment Cancelled
          </h2>
          <p className="text-center text-sm">
            Hey, seems like there was some trouble. We are there with you. Just
            hold back.
          </p>
          <Link href="/cart/checkout">
            <button className="btn btn-main btn-wide">Try Again</button>
          </Link>
          <p className="text-center text-xs">
            Need help? Contact our support team at{" "}
            <a
              className="link text-main link-hover"
              href="mailto:support@oiki.store"
            >
              support@oiki.store
            </a>
          </p>
        </PaymentCard>
      </section>
    </>
  );
};

export default page;
