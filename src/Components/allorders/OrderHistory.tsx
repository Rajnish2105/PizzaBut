import { useLoaderData } from "react-router-dom";

interface LoaderData {
  orders: Order[];
}

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
  const { orders } = useLoaderData() as LoaderData;

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-600">No orders found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                <p className="text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${order.status === "preparing" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "on-the-way" ? "bg-blue-100 text-blue-800" :
                  order.status === "delivered" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-800"}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <p><strong>Base:</strong> {order.items.base.name}</p>
              <p><strong>Sauce:</strong> {order.items.sauce.name}</p>
              <p><strong>Cheese:</strong> {order.items.cheese.name}</p>
              <p><strong>Veggies:</strong> {order.items.veggies.map(v => v.name).join(", ")}</p>
            </div>

            <div className="mt-4 text-right">
              <p className="text-lg font-semibold">
                Total: ₹{order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
