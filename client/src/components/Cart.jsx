import { ShoppingCart } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Cart = () => {
  // Select the totalQuantity from the cart state in the Redux store
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  return (
    <div className="relative">
      <Link to="/cart" className="flex items-center">
        <ShoppingCart size={24} color="#A8CE3A" strokeWidth={1.75} />
        <span className="absolute bottom-3 right-0 left-5 bg-secondary text-white   rounded-full w-5 h-5 flex items-center justify-center  text-sm">
          {totalQuantity}
        </span>
      </Link>
    </div>
  );
};

export default Cart;
