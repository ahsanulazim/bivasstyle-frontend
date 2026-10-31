import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductData from "@/components/dashboard/products/ProductData";
import Link from "next/link";
import { LuPlus, LuSearch } from "react-icons/lu";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Products" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl w-1/2">Products</h2>
          <div className="flex items-center gap-5 w-1/2">
            <label className="input rounded-full w-full">
              <input type="search" required placeholder="Search" />
              <LuSearch className="h-[1em] opacity-50" />
            </label>
            <select defaultValue="filter" className="select">
              <option value="filter" disabled={true}>
                Filter
              </option>
              <option>Out of Stock</option>
              <option>New Items</option>
              <option>Featured</option>
            </select>
            <Link
              href="/dashboard/products/add-product"
              className="btn btn-main"
            >
              <LuPlus /> Add Products
            </Link>
          </div>
        </div>
      </section>
      <section>
        <ProductData />
      </section>
    </>
  );
};

export default page;
