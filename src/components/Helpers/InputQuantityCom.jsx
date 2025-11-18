import { useState } from "react";

export default function InputQuantityCom({ value = 1, onChange, min = 1, max = 99 }) {
  const [internalQuantity, setInternalQuantity] = useState(value);

  // Use controlled value if provided, otherwise use internal state
  const quantity = onChange ? value : internalQuantity;

  const increment = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= max) {
      if (onChange) {
        onChange(newQuantity);
      } else {
        setInternalQuantity(newQuantity);
      }
    }
  };

  const decrement = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= min) {
      if (onChange) {
        onChange(newQuantity);
      } else {
        setInternalQuantity(newQuantity);
      }
    }
  };

  return (
    <div className="w-[120px] h-[40px] px-[26px] flex items-center border border-qgray-border">
      <div className="flex justify-between items-center w-full">
        <button
          onClick={decrement}
          type="button"
          className="text-base text-qgray disabled:opacity-50"
          disabled={quantity <= min}
        >
          -
        </button>
        <span className="text-qblack">{quantity}</span>
        <button
          onClick={increment}
          type="button"
          className="text-base text-qgray disabled:opacity-50"
          disabled={quantity >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
