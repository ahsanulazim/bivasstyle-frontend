import Image from "next/image";

const Hero = () => {
  return (
    <section className="p-5">
      <div className="grid md:grid-cols-7 gap-5 max-w-360 mx-auto">
        <div className="md:col-span-5 rounded-md overflow-clip">
          <Image
            width={800}
            height={450}
            alt="carousel"
            src="/assets/carousel/03.jpg.jpeg"
            className="h-full w-full object-cover"
          />
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
