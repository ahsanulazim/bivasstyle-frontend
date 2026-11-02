"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa6";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to Bivas Style!");
    setEmail("");
  };

  return (
    <footer className="site-footer bg-main-dark text-white border-t border-neutral-800 mt-16 font-dm-sans">
      {/* 1. Main Footer Widgets (4 Columns) */}
      <div className="site-footer-row footer-widgets border-b border-neutral-50/10">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Company */}
            <div className="lg:col-span-3">
              <h4 className="text-[15px] font-bold tracking-tight text-white mb-4 uppercase">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Careers for Bivas Style
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About Bivas Style
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Investor Relations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Bivas Devices &amp; Outlets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Customer reviews
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Social Responsibility
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Store Locations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="lg:col-span-3">
              <h4 className="text-[15px] font-bold tracking-tight text-white mb-4 uppercase">
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/return-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Returns &amp; Replacements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Shipping Rates &amp; Policies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/return-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Refund and Returns Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Cookie Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Help & Support */}
            <div className="lg:col-span-3">
              <h4 className="text-[15px] font-bold tracking-tight text-white mb-4 uppercase">
                Help &amp; Support
              </h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Sell on Bivas Style
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Sell Your Services on Bivas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Sell on Bivas Business
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Sell Your Apps on Bivas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Become an Affiliate
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Advertise Your Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Sell-Publish with Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Become a Bivas Vendor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="lg:col-span-3">
              <h4 className="text-[15px] font-bold tracking-tight text-white mb-4">
                Subscribe to our emails
              </h4>
              <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                Subscribe to receive all our updates and offers, and get a 10%
                discount on your first purchase.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-[#141414] border border-neutral-700/80 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                  Subscribe
                </button>
                <div className="pt-1">
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    By subscribing you agree to our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-neutral-300 underline underline-offset-2 hover:text-white"
                    >
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-neutral-300 underline underline-offset-2 hover:text-white"
                    >
                      Privacy &amp; Cookies Policy
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Copyright & Payment Icons Row */}
      <div className="site-footer-row footer-copyright border-b border-neutral-50/10">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs sm:text-sm text-neutral-400">
              Copyright {new Date().getFullYear()} ©{" "}
              <span className="text-white font-medium">Bivas Style</span> Theme.
              All rights reserved. Powered by{" "}
              <Link
                href="https://nexorosolution.com"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:underline"
              >
                Nexoro Solutions
              </Link>
              .
            </p>

            {/* Social Cards */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <a href="https://www.facebook.com/bivasstyle" target="_blank">
                <button className="btn btn-circle btn-outline">
                  <FaFacebookF />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Brand Logo Pattern (Giant Watermark Logo) */}
      <div className="site-footer-row footer-logo-pattern bg-main-dark overflow-hidden flex items-center justify-center pt-8 pb-4 px-4 select-none pointer-events-none">
        <div className="w-full max-w-360 flex justify-center items-center">
          <Image
            width={1440}
            height={300}
            src="/assets/logo-title.svg"
            className="-mb-12 sm:-mb-22 md:-mb-32"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
