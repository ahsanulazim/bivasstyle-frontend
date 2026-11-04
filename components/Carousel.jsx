"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Carousel = () => {
  return (
    <>
      <Swiper
        loop={true}
        cssMode={true}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image
            width={1920}
            height={800}
            src="/assets/carousel/03.jpeg"
            alt="Bivas Style Premium Handcrafted Fashion Banner"
            priority={true}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width={1920}
            height={800}
            src="/assets/carousel/03.jpeg"
            alt="Bivas Style Festive Collection Promotion"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width={1920}
            height={800}
            src="/assets/carousel/03.jpeg"
            alt="Bivas Style Modest Wear and Sarees"
          />
        </SwiperSlide>
      </Swiper>
      <div className="absolute z-30 top-1/2 -translate-y-1/2 w-full flex justify-between p-2">
        <button
          className="prev-btn"
          aria-label="Previous slide"
          type="button"
        >
          <LuChevronLeft size={30} className="text-white cursor-pointer" />
        </button>
        <button
          className="next-btn"
          aria-label="Next slide"
          type="button"
        >
          <LuChevronRight size={30} className="text-white cursor-pointer" />
        </button>
      </div>
    </>
  );
};

export default Carousel;
