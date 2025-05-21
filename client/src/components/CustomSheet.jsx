// CustomSheet.js
import React from "react";

const CustomSheet = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 flex items-center justify-center p-4 ${
          isOpen ? "scale-100" : "scale-95"
        } transition-transform duration-300`}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-6">
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomSheet;
