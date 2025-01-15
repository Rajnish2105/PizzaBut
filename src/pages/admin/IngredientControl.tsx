import React, { useState } from "react";

interface IngredientControlProps {
  _id: string;
  name: string;
  image: string;
  initialQuantity: number;
  unit: string;
  price: number;
  onQuantityChange: (_id: string, quantity: number) => void;
}

const IngredientControl: React.FC<IngredientControlProps> = ({
  _id,
  name,
  image,
  initialQuantity,
  unit,
  price,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange(_id, newQuantity);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="aspect-square mb-4 overflow-hidden rounded-lg">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{name}</h3>
          <span className="text-sm text-gray-600">₹{price}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            -
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            +
          </button>
        </div>
        <div className="text-sm text-gray-600 text-right">
          {quantity} {unit}
        </div>
      </div>
    </div>
  );
};

export default IngredientControl;
