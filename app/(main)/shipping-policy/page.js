import Link from "next/link";
import { LuHouse } from "react-icons/lu";

export const metadata = {
  title: "Shipping & Delivery Policy | Oiki Lifestyle",
  description: "Nationwide shipping rates and delivery timelines across Bangladesh.",
};

const ShippingPolicyPage = () => {
  return (
    <section className="px-5 py-8 max-w-4xl mx-auto">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/">
              <LuHouse />
            </Link>
          </li>
          <li>Shipping &amp; Delivery Policy</li>
        </ul>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box p-6 md:p-10 space-y-6 text-sm leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="opacity-80">
          Oiki Lifestyle delivers handcrafted apparel across all 64 districts of Bangladesh through trusted courier partners including <strong>Steadfast Courier</strong>.
        </p>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">1. Estimated Delivery Timeline</h2>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>
              <strong>Inside Dhaka Metro:</strong> 2–3 Working Days
            </li>
            <li>
              <strong>Dhaka Suburbs (Gazipur, Narayanganj, Savar, Keraniganj):</strong> 3–4 Working Days
            </li>
            <li>
              <strong>Outside Dhaka (All Other Districts):</strong> 3–5 Working Days
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">2. Order Confirmation &amp; Dispatch</h2>
          <p className="opacity-80">
            Orders placed before 3:00 PM are processed the same business day. Once your parcel is handed over to the courier, you can track your shipment anytime from our{" "}
            <Link href="/track-order" className="link text-main font-semibold">
              Track Order
            </Link>{" "}
            page.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">3. Payment Options</h2>
          <p className="opacity-80">
            We offer both <strong>Cash on Delivery (COD)</strong> nationwide and secure <strong>Online Payment</strong> (bKash, Nagad, Cards via ZiniPay).
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShippingPolicyPage;

