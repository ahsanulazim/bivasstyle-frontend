import TakaSymbol from "@/components/ui/TakaSymbol";
import { MyContext } from "@/context/MyProvider";
import Image from "next/image";
import { useContext } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";

const ShippingData = () => {
  const { shippingRates, shippingRatesLoading } = useContext(MyContext);

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
              <th>Company</th>
              <th>Location</th>
              <th>Base Charge</th>
              <th>Extra Charge</th>
              <th>Weight Limit (KG)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {shippingRatesLoading ? (
              <tr>
                <td colSpan={8} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : shippingRates?.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              shippingRates?.map((rate) => (
                <tr key={rate._id}>
                  <td>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </td>
                  <td>
                    {rate.companyLogo ? (
                      <Image
                        src={rate.companyLogo}
                        alt={rate.companyName}
                        width={100}
                        height={30}
                      />
                    ) : (
                      rate.companyName
                    )}
                  </td>
                  <td>{rate.location?.map((item) => item.label).join(", ")}</td>
                  <td>
                    <TakaSymbol /> {rate.baseCharge}
                  </td>
                  <td>
                    <TakaSymbol /> {rate.extraCharge}
                  </td>
                  <td>{rate.weightLimit}</td>
                  <td>
                    <div
                      className={`badge badge-soft ${
                        rate?.status
                          ? "border-success badge-success"
                          : "border-error badge-error"
                      }`}
                    >
                      <div className="inline-grid *:[grid-area:1/1]">
                        <div
                          className={`status animate-ping ${
                            rate?.status ? "status-success" : "status-error"
                          }`}
                        ></div>{" "}
                        <div
                          className={`status ${
                            rate?.status ? "status-success" : "status-error"
                          }`}
                        ></div>
                      </div>{" "}
                      {rate?.status ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-5">
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

export default ShippingData;
