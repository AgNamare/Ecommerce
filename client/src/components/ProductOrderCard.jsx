import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";

const ProductOrderCard = ({ product }) => {
  return (
    <div className="flex border items-center gap-4">
      <img src={product.id.images[0]} className="w-[100px] h-[50px]" />

      <div className="flex flex-col justify-between py-1">
        <div className="text-sm font-semibold capitalize">
          {product.id.productName}
        </div>
        <div className="text-sm">
          {product.quantity} {product.quantity > 1 ? "Pieces" : "Piece"}{" "}
        </div>
        <div className="text-xs mt-1">Ksh {product.id.discountPrice}</div>
      </div>
    </div>
  );
};

export default ProductOrderCard;
