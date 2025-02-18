import { useState, useEffect } from "react";
import PizzaCard from "./PizzaCard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_ID;

interface PizzaIngredients {
  base: { _id: string; name: string; price: number };
  sauce: { _id: string; name: string; price: number };
  cheese: { _id: string; name: string; price: number };
  veggies: Array<{ _id: string; name: string; price: number }>;
}

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: PizzaIngredients;
  quantity: number;
}

const pizzaVarieties: Pizza[] = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Simple and delicious traditional pizza",
    price: 399,
    quantity: 100,
    image:
      "https://images.unsplash.com/photo-1615192606904-9cee34bf93c4?q=80&w=2070&auto=format&fit=crop",
    ingredients: {
      base: {
        _id: "507f1f77bcf86cd799439011",
        name: "Thin Crust",
        price: 118.99,
      },
      sauce: { _id: "507f1f77bcf86cd799439012", name: "Tomato", price: 111.99 },
      cheese: {
        _id: "507f1f77bcf86cd799439013",
        name: "Mozzarella",
        price: 112.99,
      },
      veggies: [
        { _id: "507f1f77bcf86cd799439014", name: "Tomatoes", price: 111.29 },
        { _id: "507f1f77bcf86cd799439015", name: "Onions", price: 110.99 },
      ],
    },
  },
  {
    id: 2,
    name: "Garden Fresh Delight",
    description: "Loaded with fresh vegetables",
    price: 449,
    quantity: 50,
    image:
      "https://plus.unsplash.com/premium_photo-1723507360261-b6d551c83e69?q=80&w=2059",
    ingredients: {
      base: {
        _id: "507f1f77bcf86cd799439016",
        name: "Whole Wheat",
        price: 110.99,
      },
      sauce: { _id: "507f1f77bcf86cd799439017", name: "Pesto", price: 112.99 },
      cheese: { _id: "507f1f77bcf86cd799439018", name: "Feta", price: 112.99 },
      veggies: [
        { _id: "507f1f77bcf86cd799439019", name: "Mushrooms", price: 111.49 },
        {
          _id: "507f1f77bcf86cd79943901a",
          name: "Bell Peppers",
          price: 111.29,
        },
        { _id: "507f1f77bcf86cd79943901b", name: "Onions", price: 110.99 },
        { _id: "507f1f77bcf86cd79943901c", name: "Olives", price: 111.99 },
      ],
    },
  },
  {
    id: 3,
    name: "BBQ Feast",
    description: "Tangy BBQ sauce with premium toppings",
    price: 499,
    quantity: 10,
    image:
      "https://images.unsplash.com/photo-1734769484424-36b99dd84818?q=80&w=2070",
    ingredients: {
      base: {
        _id: "507f1f77bcf86cd79943901d",
        name: "Thick Crust",
        price: 119.99,
      },
      sauce: { _id: "507f1f77bcf86cd79943901e", name: "BBQ", price: 112.49 },
      cheese: {
        _id: "507f1f77bcf86cd79943901f",
        name: "Cheddar",
        price: 112.49,
      },
      veggies: [
        {
          _id: "507f1f77bcf86cd799439020",
          name: "Bell Peppers",
          price: 111.29,
        },
        { _id: "507f1f77bcf86cd799439021", name: "Onions", price: 110.99 },
        { _id: "507f1f77bcf86cd799439022", name: "Mushrooms", price: 111.49 },
      ],
    },
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  useEffect(() => {
    async function get() {
      try {
        const res = await fetch(
          "https://pizzabut-be.rajnishchahar.tech/whoami",
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error);
        }
        const { user } = await res.json();
        if (!user.email || !user.name) {
          throw new Error("No user");
        }
        setUserInfo({ name: user.name, email: user.email });
      } catch (err: any) {
        toast.error(err.message);
        return;
      }
    }
    get();
  }, []);

  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  const handleOrder = async (id: number) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load");
      return;
    }
    const pizza = pizzaVarieties.find((p) => p.id === id);
    if (pizza) {
      try {
        // Step 1: Create payment order
        const orderResponse = await fetch(
          "https://pizzabut-be.rajnishchahar.tech/create-payment",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: pizza.price }),
          }
        );

        if (!orderResponse.ok) {
          const { error } = await orderResponse.json();
          throw new Error(error);
        }
        const { data } = await orderResponse.json();

        // Step 2: Initialize Razorpay
        const options = {
          key: RAZORPAY_KEY, // Your Razorpay key
          amount: data.amount,
          currency: data.currency,
          name: "PizzaBut",
          description: `Order for ${pizza.name}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            try {
              // Step 3: Verify payment
              const verifyResponse = await fetch(
                "https://pizzabut-be.rajnishchahar.tech/verify-payment",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                }
              );

              if (!verifyResponse.ok) {
                const { error } = await verifyResponse.json();
                throw new Error(error);
              }
              const { data } = await verifyResponse.json();

              // Step 4: Create final order
              const finalOrderResponse = await fetch(
                "https://pizzabut-be.rajnishchahar.tech/order",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    items: pizza.ingredients,
                    totalPrice: pizza.price,
                    orderId: data.orderId,
                    paymentId: data.paymentId,
                  }),
                }
              );

              const finalOrderData = await finalOrderResponse.json();
              if (finalOrderData.error) {
                throw new Error(finalOrderData.error);
              }
              toast.success(finalOrderData.message);
              navigate("/user/orderhistory", { replace: true });
            } catch (error) {
              toast.error("Failed to process payment");
              console.error("Payment error:", error);
            }
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
          },
          theme: {
            color: "#686CFD",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        toast.error("Failed to create order");
        console.error("Order error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          PIZZABUT
        </h1>
        <div className="space-y-12">
          {pizzaVarieties.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} onOrder={handleOrder} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
