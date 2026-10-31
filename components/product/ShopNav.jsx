import Link from "next/link";
import { LuHouse } from "react-icons/lu";

const ShopNav = ({ category, product }) => {
  const isAll = !category || category === "all";
  const cleanCategory = isAll ? "All Products" : category.replace(/-/g, " ");

  return (
    <section className="px-5">
      <div className="max-w-360 mx-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/">
                <LuHouse />
              </Link>
            </li>
            {category && !isAll && product?.productName ? (
              <>
                <li>
                  <Link href={`/products/${category}`}>{cleanCategory}</Link>
                </li>
                <li>{product?.productName}</li>
              </>
            ) : isAll ? (
              <li>All Products</li>
            ) : (
              <li>{cleanCategory}</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShopNav;
