import React, { useState } from "react";
import { toast } from "sonner";
import { useLoaderData, useNavigate } from "react-router-dom";
import { handlePayment } from "../../../utill/payment";
import PizzaSection from "./PizzaSection";

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

const OrderCustomPizza: React.FC = () => {
  const { data } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  // Filter items by type
  const bases = data.filter((item) => item.type === "base");
  const sauces = data.filter((item) => item.type === "sauce");
  const cheeses = data.filter((item) => item.type === "cheese");
  const veggies = data.filter((item) => item.type === "veggie");

  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);
  const [selectedCheese, setSelectedCheese] = useState<string | null>(null);
  const [selectedVeggies, setSelectedVeggies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVeggieSelection = (id: string) => {
    setSelectedVeggies((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedBase)
      total += bases.find((b) => b._id === selectedBase)?.price || 0;
    if (selectedSauce)
      total += sauces.find((s) => s._id === selectedSauce)?.price || 0;
    if (selectedCheese)
      total += cheeses.find((c) => c._id === selectedCheese)?.price || 0;
    selectedVeggies.forEach((veggieId) => {
      total += veggies.find((v) => v._id === veggieId)?.price || 0;
    });
    return total.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedBase ||
      !selectedSauce ||
      !selectedCheese ||
      selectedVeggies.length === 0
    ) {
      toast.error("Please select all required items");
      return;
    }

    setIsSubmitting(true);
    try {
      await handlePayment({
        amount: parseFloat(calculateTotalPrice()),
        onSuccess: async (paymentResponse) => {
          try {
            const orderData = {
              items: {
                base: bases.find((b) => b._id === selectedBase),
                sauce: sauces.find((s) => s._id === selectedSauce),
                cheese: cheeses.find((c) => c._id === selectedCheese),
                veggies: veggies.filter((v) => selectedVeggies.includes(v._id)),
              },
              totalPrice: parseFloat(calculateTotalPrice()),
              orderId: paymentResponse.razorpay_order_id,
              paymentId: paymentResponse.razorpay_payment_id,
            };

            const response = await fetch("http://localhost:3000/order", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error("Failed to place order");

            const data = await response.json();

            toast.success("Order placed successfully!");
            navigate("/user/orderhistory", { replace: true });
          } catch (error) {
            console.error("Order creation error:", error);
            toast.error("Failed to create order");
          }
        },
        onError: (error) => {
          console.error("Payment error:", error);
          toast.error("Payment failed");
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Create Your Custom Pizza
      </h1>

      <form onSubmit={handleSubmit}>
        <PizzaSection
          title="Choose Your Base"
          items={bases}
          selectedItems={selectedBase ? [selectedBase] : []}
          onSelect={(id) => setSelectedBase(id)}
        />

        <PizzaSection
          title="Select Your Sauce"
          items={sauces}
          selectedItems={selectedSauce ? [selectedSauce] : []}
          onSelect={(id) => setSelectedSauce(id)}
        />

        <PizzaSection
          title="Choose Your Cheese"
          items={cheeses}
          selectedItems={selectedCheese ? [selectedCheese] : []}
          onSelect={(id) => setSelectedCheese(id)}
        />

        <PizzaSection
          title="Select Your Veggies"
          items={veggies}
          selectedItems={selectedVeggies}
          onSelect={handleVeggieSelection}
          multiSelect
        />

        <div className="sticky bottom-8 right-8 flex flex-col items-end gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-50"
          >
            {isSubmitting
              ? "Placing Order..."
              : `Place Order (₹${calculateTotalPrice()})`}
          </button>
        </div>
      </form>
    </div>
  );
};

// Add loader function
export async function CustomPizzaLoader() {
  try {
    const res = await fetch("http://localhost:3000/getStore", {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch inventory");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to load inventory data", { closeButton: true });
    return { data: [] };
  }
}

export default OrderCustomPizza;
