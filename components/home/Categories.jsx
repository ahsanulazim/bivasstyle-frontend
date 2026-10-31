import categories from "@/json/categories.json";
import CategoryCard from "../ui/CategoryCard";

const Categories = () => {
  return (
    <section className="px-5 mb-5">
      <div className="max-w-360 mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-main">
          Popular Categories
        </h2>
        <div className="flex justify-between gap-5 mt-5">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
