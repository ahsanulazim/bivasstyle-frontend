"use client";

import Spinner from "@/components/skeleton/Spinner";
import { MyContext } from "@/context/MyProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const layout = ({ children }) => {
  const { newUser, loading } = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && newUser) {
      router.push("/dashboard");
    }
  }, [loading, newUser, router]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="min-h-[calc(100dvh-95px)] flex items-center justify-center bg-base-300 max-lg:p-5">
      <div className="flex flex-col lg:flex-row gap-5 bg-base-200 p-5 rounded-xl items-center max-lg:flex-1">
        <div className="bg-base-300 rounded-lg p-10 max-lg:order-2 w-full">
          <h2 className="text-center text-main font-bold text-xl xs:text-3xl text-balance">
            Safe and Secure Shopping Starts Here
          </h2>
          <Image
            src="/assets/Secure-Server-cuate.svg"
            className="mx-auto"
            alt="secure login"
            width={400}
            height={400}
          />
        </div>
        {children}
      </div>
    </section>
  );
};

export default layout;
