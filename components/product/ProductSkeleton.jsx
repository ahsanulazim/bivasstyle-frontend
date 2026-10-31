const ProductSkeleton = () => {
  return (
    <>
      <section>
        <div className="max-w-360 px-5 mx-auto">
          <div className="breadcrumbs text-sm">
            <ul>
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <div className="skeleton w-16 xs:w-20 h-6"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-360 px-5 mx-auto mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-6">
            <div className="lg:col-span-5 w-full flex flex-col">
              <div className="skeleton w-full flex-1 max-lg:aspect-square"></div>
              <div className="flex justify-center items-center gap-3 my-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton size-14"></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="skeleton w-28 h-6"></div>
              <div className="skeleton w-full sm:w-xl h-8 sm:h-10 my-3"></div>
              <div className="skeleton w-40 h-8"></div>
              <div className="bg-base-200 p-4 xs:p-5 rounded-box shadow-xs h-fit my-5">
                <div>
                  <div className="skeleton w-24 h-6"></div>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="skeleton size-12 xs:size-14"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="my-4">
                  <div className="skeleton w-14 h-6"></div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="skeleton size-9"></div>
                    ))}
                  </div>
                </div>
                <div className="divider my-0"></div>
                <div className="skeleton w-48 h-6 my-4"></div>
                <div className="flex gap-2 items-center">
                  <div className="skeleton w-20 h-6"></div>
                  <div className="skeleton w-24 h-8"></div>
                </div>
                <div className="flex gap-4 xs:gap-5 items-center mt-5">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="skeleton flex-1 h-10"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-360 mx-auto px-5 my-10">
          <div className="tabs tabs-lift">
            <a role="tab" className="tab tab-active">
              <div className="skeleton w-24 h-6"></div>
            </a>
            <div className="tab-content bg-base-100 border-base-300 p-4 xs:p-5">
              <div className="flex flex-col gap-3">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-4 w-34"></div>
              </div>
            </div>
            <a role="tab" className="tab">
              <div className="skeleton w-24 h-6"></div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductSkeleton;
