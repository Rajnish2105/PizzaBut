import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLoaderData, useNavigate } from "react-router-dom";
import { handlePayment } from "../../utill/payment";
import PizzaSection from "./PizzaSection";

const BACKEND_API = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

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
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_API}/whoami`, {
          credentials: "include",
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }

        const data = await response.json();
        setUserData({
          name: data.user.name,
          email: data.user.email,
        });
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        toast.error(error.message, { closeButton: true });
      }
    };
    fetchUserData();
  }, []);

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
    // Return as integer value
    return Math.round(total);
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
        amount: calculateTotalPrice(),
        userDetails:
          userData.name.length > 0 && userData.email.length > 0
            ? userData
            : undefined,
        onSuccess: async (paymentResponse) => {
          try {
            const response = await fetch(`${BACKEND_API}/order`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: {
                  base: bases.find((b) => b._id === selectedBase),
                  sauce: sauces.find((s) => s._id === selectedSauce),
                  cheese: cheeses.find((c) => c._id === selectedCheese),
                  veggies: veggies.filter((v) =>
                    selectedVeggies.includes(v._id)
                  ),
                },
                totalPrice: calculateTotalPrice(),
                orderId: paymentResponse.razorpay_order_id,
                paymentId: paymentResponse.razorpay_payment_id,
              }),
            });

            if (!response.ok) {
              const { error } = await response.json();
              throw new Error(error);
            }
            const data = await response.json();
            toast.success(data.message);
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
    <div className="w-full px-4 py-8 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Create Your Custom Pizza
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12 w-full p-5">
        <PizzaSection
          title="Pick Your Crust"
          items={bases}
          selectedItems={selectedBase ? [selectedBase] : []}
          onSelect={(id) => setSelectedBase(id)}
        />

        <PizzaSection
          title="Drizzle Your Sauce"
          items={sauces}
          selectedItems={selectedSauce ? [selectedSauce] : []}
          onSelect={(id) => setSelectedSauce(id)}
        />

        <PizzaSection
          title="Cheese It Up"
          items={cheeses}
          selectedItems={selectedCheese ? [selectedCheese] : []}
          onSelect={(id) => setSelectedCheese(id)}
        />

        <PizzaSection
          title="Layer Your Veggies"
          items={veggies}
          selectedItems={selectedVeggies}
          onSelect={handleVeggieSelection}
          multiSelect
        />

        <div className="sticky bottom-8 right-8 flex flex-col items-end gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-purple-500/50 font-medium text-lg disabled:opacity-50"
          >
            {isSubmitting
              ? "Placing Order..."
              : `Place Order (₹${calculateTotalPrice().toFixed(2)})`}
          </button>
        </div>
      </form>
    </div>
  );
};

// Add loader function
export async function CustomPizzaLoader() {
  try {
    const res = await fetch(`${BACKEND_API}/getStore`, {
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
