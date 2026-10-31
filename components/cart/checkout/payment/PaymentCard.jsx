const PaymentCard = ({ children }) => {
  return (
    <div className="max-w-360 mx-auto p-5">
      <div className="bg-base-100 p-5 rounded-box flex flex-col gap-5 max-w-sm mx-auto items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default PaymentCard;
