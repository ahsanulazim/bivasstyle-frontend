import ProductInteractiveLayer from "./ProductInteractiveLayer";

const ProductInfo = ({ product }) => {
  return (
    <section className="mt-3 px-5">
      <div className="max-w-360 mx-auto w-full">
        <ProductInteractiveLayer product={product} />
      </div>
    </section>
  );
};

export default ProductInfo;
