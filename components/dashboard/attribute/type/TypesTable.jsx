"use client";
import { getAllVariationsAsType } from "@/api/typeApi";
import { useQuery } from "@tanstack/react-query";
import { LuTrash2 } from "react-icons/lu";
import TypeDeleteModal from "./TypeDeleteModal";
import { useRef } from "react";

const TypesTable = ({ type }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["variations"],
    queryFn: () => getAllVariationsAsType(type),
  });

  const typeDeleteRef = useRef();

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {isLoading ? (
            <tr>
              <td colSpan="4" className="text-center">
                Loading...
              </td>
            </tr>
          ) : data.length <= 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((variation) => (
              <tr key={variation.name}>
                <td>{variation.name}</td>
                <td>{variation.slug}</td>
                <td>
                  {type === "color" ? (
                    <div
                      className="size-8 rounded-full border border-base-content/5"
                      style={{ backgroundColor: variation.value }}
                    />
                  ) : (
                    <button className="btn btn-square">
                      {variation.value}
                    </button>
                  )}
                </td>
                <td>
                  <div className="">
                    <TypeDeleteModal ref={typeDeleteRef} id={variation._id} />
                    <button
                      className="btn btn-error btn-square"
                      onClick={() => typeDeleteRef.current?.showModal()}
                    >
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
  );
};

export default TypesTable;
