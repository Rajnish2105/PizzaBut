import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: {
    base: { name: string };
    sauce: { name: string };
    cheese: { name: string };
    veggies: Array<{ name: string }>;
  };
}

interface PizzaCardProps {
  pizza: Pizza;
  onOrder: (id: number) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onOrder }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full mx-auto transition-all duration-300 ease-in-out hover:shadow-purple-500/20 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={pizza.image || "/placeholder.svg"}
            alt={pizza.name}
            className={`w-full h-full object-cover transition-transform duration-300 ease-in-out ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
        </div>
        <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-100">
              {pizza.name}
            </h2>
            <p className="text-gray-300 mb-4 text-lg">{pizza.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
              <p>
                <span className="font-semibold text-gray-200">Base:</span>{" "}
                {pizza.ingredients.base.name}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Sauce:</span>{" "}
                {pizza.ingredients.sauce.name}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Cheese:</span>{" "}
                {pizza.ingredients.cheese.name}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Veggies:</span>{" "}
                {pizza.ingredients.veggies.map((v) => v.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold text-purple-400">₹{pizza.price}</p>
            <button
              onClick={() => onOrder(pizza.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full flex items-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              <span>Order Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
