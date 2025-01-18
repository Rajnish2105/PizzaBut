import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderItem {
  base: {
    name: string;
    price: number;
  };
  sauce: {
    name: string;
    price: number;
  };
  cheese: {
    name: string;
    price: number;
  };
  veggies: Array<{
    name: string;
    price: number;
  }>;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    async function getAllOrders() {
      try {
        const response = await fetch(
          "https://pizzabut-be.rajnishchahar.tech/allorders",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }

        const data = await response.json();
        if (!data.orders) {
          throw new Error("No Orders");
        }

        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Server Error", { closeButton: true });
      }
    }
    getAllOrders();
  }, []);

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900">
        <h2 className="text-3xl font-semibold text-gray-400">
          No orders found
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Your Order History
        </h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:shadow-purple-500/20 transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200">
                    Order ID: {order._id}
                  </h3>
                  <p className="text-gray-400">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    order.status === "preparing"
                      ? "bg-yellow-900 text-yellow-200"
                      : order.status === "on-the-way"
                      ? "bg-blue-900 text-blue-200"
                      : order.status === "delivered"
                      ? "bg-green-900 text-green-200"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 text-gray-300">
                <p>
                  <strong className="text-purple-400">Base:</strong>{" "}
                  {order.items.base.name}
                </p>
                <p>
                  <strong className="text-purple-400">Sauce:</strong>{" "}
                  {order.items.sauce.name}
                </p>
                <p>
                  <strong className="text-purple-400">Cheese:</strong>{" "}
                  {order.items.cheese.name}
                </p>
                <p>
                  <strong className="text-purple-400">Veggies:</strong>{" "}
                  {order.items.veggies.map((v) => v.name).join(", ")}
                </p>
              </div>

              <div className="mt-4 text-right">
                <p className="text-lg font-semibold text-purple-400">
                  Total: ₹{order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
