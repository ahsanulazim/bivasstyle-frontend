"use client";
import { getAllUsers } from "@/api/usersApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { GoPasskeyFill } from "react-icons/go";
import DeleteModal from "./DeleteModal";

const UsersData = () => {
  const userDeleteRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: [page, "users"],
    queryFn: getAllUsers,
    placeholderData: keepPreviousData,
  });

  const [userEmail, setUserEmail] = useState();

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Method</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {isLoading ? (
              <tr>
                <th colSpan={5} className="text-center">
                  Loading...
                </th>
              </tr>
            ) : isError ? (
              <tr>
                <th colSpan={5} className="text-center">
                  Something went wrong!
                </th>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <th colSpan={5} className="text-center">
                  No users found
                </th>
              </tr>
            ) : (
              data?.users.map((user, i) => (
                <tr key={user.email}>
                  <th>{(Number(page) - 1) * Number(data.limit) + (i + 1)}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isGoogle ? (
                      <FcGoogle size={20} />
                    ) : (
                      <GoPasskeyFill size={20} />
                    )}
                  </td>
                  <td>{moment(user.createdAt).format("MMMM Do, YY")}</td>
                  <td className="flex items-center gap-2">
                    <button className="btn btn-soft btn-circle btn-info">
                      <LuSquarePen />
                    </button>
                    <button
                      className="btn btn-soft btn-circle btn-error"
                      onClick={() => {
                        userDeleteRef.current.showModal();
                        setUserEmail(user.email);
                      }}
                    >
                      <LuTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <DeleteModal ref={userDeleteRef} email={userEmail} />
      </div>
      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="join mt-5">
          {Array.from({ length: data?.totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn ${page == i + 1 ? "btn-active" : ""}`}
              disabled={page == i + 1}
              onClick={() => {
                router.push(`?page=${i + 1}`);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default UsersData;
