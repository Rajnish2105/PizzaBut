import React from "react";

interface PizzaItemProps {
  _id: string;  // Changed from number to string
  name: string;
  price: number;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  type: "radio" | "checkbox";
}

const PizzaItem: React.FC<PizzaItemProps> = ({
  _id,  // Changed from id to _id
  name,
  price,
  image,
  isSelected,
  onSelect,
  type,
}) => {
  return (
    <label className="flex flex-col items-center cursor-pointer transition-all duration-300">
      <input
        type={type}
        name={`pizza-item-${type}`}
        value={_id}  // Changed from id to _id
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      <div className={`relative p-2 ${isSelected ? "scale-110" : ""}`}>
        <img
          src={image}
          alt={name}
          className="transition-all duration-300 ease-in-out
          drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]
          hover:drop-shadow-[0_15px_15px_rgba(0,0,0,0.35)]
          hover:scale-110 w-32 h-32 object-contain"
        />
        {isSelected && (
          <div className="absolute inset-0 border-4 border-red-500 rounded-full"></div>
        )}
      </div>
      <span className="mt-3 text-center font-medium text-gray-700">{name}</span>
      <span className="text-sm text-gray-600">₹{price.toFixed(2)}</span>
    </label>
  );
};

export default PizzaItem;
