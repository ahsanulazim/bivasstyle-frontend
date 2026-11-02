import Image from "next/image";
import Carousel from "../Carousel";

const Hero = () => {
  return (
    <section className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-5 max-w-360 mx-auto">
        <div className="md:col-span-5 rounded-md overflow-clip relative">
          <Carousel />
        </div>
        <div className="md:col-span-2 rounded-md overflow-clip">
          <Image
            width={400}
            height={450}
            alt="carousel"
            src="/assets/carousel/Squire-02.jpg"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
