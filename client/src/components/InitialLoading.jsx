import React from "react";
import Logo from "@/assets/images/quickmart.png";
import Soultech from "@/assets/images/Soultech.png";

const InitialLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100 text-center">
      {/* Main Content */}
      <div className="mb-10">
        <img src={Logo} alt="Jachar Logo" className="w-36 mb-4 mx-auto" />
        <h1 className="text-2xl font-medium text-primary">
          Magunas Supermarkets
        </h1>
        <p className="text-lg text-gray-700 mt-2">Shop smart from <span className="text-[#FCCC06] font-bold">everywhere</span> </p>

        {/* Animated Cart */}
        <div className="relative mt-6">
          <div className="text-4xl animate-bounce">🛒</div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 text-center">
        <p className="text-sm text-gray-500">Powered by Soultech</p>
        <img src={Soultech} alt="Soultech Logo" className="w-16 mt-2 mx-auto" />
      </div>
    </div>
  );
};

export default InitialLoading;
