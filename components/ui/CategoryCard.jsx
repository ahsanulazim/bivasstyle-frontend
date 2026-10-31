import Image from "next/image";
import Link from "next/link";

const CategoryCard = ({ category }) => {
  return (
    <Link href={category.link}>
      <Image
        src={category.image}
        alt={category.title}
        width={600}
        height={900}
        className="rounded-box"
      />
      <h3 className=" text-xs xs:text-sm sm:text-lg text-center font-medium">
        {category.title}
      </h3>
    </Link>
  );
};

export default CategoryCard;
