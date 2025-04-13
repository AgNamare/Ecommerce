import { EllipsisVertical, MapPinIcon } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AddressCard = ({ address, onSelectAddress, onDeleteAddress }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleCardClick = () => {
    onSelectAddress(address); // Pass the entire address object
    setIsSelected(true);
  };

  return (
    <div
      className={`relative flex items-center border-2 border-transparent py-2 cursor-pointer transition duration-300 ${
        isSelected ? "border-primary bg-gray-100" : "border-gray-200"
      } rounded-lg`} // Added rounded-lg for a card-like appearance
      onClick={handleCardClick}
    >
      <div className="flex items-center w-full gap-1">
        <MapPinIcon size={18} />
        <div className="flex-grow">
          <span className="font-bold capitalize">{address.city}</span> -
          {address.building} - {address.contactNumber}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="ml-auto focus:outline-none">
              <EllipsisVertical size={18} className="cursor-pointer" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col">
              <button
                onClick={onDeleteAddress}
                className="block w-full py-2 text-left px-4 bg-white text-red-500 hover:bg-gray-100 hover:text-red-600 focus:outline-none"
              >
                Delete
              </button>
              {/* Add more menu items as needed */}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default AddressCard;
