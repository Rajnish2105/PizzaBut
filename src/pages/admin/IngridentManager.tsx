import React, { useState } from "react";
import IngredientControl from "./IngredientControl";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

const BACKEND_API = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

interface Ingredient {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  type: "base" | "sauce" | "cheese" | "veggie";
}

interface IngredientManagerProps {
  bases: Ingredient[];
  sauces: Ingredient[];
  cheeses: Ingredient[];
  veggies: Ingredient[];
}

const IngredientManager: React.FC<IngredientManagerProps> = ({
  bases,
  sauces,
  cheeses,
  veggies,
}) => {
  const [updatedIngredients, setUpdatedIngredients] = useState<{
    [key: string]: number;
  }>({});

  const handleQuantityChange = (_id: string, quantity: number) => {
    setUpdatedIngredients((prev) => ({ ...prev, [_id]: quantity }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Convert the state object into an array of updates
      const updates = Object.entries(updatedIngredients).map(
        ([_id, quantity]) => ({
          _id,
          quantity,
        })
      );

      const res = await fetch(`${BACKEND_API}/updateInventory`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const data = await res.json();
      toast.success(data.message, { closeButton: true });

      // Optional: Refresh the page to show updated quantities
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update inventory",
        { closeButton: true }
      );
    }
  };

  const renderIngredients = (ingredients: Ingredient[], title: string) => (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-purple-500">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ingredients.map((ingredient) => (
          <IngredientControl
            key={ingredient._id}
            _id={ingredient._id}
            name={ingredient.name}
            image={ingredient.image}
            initialQuantity={ingredient.quantity}
            unit={ingredient.unit}
            price={ingredient.price}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-end mb-6">
          <button
            type="submit"
            className="bg-purple-600/90 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <span>Update Inventory</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
      {renderIngredients(bases, "Pizza Bases")}
      {renderIngredients(sauces, "Sauces")}
      {renderIngredients(cheeses, "Cheeses")}
      {renderIngredients(veggies, "Vegetables")}
    </div>
  );
};

export default IngredientManager;
