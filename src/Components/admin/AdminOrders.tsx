import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, Loader2 } from "lucide-react";

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
  userId: {
    name: string;
  };
  items: OrderItem;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const ORDER_STATUSES = [
  {
    value: "preparing",
    label: "Preparing",
    color: "bg-yellow-900 text-yellow-200",
    hoverColor: "hover:bg-yellow-800",
  },
  {
    value: "on-the-way",
    label: "On the Way",
    color: "bg-blue-900 text-blue-200",
    hoverColor: "hover:bg-blue-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-900 text-green-200",
    hoverColor: "hover:bg-green-800",
  },
];

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://pizzabut-be.rajnishchahar.tech/getEveryOrder", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const { error, isAdmin } = await res.json();
        // console.log("isadmin", isAdmin, error);
        if (!isAdmin) {
          return navigate("/user/dashboard");
        }
        throw new Error(error);
      }
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error instanceof Error ? error.message : "Server error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("https://pizzabut-be.rajnishchahar.tech/updateOrder", {
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
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          All Orders
        </h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:shadow-purple-500/20 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    Order ID: <span className="text-gray-200">{order._id}</span>
                  </h3>
                  <p className="text-gray-400">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 italic">
                    User: {order.userId.name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0
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

              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">
                  Update Order Status:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        handleStatusUpdate(order._id, status.value)
                      }
                      disabled={order.status === status.value}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center
          ${
            order.status === status.value
              ? status.color
              : `bg-gray-700 text-gray-300 ${status.hoverColor}`
          }`}
                    >
                      {status.label}
                      {order.status !== status.value && (
                        <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
