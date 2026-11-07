import Link from "next/link";
import { FaMoon, FaStore } from "react-icons/fa6";
import { LuHouse, LuShoppingBag, LuUser } from "react-icons/lu";

const Dock = () => {
  return (
    <div className="dock bg-main text-neutral-content sticky lg:hidden bottom-0 z-30">
      <Link href="/">
        <LuHouse className="size-[1.2em]" />
        <span className="dock-label">Home</span>
      </Link>

      <Link href="/products">
        <FaStore className="size-[1.2em] animate-pulse" />
        <span className="dock-label">Shop</span>
      </Link>

      <Link href="/cart">
        <LuShoppingBag className="size-[1.2em]" />
        <span className="dock-label">Cart</span>
      </Link>
      <Link href="/login">
        <LuUser className="size-[1.2em]" />
        <span className="dock-label">Account</span>
      </Link>
    </div>
  );
};

export default Dock;
