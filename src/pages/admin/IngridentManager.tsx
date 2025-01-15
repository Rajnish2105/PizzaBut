import React, { useState } from "react";
import IngredientControl from "./IngredientControl";
import { toast } from "sonner";

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

  const handleSubmit = async () => {
    try {
      // Convert the state object into an array of updates
      const updates = Object.entries(updatedIngredients).map(
        ([_id, quantity]) => ({
          _id,
          quantity,
        })
      );

      const res = await fetch("http://localhost:3000/updateInventory", {
        method: "POST",
        credentials: "include", // Important for sending cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        throw new Error("Failed to update inventory");
      }

      const data = await res.json();
      toast.success(data.message, { closeButton: true });

      // Optional: Refresh the page to show updated quantities
      window.location.reload();
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Failed to update inventory", { closeButton: true });
    }
  };

  const renderIngredients = (ingredients: Ingredient[], title: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Update Inventory
        </button>
      </div>
      {renderIngredients(bases, "Pizza Bases")}
      {renderIngredients(sauces, "Sauces")}
      {renderIngredients(cheeses, "Cheeses")}
      {renderIngredients(veggies, "Vegetables")}
    </div>
  );
};

export default IngredientManager;
