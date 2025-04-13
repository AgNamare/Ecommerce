import React, { useState, useEffect } from "react";
import Stepper from "@/components/Stepper";
import { links, steps } from "@/config/cartConfig";
import AddressSlot from "@/components/AddressSlot";
import {
  useGetAddresses,
  useCreateAddress,
  useDeleteAddress,
} from "@/api/AddressApi";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryInfo } from "@/redux/order/orderSlice";
import { useNavigate } from "react-router-dom";
import DeliveryMethod from "@/components/DeliveryMethod";
import DeliverySlot from "@/components/DeliverySlot";
import OrderSummary from "@/components/OrderSummary";
import { toast } from "sonner"; // Import toast for notifications

const AddressPage = () => {
  const deliveryInfo = useSelector((state) => state.order.deliveryInfo);
  const paymentInfo = useSelector((state) => state.order.paymentInfo);
  const cart = useSelector((state) => state.cart);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const userId = useSelector((state) => state.user.user._id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if cart is available
  useEffect(() => {
    if (cart.products.length === 0) {
      toast.error("Add Items to cart first");
      navigate("/cart"); // Navigate to the cart page or wherever appropriate
    }
  }, [cart, navigate]);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [updatedAddresses, setUpdatedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    deliveryInfo.address || null
  );
  const [selectedMethod, setSelectedMethod] = useState(
    deliveryInfo.method || ""
  );
  const [selectedSlot, setSelectedSlot] = useState(
    deliveryInfo.deliverySlot || null
  );
  console.log(selectedSlot);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { addresses, isAddressesLoading } = useGetAddresses(userId);
  const { createAddressRequest, isCreatingAddress } = useCreateAddress(userId);
  const { deleteAddressRequest, isDeletingAddress } = useDeleteAddress(userId);

  useEffect(() => {
    if (!isAddressesLoading) {
      setUpdatedAddresses(addresses || []);
    }
  }, [isAddressesLoading, addresses]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (deliveryInfo.address) {
      setSelectedAddress(deliveryInfo.address);
    }
  }, [deliveryInfo.address]);

  const handleDeleteAddress = async (addressId) => {
    await deleteAddressRequest(addressId).then((updatedAddresses) => {
      setUpdatedAddresses(updatedAddresses);
    });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handleDeliverySubmit = () => {
    const updatedDeliveryInfo = {
      address: selectedAddress,
      method: selectedMethod,
      deliverySlot: selectedSlot,
    };
    dispatch(setDeliveryInfo(updatedDeliveryInfo));
    navigate("/payment");
  };

  const handleSelectSlot = (slot) => {
    console.log("Delivery Slot", slot);
    setSelectedSlot(slot);
  };

  const handleSubmit = (data) => {
    if (!data.longitude || !data.latitude) {
      return;
    }
    const newData = {
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
      contactNumber: data.contactNumber,
      building: data.building,
      city: data.city,
      apartment: data.apartment,
      instructions: data.instructions,
      addressType: data.addressType,
    };
    createAddressRequest(newData).then((updatedAddresses) => {
      setUpdatedAddresses(updatedAddresses);
      setIsSheetOpen(false);
    });
  };

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
    <div className="w-full mt-2 sm:px-6 lg:px-8">
      <Stepper
        steps={steps}
        to={links}
        doneSteps={doneSteps}
        heading={"Checkout Process"}
      />
      <div className="w-full flex flex-col md:flex-row mt-2 gap-4 items-start justify-between">
        <div className="w-full md:w-[65%]">
          <DeliveryMethod
            activeMethod={selectedMethod}
            onMethodChange={handleMethodChange}
          />
          <DeliverySlot
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            method={selectedMethod}
          />
          <div className="mt-4">
            {(selectedMethod === "normal" || selectedMethod === "express") && (
              <AddressSlot
                isPopoverOpen={isPopoverOpen}
                setIsPopoverOpen={setIsPopoverOpen}
                isSheetOpen={isSheetOpen}
                setIsSheetOpen={setIsSheetOpen}
                updatedAddresses={updatedAddresses}
                isAddressesLoading={isAddressesLoading}
                isDeletingAddress={isDeletingAddress}
                isCreatingAddress={isCreatingAddress}
                handleDeleteAddress={handleDeleteAddress}
                handleSelectAddress={handleSelectAddress}
                selectedDeliveryAddress={selectedAddress?.address}
                onCreateNewAddress={handleSubmit}
              />
            )}
          </div>

          <div className="flex w-full justify-center mt-4">
            <button
              className="bg-primary text-white px-4 py-2 rounded-full"
              type="button"
              onClick={handleDeliverySubmit}
            >
              Continue
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <OrderSummary subtotal={totalAmount} savings={10} shippingFee={100} />
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
