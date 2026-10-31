import Link from "next/link";
import { LuHouse } from "react-icons/lu";

export const metadata = {
  title: "Return & Exchange Policy | Oiki Lifestyle",
  description: "Easy 3-day size exchange and return policy for Oiki Lifestyle apparel.",
};

const ReturnPolicyPage = () => {
  return (
    <section className="px-5 py-8 max-w-4xl mx-auto">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/">
              <LuHouse />
            </Link>
          </li>
          <li>Return &amp; Exchange Policy</li>
        </ul>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box p-6 md:p-10 space-y-6 text-sm leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Return &amp; Exchange Policy
        </h1>
        <p className="opacity-80">
          At <strong>Oiki Lifestyle</strong>, we want every piece of apparel you order to fit beautifully. If you face any size issue or receive a defective/wrong item, we offer a hassle-free exchange and return process.
        </p>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">1. Instant Check Upon Delivery</h2>
          <p className="opacity-80">
            We strongly encourage you to check your parcel in front of the delivery rider. If the product has any defect, damage, or does not match your order, you may return it immediately to the delivery rider without paying any extra charge.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">2. 3-Day Size Exchange Window</h2>
          <p className="opacity-80">
            If the size does not fit properly, you can request a size exchange within <strong>3 days (72 hours)</strong> of receiving your parcel.
          </p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>The garment must be unused, unwashed, and unaltered.</li>
            <li>Original price tags, labels, and packaging must be intact.</li>
            <li>For size exchanges not caused by our error, standard courier return-and-reship delivery charges will apply.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">3. Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>Discounted / clearance sale items (unless defective).</li>
            <li>Custom-tailored or altered garments.</li>
            <li>Items showing signs of wear, perfume, stains, or washing.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">4. Refund Process</h2>
          <p className="opacity-80">
            If a replacement size or product is out of stock for a defective or wrong delivery, a full refund will be processed via bKash, Nagad, or bank transfer within <strong>5–7 working days</strong>.
          </p>
        </div>

        <div className="bg-base-200 p-4 rounded-box">
          <p className="font-semibold">Need an Exchange?</p>
          <p className="opacity-80 mt-1">
            Email us at{" "}
            <a href="mailto:support@oiki.store" className="link text-main font-semibold">
              support@oiki.store
            </a>{" "}
            with your Order ID and photos of the product tag.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReturnPolicyPage;

