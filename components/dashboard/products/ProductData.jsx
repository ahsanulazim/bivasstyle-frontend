"use client";

import { LuSquarePen, LuStar, LuTrash2 } from "react-icons/lu";
import ProductDeleteModal from "./ProductDeleteModal";
import { useContext, useRef, useState } from "react";
import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import TakaSymbol from "@/components/ui/TakaSymbol";

const ProductData = () => {
  const productRef = useRef();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { products, productsLoading } = useContext(MyContext);

  const getTotalStock = (product) => {
    if (Array.isArray(product.variantDetails) && product.variantDetails.length > 0) {
      return product.variantDetails.reduce((total, variant) => {
        const variantStock = (variant.sizes || []).reduce(
          (sum, s) => sum + Number(s.stock || 0),
          0,
        );
        return total + variantStock;
      }, 0);
    }
    return Number(product.stock || 0);
  };

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsLoading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : !products || products.length <= 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const totalStock = getTotalStock(product);
              return (
                <tr key={product._id || product.slug}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <Link
                      href={`/dashboard/products/edit-product?slug=${product.slug}`}
                      className="flex items-center gap-3 hover:text-main transition-colors"
                    >
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={
                              product.productImages?.[0] ||
                              product.variantDetails?.[0]?.swatchImage ||
                              "/assets/oiki-logo.svg"
                            }
                            alt={product.productName}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.productName}</div>
                      </div>
                    </Link>
                  </td>
                  <td>{product.sku || "N/A"}</td>
                  <td>
                    <TakaSymbol />
                    {product.price}
                  </td>
                  <td className="capitalize">
                    {product.category?.replace(/-/g, " ")}
                  </td>
                  <td>
                    <button className="btn btn-circle btn-sm btn-soft btn-warning">
                      <LuStar />
                    </button>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        totalStock <= 0 ? "badge-error" : "badge-success"
                      }`}
                    >
                      {totalStock <= 0
                        ? "Out of Stock"
                        : `In Stock (${totalStock})`}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/products/edit-product?slug=${product.slug}`}
                        className="btn btn-soft btn-info btn-sm btn-circle"
                        title="Edit Product"
                      >
                        <LuSquarePen />
                      </Link>
                      <button
                        className="btn btn-soft btn-error btn-sm btn-circle"
                        onClick={() => {
                          setSelectedProductId(product._id);
                          productRef.current?.showModal();
                        }}
                        title="Delete Product"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <ProductDeleteModal ref={productRef} id={selectedProductId} />
    </div>
  );
};

export default ProductData;
