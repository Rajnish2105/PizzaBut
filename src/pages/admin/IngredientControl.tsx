import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

interface IngredientControlProps {
  _id: string;
  name: string;
  image: string;
  initialQuantity: number;
  unit: string;
  price: number;
  onQuantityChange: (id: string, newQuantity: number) => void;
}

export default function IngredientControl({
  _id,
  name,
  image,
  initialQuantity,
  unit,
  price,
  onQuantityChange,
}: IngredientControlProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isGreen, setIsGreen] = useState(false);

  useEffect(() => {
    setIsGreen(false);
  }, []);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      onQuantityChange(_id, newQuantity);
      setIsGreen(true);
    }
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-800">
      <div className="relative h-32 overflow-hidden bg-gradient-to-b from-gray-900/80 to-gray-800/80">
        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-contain p-2 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]"
        />
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-100">{name}</h3>
          <p className="text-xs text-purple-400">
            ₹{price}/{unit}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="bg-gray-700/50 hover:bg-gray-700 text-white rounded-md p-1 transition-colors duration-200"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className={`text-sm font-medium ${
                isGreen ? "text-green-500" : "text-gray-100"
              } w-8 text-center`}
            >
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="bg-gray-700/50 hover:bg-gray-700 text-white rounded-md p-1 transition-colors duration-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-1">
            {[10, 20, 50].map((increment) => (
              <button
                key={increment}
                onClick={() => handleQuantityChange(quantity + increment)}
                className="bg-gray-700/50 hover:bg-gray-700 text-xs text-gray-300 px-1.5 py-0.5 rounded transition-colors duration-200"
              >
                +{increment}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
