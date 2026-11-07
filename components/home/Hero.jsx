import Image from "next/image";
import Carousel from "../Carousel";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="p-5">
      <h1 className="sr-only">
        Bivas Style - Muslim Fashion, Handcrafted Sarees &amp; Kurtis in
        Bangladesh
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-5 max-w-360 mx-auto">
        <div className="md:col-span-5 rounded-md overflow-clip relative">
          <Carousel />
        </div>
        <div className="md:col-span-2 rounded-md overflow-clip">
          <Link href="/products/velvel-cords-set/premium-velvet-co-ords-set-winter-collection">
            <Image
              width={400}
              height={450}
              alt="Bivas Style Featured Collection"
              src="/assets/carousel/banner-3.jpeg"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
