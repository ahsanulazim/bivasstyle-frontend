const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  const handleChange = (value) => {
    setPaymentMethod(value);
  };
  return (
    <div className="bg-base-100 rounded-box p-5">
      <h2 className="font-bold text-xl">Payment Method</h2>
      <div className="divider"></div>
      <h3 className="text-sm opacity-50">Select a payment method</h3>
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "cod"}
            onChange={() => handleChange("cod")}
            className="radio radio-xs text-main"
          />
          <span className="text-sm">Cash on Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "online"}
            onChange={() => handleChange("online")}
            className="radio radio-xs text-main"
          />
          <span className="text-sm">Online Payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
