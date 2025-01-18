const BACKEND_API = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_ID;

interface PaymentHandlerOptions {
  amount: number;
  userDetails?: {
    name: string;
    email: string;
  };
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const handlePayment = async ({
  amount, // amount should be in rupees (e.g. 399)
  userDetails = { name: "Guest", email: "" },
  onSuccess,
  onError,
}: PaymentHandlerOptions) => {
  try {
    // Create payment order
    const response = await fetch(`${BACKEND_API}/create-payment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // Send amount in rupees
      }),
    });

    const { data, error } = await response.json();
    if (error) throw new Error(error);

    // Initialize Razorpay
    const options = {
      key: RAZORPAY_KEY, // Your razorpay key
      amount: data.amount, // Razorpay will receive amount in paise from backend
      currency: data.currency,
      order_id: data.orderId,
      name: "PizzaBut",
      description: "Custom Pizza Order",
      handler: async function (response: any) {
        try {
          // Verify payment
          const verifyResponse = await fetch(`${BACKEND_API}/verify-payment`, {
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
          });

          const verification = await verifyResponse.json();
          if (verification.error) throw new Error(verification.error);

          onSuccess(response);
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
      },
      theme: {
        color: "#dc2626",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    onError(error);
  }
};
