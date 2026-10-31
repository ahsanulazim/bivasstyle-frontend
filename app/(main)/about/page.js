import Link from "next/link";
import { LuHouse, LuMail, LuMapPin, LuPhone } from "react-icons/lu";

export const metadata = {
  title: "About Us & Contact | Oiki Lifestyle",
  description: "Learn about Oiki Lifestyle's dedication to preserving Bengali craftsmanship.",
};

const AboutPage = () => {
  return (
    <section className="px-5 py-8 max-w-4xl mx-auto">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <Link href="/">
              <LuHouse />
            </Link>
          </li>
          <li>About &amp; Contact</li>
        </ul>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box p-6 md:p-10 space-y-6 text-sm leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Our Story &mdash; Oiki Lifestyle
        </h1>
        <p className="opacity-80 text-base">
          <strong>Oiki</strong> is dedicated to preserving the timeless heritage of Bengali craftsmanship. We bring you ethically made, handcrafted apparel—from elegant Sarees and festive ethnic wear to contemporary Kurtis—designed for the modern woman who celebrates her roots.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-base-300">
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Why Choose Oiki?</h2>
            <ul className="list-disc list-inside space-y-1.5 opacity-80">
              <li>Authentic fabrics sourced directly from local weavers.</li>
              <li>Breathable, skin-friendly materials tailored for our climate.</li>
              <li>Strict quality control and accurate sizing standards.</li>
              <li>Fast nationwide delivery with easy 3-day size exchange.</li>
            </ul>
          </div>

          <div className="space-y-3 bg-base-200/60 p-5 rounded-box">
            <h2 className="text-lg font-bold">Contact Us</h2>
            <p className="opacity-70 text-xs">
              Have a question about sizing, custom orders, or your shipment? Reach out to our team:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2.5">
                <LuMail className="text-main shrink-0" />
                <a href="mailto:support@oiki.store" className="link link-hover">
                  support@oiki.store
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <LuPhone className="text-main shrink-0" />
                <span>+880 1700-000000 (10:00 AM – 8:00 PM)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <LuMapPin className="text-main shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;

