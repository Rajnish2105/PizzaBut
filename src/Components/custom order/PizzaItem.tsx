import React from "react";

interface PizzaItemProps {
  _id: string; // Changed from number to string
  name: string;
  price: number;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  type: "radio" | "checkbox";
}

const PizzaItem: React.FC<PizzaItemProps> = ({
  _id, // Changed from id to _id
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
        value={_id}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      <div className={`relative p-2 ${isSelected ? "scale-105" : ""}`}>
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="transition-all duration-300 ease-in-out
          drop-shadow-[0_0px_5px_rgba(168,85,247,0.2)]
          hover:drop-shadow-[0_10px_25px_rgba(168,85,247,0.6)]
          hover:scale-110 w-28 h-28 object-contain"
        />
        {isSelected && (
          <div className="absolute inset-0 border-2 border-purple-500 rounded-full"></div>
        )}
      </div>
      <span className="mt-2 text-center font-medium text-gray-300 text-sm">
        {name}
      </span>
      <span className="text-xs text-gray-400">₹{price.toFixed(2)}</span>
    </label>
  );
};

export default PizzaItem;
