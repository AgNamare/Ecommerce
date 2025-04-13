import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddressCard from "@/components/AddressCard";
import { MapPinned } from "lucide-react";
import CustomSheet from "@/components/CustomSheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeliveryForm from "@/forms/DeliveryForm";

const AddressSlot = ({
  isPopoverOpen,
  setIsPopoverOpen,
  isSheetOpen,
  setIsSheetOpen,
  updatedAddresses,
  isAddressesLoading,
  isDeletingAddress,
  isCreatingAddress,
  handleDeleteAddress,
  handleSelectAddress,
  selectedDeliveryAddress,
  onCreateNewAddress,
}) => {
  const handleAddressSelect = (address) => {
    handleSelectAddress(address); // Call the original select handler
    setIsPopoverOpen(false); // Close the popover
  };

  return (
    <>
      <div className="bg-primary bg-opacity-60 flex sm:flex-row gap-4 px-4 py-2 sm:px-10 sm:py-3 ">
        <MapPinned color="#E61927" className="text-xl sm:text-2xl" />
        <h1 className="text-lg sm:text-xl font-semibold">Delivery Details</h1>
      </div>
      <div className="bg-white flex sm:flex-row justify-between items-start p-4">
        <div className="flex-1">
          {selectedDeliveryAddress ? (
            <>
              <p className="capitalize text-gray-700 text-sm sm:text-base">
                {selectedDeliveryAddress.addressType}
              </p>
              <p className="capitalize text-gray-700 text-sm sm:text-base">
                {selectedDeliveryAddress.building},{" "}
                {selectedDeliveryAddress.city}
              </p>
              <p className="text-sm sm:text-base">
                +{selectedDeliveryAddress.contactNumber}
              </p>
            </>
          ) : (
            <p className="text-sm sm:text-base">Select an address</p>
          )}
        </div>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="border-2 border-primary text-primary rounded-full px-2 py-1 hover:bg-primary hover:text-white transition duration-300 text-xs sm:text-sm"
              onClick={() => setIsPopoverOpen(true)}
            >
              View Addresses
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-96">
            <div className="flex flex-col gap-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm sm:text-base"
                  onClick={() => {
                    setIsSheetOpen(true);
                    setIsPopoverOpen(false);
                    onCreateNewAddress();
                  }}
                >
                  Create New Address
                </button>
              </div>
              {isAddressesLoading || isDeletingAddress || isCreatingAddress ? (
                <p className="text-sm sm:text-base">Loading...</p>
              ) : updatedAddresses?.length > 0 ? (
                updatedAddresses.map((addressData) => (
                  <AddressCard
                    selectedAddress={selectedDeliveryAddress}
                    key={addressData._id}
                    address={addressData.address}
                    onDeleteAddress={() => handleDeleteAddress(addressData._id)}
                    onSelectAddress={() => handleAddressSelect(addressData)} // Use the new handler
                  />
                ))
              ) : (
                <p className="text-sm sm:text-base">No addresses found.</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <CustomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <ScrollArea className="h-[90vh] w-full border-none rounded-md border">
          <DeliveryForm onSubmit={onCreateNewAddress} />
        </ScrollArea>
      </CustomSheet>
    </>
  );
};

export default AddressSlot;
