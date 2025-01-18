import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import IngredientManager from "./IngridentManager";
import type { LoaderFunction } from "react-router-dom";

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  type: "base" | "sauce" | "cheese" | "veggie";
}

interface LoaderData {
  data: InventoryItem[];
}

export default function MiniInventory() {
  const { data } = useLoaderData() as LoaderData;

  // Categorize items by type
  const bases = data.filter((item) => item.type === "base");
  const sauces = data.filter((item) => item.type === "sauce");
  const cheeses = data.filter((item) => item.type === "cheese");
  const veggies = data.filter((item) => item.type === "veggie");

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900">
        <h2 className="text-3xl font-semibold text-gray-400">Store is Empty</h2>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="w-full max-w-full mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Mini Inventory
          </h1>
        </div>
        <IngredientManager
          bases={bases}
          sauces={sauces}
          cheeses={cheeses}
          veggies={veggies}
        />
      </div>
    </div>
  );
}

export const InventoryLoader: LoaderFunction = async () => {
  try {
    const res = await fetch("https://pizzabut-be.rajnishchahar.tech/getStore", {
      credentials: "include",
    });

    console.log("getstore", res);

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error);
    }
    const { data, isAdmin } = await res.json();
    if (!isAdmin) {
      return redirect("/user/dashboard");
    }

    return { data };
  } catch (err) {
    console.error(err);
    toast.error("Failed to load inventory data", { closeButton: true });
    return null; // Return empty data structure on error
  }
};
