import React, { useState, useEffect } from "react";

const QuantityDropdown = ({
  productQuantity,
  stockLevel,
  price,
  onQuantityChange,
  initialQuantity,
}) => {
  // Cap options at 50, or use the stock level if it's less than 50
  const maxOptions = Math.min(stockLevel, 50);

  // Generate options based on the capped stock level
  const options = Array.from({ length: maxOptions }, (_, i) => i + 1);

  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [initialSet, setInitialSet] = useState(initialQuantity || 1);

  // Update initialSet whenever initialQuantity changes
  useEffect(() => {
    setInitialSet(initialQuantity || 1);
  }, [initialQuantity]);

  // Handle quantity change
  const handleChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    // Notify parent about the quantity change
    onQuantityChange(newQuantity);
  };

  // Calculate total price based on quantity
  const totalPrice = quantity * price;

  // Check if quantity has been changed from initial value
  const quantityChanged = quantity !== initialSet;

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <select
        className="h-10 w-40 flex justify-center items-center bg-slate-200 rounded"
        value={quantity}
        onChange={handleChange}
      >
        {/* Always display productQuantity as the first option */}
        <option className="text-center" value={productQuantity}>
          {productQuantity}
        </option>
        {/* Generate other options */}
        {options.map((option) => (
          <option className="text-center" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm">
        Subtotal for {quantity} item{quantity > 1 ? "s" : ""}:{" "}
        <span className="font-semibold">KES {Math.round(totalPrice)} </span>
        {quantityChanged && (
          <span className="text-gray-500 text-sm">(Not added to cart yet)</span>
        )}
      </span>
    </div>
  );
};

export default QuantityDropdown;
