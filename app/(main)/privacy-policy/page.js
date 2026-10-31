import Link from "next/link";
import { LuHouse } from "react-icons/lu";

export const metadata = {
  title: "Privacy Policy & Terms | Oiki Lifestyle",
  description: "Privacy Policy and Terms of Service for Oiki Lifestyle.",
};

const PrivacyPolicyPage = () => {
  return (
    <section className="px-5 py-8 max-w-4xl mx-auto">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/">
              <LuHouse />
            </Link>
          </li>
          <li>Privacy Policy &amp; Terms</li>
        </ul>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box p-6 md:p-10 space-y-6 text-sm leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Privacy Policy &amp; Terms of Service
        </h1>
        <p className="opacity-80">
          Oiki Lifestyle respects your privacy and is committed to protecting the personal data you share with us when shopping on <strong>oiki.store</strong>.
        </p>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">1. Information We Collect</h2>
          <p className="opacity-80">
            When you place an order or register an account, we collect your name, phone number, email address, and delivery address solely to process and deliver your order and provide customer support.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">2. Data Sharing &amp; Security</h2>
          <p className="opacity-80">
            We never sell your personal information to third parties. Your shipping details (name, phone number, address) are shared only with our logistics partner (such as Steadfast Courier) to complete your delivery.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold">3. Product Color &amp; Handcrafted Variations</h2>
          <p className="opacity-80">
            We strive to display product colors as accurately as possible. However, slight variations may occur due to studio lighting, screen settings, or the authentic handcrafted dyeing and weaving techniques used in Bengali apparel.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;

