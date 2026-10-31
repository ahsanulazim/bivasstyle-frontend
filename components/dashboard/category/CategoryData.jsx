import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useContext } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";

const CategoryData = () => {
  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  return (
    <div className="my-5">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-base-200">
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Category</th>
              <th>Slug</th>
              <th>Items</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {categoriesLoading ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="loading loading-spinner"></span>
                  </div>
                </td>
              </tr>
            ) : categoriesError ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="text-error">
                      Failed to load categories
                    </span>
                  </div>
                </td>
              </tr>
            ) : categories?.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="text-warning">No categories found</span>
                  </div>
                </td>
              </tr>
            ) : (
              categories?.map((category) => (
                <tr key={category._id}>
                  <td>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category?.products?.length || 0}</td>
                  <td>{moment(category.createdAt).format("MMMM Do, YYYY")}</td>
                  <td>
                    <div className="flex gap-3">
                      <button className="btn btn-circle btn-soft btn-info">
                        <LuSquarePen />
                      </button>
                      <button className="btn btn-circle btn-soft btn-error">
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryData;
