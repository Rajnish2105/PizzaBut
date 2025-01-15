import { useState, useEffect } from "react";
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

const ORDER_STATUSES = [
  {
    value: "preparing",
    label: "Preparing",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "on-the-way",
    label: "On the Way",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/getEveryOrder", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("http://localhost:3000/updateOrder", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      const data = await res.json();
      toast.success(data.message);
      // Fetch fresh data instead of page reload
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-600">
          Loading orders...
        </h2>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-600">
          No orders found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                <p className="text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">User ID: {order.userId}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  order.status === "preparing"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "on-the-way"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Base:</strong> {order.items.base.name}
              </p>
              <p>
                <strong>Sauce:</strong> {order.items.sauce.name}
              </p>
              <p>
                <strong>Cheese:</strong> {order.items.cheese.name}
              </p>
              <p>
                <strong>Veggies:</strong>{" "}
                {order.items.veggies.map((v) => v.name).join(", ")}
              </p>
            </div>

            <div className="mt-4 text-right">
              <p className="text-lg font-semibold">
                Total: ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Admin-specific status update buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Update Order Status:</p>
              <div className="flex gap-2">
                {ORDER_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusUpdate(order._id, status.value)}
                    disabled={order.status === status.value}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${
                        order.status === status.value
                          ? status.color
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
