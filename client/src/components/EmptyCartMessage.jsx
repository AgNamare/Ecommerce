import React from "react";
import EmptyCart from "../assets/images/EmptyCart.png";
import { Link } from "react-router-dom";

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-[100%]  mt-10">
      <img src={EmptyCart} className="w-[400px]"  />
      <h2 className="text-xl font-semibold">Seen something you like?</h2>
      <h3>Add them to your cart now</h3>
      <Link
        to="/"
        className="border border-primary border-1 px-4 py-2 text-primary rounded-full"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCartMessage;
