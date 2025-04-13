import OrderSummary from "@/components/OrderSummary";
import Stepper from "@/components/Stepper";
import { links, steps } from "@/config/cartConfig";
import { setPaymentInfo } from "@/redux/order/orderSlice";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import toast for notifications
import mpesa from "../../assets/mpesa.png"; // Ensure this asset is available

const PaymentPage = () => {
  const [paymentMethod] = useState("mpesa");
  const [cardholderName, setCardholderName] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Destructure setValue from useForm
  } = useForm();
  const navigate = useNavigate();

  const { totalAmount } = useSelector((state) => state.cart);
  const deliveryInfo = useSelector((state) => state.order.deliveryInfo);
  const paymentInfo = useSelector((state) => state.order.paymentInfo);
  const cart = useSelector((state) => state.cart);

  // Check if deliveryInfo is defined and handle navigation
  useEffect(() => {
    // Check deliveryInfo and navigate if criteria are not met
    if (cart.products.length === 0) {
      navigate("/cart");
      toast.error("Add items to Cart First");
    }

    const deliveryMethod = deliveryInfo.method;
    console.log(deliveryMethod);
    const hasAddress = deliveryInfo.address;
    const hasDeliverySlot = deliveryInfo.deliverySlot;
    console.log(hasDeliverySlot);

    if (deliveryMethod == "pick-up") {
      if (!hasDeliverySlot) {
        navigate("/address");
        toast.error("Fill in Delivery Details First");
      }
    } else {
      // For other methods, check for address and delivery slot
      if (!hasAddress || !hasDeliverySlot) {
        navigate("/address");
        toast.error("Fill in Delivery Details First");
      }
    }
  }, [deliveryInfo, cart, navigate, paymentInfo]);

  // Set the phone number field with the paymentInfo if available
  useEffect(() => {
    if (paymentInfo?.paymentAccount) {
      setValue("phoneNumber", paymentInfo.paymentAccount);
    }
  }, [paymentInfo, setValue]);

  const onSubmit = (data) => {
    const paymentInfo = {
      paymentMethod,
      paymentAccount: data.phoneNumber,
      cardholderName,
    };
    dispatch(setPaymentInfo(paymentInfo));
    navigate("/checkout");
  };

  console.log(cart.products);
  // Determine done steps based on deliveryInfo and paymentInfo
  const doneSteps = [];
  const deliveryMethod = deliveryInfo.method;
  const hasAddress = deliveryInfo.address;
  const hasDeliverySlot = deliveryInfo.deliverySlot;

  if (deliveryMethod === "pickup" || (hasAddress && hasDeliverySlot)) {
    doneSteps.push(1); // Delivery step completed
  }

  if (Object.keys(paymentInfo).length > 0) {
    doneSteps.push(2); // Payment step completed
  }

  if (cart.products.length > 0) {
    doneSteps.push(0); // Cart step completed
  }

  return (
    <div className="mt-2 bg-gray-50 sm:px-6 lg:px-8">
      <Stepper
        steps={steps}
        to={links}
        doneSteps={doneSteps}
        heading={"Checkout Process"}
      />

      <div className="flex flex-col lg:flex-row gap-8 justify-center lg:justify-between px-4 lg:px-8 py-4">
        <div className="flex-1">
          <div className="bg-white mt-2 p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Select Payment Method
            </h2>
            <p className="mb-4 text-sm md:text-base">
              You have selected M-Pesa as your payment method.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={mpesa}
                className="w-24 h-12 rounded-md shadow-md"
                alt="M-Pesa"
              />
              <span className="font-semibold text-lg">M-Pesa</span>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4">
              <h3 className="text-lg font-semibold mb-2">Enter Phone Number</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center mb-4">
                  <span
                    className={`w-[80px] mr-2 border-b pb-1 outline-none ${
                      errors.phoneNumber ? "border-red-600" : "border-gray-400"
                    }`}
                  >
                    +254
                  </span>
                  <input
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    type="text"
                    placeholder="Phone Number"
                    className={`w-full border-b pb-1 outline-none bg-transparent ${
                      errors.phoneNumber ? "border-red-600" : "border-gray-400"
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mb-2">
                    {errors.phoneNumber.message}
                  </p>
                )}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <OrderSummary shippingFee={100} subtotal={totalAmount} savings={10} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
