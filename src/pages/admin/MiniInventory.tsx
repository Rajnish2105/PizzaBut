import { useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import IngredientManager from "./IngridentManager";

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

  return (
    <div className="min-h-screen bg-gray-100">
      <IngredientManager
        bases={bases}
        sauces={sauces}
        cheeses={cheeses}
        veggies={veggies}
      />
    </div>
  );
}

export async function InventoryLoader() {
  try {
    const res = await fetch("http://localhost:3000/getStore", {
      credentials: "include", // Add this to send cookies
    });
    if (!res.ok) {
      throw new Error("Failed to fetch inventory");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to load inventory data", { closeButton: true });
    return { data: [] }; // Return empty data structure on error
  }
}
