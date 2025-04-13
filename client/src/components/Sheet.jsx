import React from "react";
import { cn } from "@/lib/utils"; // Utility function for classNames
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import walmartLogo from "../assets/images/quickmart.png";

const Sheet = ({ isOpen, onClose, children, className, ...props }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      {/* Background Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose} // Close sheet on overlay click
      />

      {/* Sheet Content */}
      <div
        className={cn(
          "fixed top-0 right-0 h-[100vh] w-80 shadow-lg transition-transform transform bg-primary overflow-scroll",
          isOpen ? "translate-x-0" : "translate-x-full", // Slide in/out effect
          "duration-300 z-50"
        )}
      >
        <div className="h-[15vh]">
          <div className="absolute top-3 left-2">
            {user && (
              <div className="flex">
                <p className="text-md font-medium text-white">
                  Hi {user.fName} 👋
                </p>
              </div>
            )}
          </div>
          <button
            className="absolute right-3 z-50 top-3 text-white hover:text-gray-900 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="absolute top-12 left-2">
            <h3 className="text-2xl text-white font-medium">Browse</h3>
            <img
              src={walmartLogo}
              alt="Walmart Logo"
              className="w-fit h-[40px]"
            />
          </div>
        </div>
        <div className="p-6 relative h-[85vh]">{children}</div>
      </div>
    </>
  );
};

export default Sheet;
