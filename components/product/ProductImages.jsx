"use client";

import { useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductImages = ({ product, selectedColor }) => {
  // Dynamic current gallery selection filtering algorithm
  const currentGallery = useMemo(() => {
    const activeVariant = product?.variantDetails?.find(
      (v) => v.color === selectedColor,
    );
    return activeVariant?.imageGallery?.length > 0
      ? activeVariant.imageGallery
      : [];
  }, [product, selectedColor]);

  const settings = {
    customPaging: function (i) {
      const img = currentGallery[i];
      return (
        <a className="block w-full h-full aspect-square">
          <img
            src={img}
            alt="thumb"
            className="w-full h-full object-cover rounded-lg border border-base-300"
          />
        </a>
      );
    },
    dots: true,
    dotsClass:
      "slick-dots slick-thumb flex gap-2 justify-center mt-4 static! *:w-14! *:h-14! *:rounded-lg! *:overflow-hidden! [&_.slick-active_img]:border-main! [&_.slick-active_img]:border-2!",
    infinite: currentGallery.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  if (currentGallery.length === 0) {
    return (
      <div className="w-full aspect-square bg-base-300 flex items-center justify-center rounded-box">
        <span className="text-sm opacity-40">No Image Found</span>
      </div>
    );
  }

  return (
    <div className="slider-container w-full">
      <Slider {...settings}>
        {currentGallery.map((image, i) => (
          <div
            key={i}
            className="outline-none aspect-square w-full bg-base-100 rounded-box overflow-hidden border border-base-300"
          >
            <img
              src={image}
              alt={`${product?.productName} - View ${i}`}
              className="w-full h-full object-cover select-none"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductImages;
