import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { AlarmClock } from "lucide-react";

const DeliverySlot = ({ onSelectSlot, method, selectedSlot: propSelectedSlot }) => {
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(propSelectedSlot || null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const generateDeliverySlots = () => {
      if (method === "express") {
        const now = new Date();
        const slot = {
          datetime: new Date(now.getTime() + 30 * 60000).toISOString(),
          display: `Express (Leaves in 30 minutes)`,
        };
        setDeliverySlots([slot]);
        setSelectedSlot(slot);
        onSelectSlot(slot.datetime); // Send ISO format directly
      } else {
        const times = ["09:00", "12:00", "15:00", "17:00", "19:00"];
        const today = new Date();
        const tempDeliverySlots = [];

        for (let d = 0; d < 5; d++) {
          const currentDate = new Date(today);
          currentDate.setDate(currentDate.getDate() + d);

          times.forEach((time) => {
            const dateTimeString = `${currentDate.getFullYear()}-${(
              currentDate.getMonth() + 1
            ).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")} ${time}`;
            const slotDateTime = new Date(dateTimeString);
            if (slotDateTime > today) {
              const dayOfWeek = getDayOfWeek(currentDate.getDay());
              const year = currentDate.getFullYear();
              const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
              const day = currentDate.getDate().toString().padStart(2, "0");
              const formattedTime = formatTime(time);

              const slot = {
                datetime: slotDateTime.toISOString(),
                display: `${dayOfWeek} ${day}${getOrdinalSuffix(day)} ${getMonthName(month)} ${formattedTime}`,
              };
              tempDeliverySlots.push(slot);
            }
          });
        }

        setDeliverySlots(tempDeliverySlots);
        
        // Check if propSelectedSlot exists in generated slots
        const matchedSlot = tempDeliverySlots.find(slot => slot.datetime === propSelectedSlot);
        setSelectedSlot(matchedSlot || tempDeliverySlots[0]); // Select the matched slot or the first one
        onSelectSlot(matchedSlot?.datetime || (tempDeliverySlots[0]?.datetime || null)); // Send ISO format directly
      }
    };

    generateDeliverySlots();
  }, [method, propSelectedSlot]); // Add propSelectedSlot to dependency array

  useEffect(() => {
    if (propSelectedSlot) {
      setSelectedSlot(deliverySlots.find(slot => slot.datetime === propSelectedSlot) || null);
    }
  }, [propSelectedSlot, deliverySlots]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    onSelectSlot(slot.datetime); // Send ISO format directly
    setIsOpen(false);
  };

  const getDayOfWeek = (dayIndex) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[dayIndex];
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const getMonthName = (month) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[parseInt(month, 10) - 1];
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const isPM = hourInt >= 12;
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute}${isPM ? " PM" : " AM"}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-primary bg-opacity-60 flex sm:flex-row gap-4 px-4 py-2 sm:px-10 sm:py-3 mt-2">
        <AlarmClock color="#E61927" className="text-xl sm:text-2xl" />
        <h2 className="text-base sm:text-lg font-semibold">
          Schedule Delivery Time
        </h2>
      </div>
      <div className="bg-white flex sm:flex-row justify-between gap-4 items-start sm:items-center p-4">
        <h2 className="text-sm sm:text-lg hidden font-semibold">
          Select Delivery Time Slot
        </h2>
        <p className="text-sm sm:text-md text-gray-700 w-[50%]">
          {method === "express"
            ? "Express (Leaves in 30 minutes after payment)"
            : selectedSlot
            ? selectedSlot.display
            : "Select a slot"}
        </p>
        <PopoverContent className="w-full sm:w-80 h-60 bg-white p-4">
          <ScrollArea className="h-full w-full border-none rounded-md border">
            <ul>
              {deliverySlots.map((slot, index) => (
                <li
                  key={index}
                  className={`py-2 px-3 cursor-pointer hover:bg-gray-100 rounded-md transition duration-300 text-xs sm:text-sm ${selectedSlot?.datetime === slot.datetime ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelectSlot(slot)}
                >
                  {slot.display}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </PopoverContent>
        <PopoverTrigger asChild>
          <button
            className="border-2 border-primary text-primary rounded-full px-2 py-1 hover:bg-primary hover:text-white transition duration-300 text-xs sm:text-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            Select Time Slot
          </button>
        </PopoverTrigger>
      </div>
    </Popover>
  );
};

export default DeliverySlot;
