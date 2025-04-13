import airtel from "../assets/airtel.jpg";
import mpesa from "../assets/mpesa.png";
import mastercard from "../assets/mastercard.jpg";
import visa from "../assets/Visa.jpg";

const OrderSummary = ({ subtotal, savings = 0, shippingFee = 0 }) => {
  return (
    <div className="bg-white p-8 w-full border rounded-lg">
      <h2 className="font-bold mb-4 text-lg sm:text-xl md:text-2xl">
        Cart Summary
      </h2>
      <div className="flex justify-between mb-2 text-sm sm:text-base md:text-md">
        <span className="text-left">Subtotal</span>
        <span className="text-right">Ksh {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2 text-sm sm:text-base md:text-md">
        <span className="text-left">Savings</span>
        <span className="text-right">Ksh {savings.toFixed(2)}</span>
      </div>
      {shippingFee > 0 && (
        <div className="flex justify-between mb-2 text-sm sm:text-base md:text-md">
          <span className="text-left">Delivery</span>
          <span className="text-right">Ksh {shippingFee.toFixed(2)}</span>
        </div>
      )}
      <div className="border-y border-gray-300 py-2 flex justify-between font-semibold text-sm sm:text-base md:text-md">
        <span>Total (VAT Inc.)</span>
        <span>Ksh {(subtotal + shippingFee).toFixed(2)}</span>
      </div>

      <div className="mt-8">
        <h3 className="font-bold mb-4 text-base sm:text-sm md:text-md">
          Supported Payment Methods
        </h3>
        <div className="flex justify-around flex-wrap">
          <img src={airtel} alt="Airtel" className="h-10 w-auto" />
          <img src={mpesa} alt="Mpesa" className="h-10 w-auto" />
          <img src={mastercard} alt="Mastercard" className="h-10 w-auto" />
          <img src={visa} alt="Visa" className="h-10 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
