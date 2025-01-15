import { toast } from "sonner";
import OrderHistory from "../../Components/allorders/OrderHistory";

export default function OrderHistoryPage() {
  return <OrderHistory />;
}

export async function getAllOrders() {
  try {
    const response = await fetch("http://localhost:3000/allorders", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    if (!data.orders) {
      toast.error("No orders data received", { closeButton: true });
      return { orders: [] };
    }

    return { orders: data.orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error("Server Error", { closeButton: true });
    return { orders: [] };
  }
}
