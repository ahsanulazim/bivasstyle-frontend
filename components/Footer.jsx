import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="bg-neutral text-neutral-content px-5 mt-12">
        <div className="footer sm:footer-horizontal py-10 max-w-360 mx-auto">
          <aside>
            <Image
              src="/assets/oiki-logo-tag.svg"
              alt="Oiki Logo"
              width={120}
              height={60}
            />
            <p className="max-w-sm text-balance text-sm opacity-80">
              Oiki is dedicated to preserving Bengali craftsmanship. We bring
              you ethically made, handcrafted apparel from elegant sarees to
              trendy Kurtis, designed for the woman who celebrates her roots.
            </p>
          </aside>
          <nav>
            <h6 className="footer-title">Customer Care</h6>
            <Link href="/track-order" className="link link-hover">
              Track Your Order
            </Link>
            <Link href="/return-policy" className="link link-hover">
              Return &amp; Exchange Policy
            </Link>
            <Link href="/shipping-policy" className="link link-hover">
              Shipping &amp; Delivery Policy
            </Link>
            <Link href="/privacy-policy" className="link link-hover">
              Privacy Policy &amp; Terms
            </Link>
          </nav>
          <nav>
            <h6 className="footer-title">Quick Links</h6>
            <Link href="/products" className="link link-hover">
              Shop All Collection
            </Link>
            <Link href="/dashboard" className="link link-hover">
              My Account &amp; Orders
            </Link>
            <Link href="/cart" className="link link-hover">
              Shopping Cart
            </Link>
            <Link href="/about" className="link link-hover">
              About Oiki &amp; Contact
            </Link>
          </nav>
        </div>
      </footer>
      <footer className="footer sm:footer-horizontal footer-center bg-main text-neutral-content p-2">
        <aside>
          <p className="text-xs">
            Copyright © {new Date().getFullYear()} - All rights reserved by{" "}
            <a className="link" href="https://nexorosolution.com">
              Nexoro Solutions
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
