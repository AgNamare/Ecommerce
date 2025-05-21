import React, { useState } from "react";
import { Calendar, ChevronsUpDown, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ProductOrderCard from "./ProductOrderCard";

const OrderCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  console.log(order);

  return (
    <div className="border px-2 md:px-4 bg-white mt-1 py-2">
      <div>
        <div className="flex justify-between items-center mb-1 ">
          <h4 className="text-xs md:text-sm font-semibold uppercase">
            ID: {order.orderId}
          </h4>
          <div
            className={`px-2 rounded-md py-1 text-xs text-white md:text-sm capitalize ${
              order.status === "pending" || order.status === "packing"
                ? "bg-gray-300" // Light gray-blue for pending or packing
                : order.status === "onRoute" ||
                  order.status === "ReadyForPickup"
                ? "bg-yellow-300" // Yellow for onRoute or ReadyForPickup
                : order.status === "Delivered" || order.status === "Picked-Up"
                ? "bg-green-300" // Green for Delivered or Picked-Up
                : "bg-gray-200" // Default background color if status doesn't match any of the above
            }`}
          >
            {order.status}
          </div>
        </div>
        <div className="flex justify-between flex-wrap gap-2 md:gap-4 w-full mb-2">
          <div className="flex items-center h-7 gap-2 py-1 md:py-2 bg-gray-100 rounded-full px-2 md:px-3">
            <Store color="#b12e26" size={14} />
            <p className="text-xs md:text-sm">
              {order.branch && order.branch.name}
            </p>
          </div>
          <div className="flex items-center h-7 gap-2 py-1 md:py-2 bg-gray-100 rounded-full px-2 md:px-3">
            <Calendar color="#b12e26" size={14} />
            <p className="text-xs md:text-sm">
              {new Date(order.delivery.deliverySlot).toLocaleDateString()}
            </p>
          </div>
          {order.delivery.address && (
            <div className="flex items-center h-7 gap-2 py-1 md:py-2 bg-gray-100 rounded-full px-2 md:px-3">
              <MapPin size={14} color="#b12e26" />
              <p className="text-xs md:text-sm">
                {order.delivery.address?.address.building},{" "}
                {order.delivery.address?.address.city}
              </p>
            </div>
          )}
        </div>
      </div>
      {order.products.slice(0, 1).map((product, index) => (
        <ProductOrderCard product={product} key={index} />
      ))}
      <div className="">
        {order.products.length > 1 && (
          <Collapsible open={isOpen} className="">
            <CollapsibleTrigger asChild></CollapsibleTrigger>
            <CollapsibleContent>
              {order.products.slice(1).map((product, index) => (
                <ProductOrderCard product={product} key={index} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="flex flex-wrap justify-between mt-1 items-center">
          <div className="text-xs md:text-sm">
            Total Amount Ksh{" "}
            <span className="font-semibold text-sm md:text-base">
              {order.totalAmount}
            </span>
          </div>
          <div>
            {order.products.length > 1 && (
              <button
                onClick={toggleOpen}
                variant="ghost"
                className="text-xs md:text-sm px-3 py-1 border border-primary hover:bg-primary hover:text-white text-primary rounded-full transition-all duration-300"
              >
                {isOpen ? "View Less" : "View More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
