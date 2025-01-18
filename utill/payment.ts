// Practice code

// import { toast } from "sonner";

// const BACKEND_API = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

// interface PaymentHandlerParams {
//   amount: number;
//   onSuccess?: (response: any) => void;
//   onError?: (error: any) => void;
// }

// export async function handlePayment({
//   amount,
//   onSuccess,
//   onError,
// }: PaymentHandlerParams) {
//   try {
//     const orderResponse = await fetch(`${BACKEND_API}/create-payment`, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ amount }),
//     });

//     if (!orderResponse.ok) {
//       throw new Error("Failed to create payment order");
//     }

//     const orderData = await orderResponse.json();

//     return new Promise((resolve, reject) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       document.body.appendChild(script);

//       script.onload = () => {
//         const options = {
//           key: "rzp_test_tetpmUe834pauw",
//           amount: orderData.amount,
//           currency: orderData.currency,
//           name: "PizzaBut",
//           description: "Pizza Order Payment",
//           order_id: orderData.orderId,
//           handler: async function (response: any) {
//             try {
//               const verifyResponse = await fetch(
//                 `${BACKEND_API}/verify-payment`,
//                 {
//                   method: "POST",
//                   credentials: "include",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     razorpay_order_id: response.razorpay_order_id,
//                     razorpay_payment_id: response.razorpay_payment_id,
//                     razorpay_signature: response.razorpay_signature,
//                   }),
//                 }
//               );

//               if (!verifyResponse.ok) {
//                 throw new Error("Payment verification failed");
//               }

//               toast.success("Payment successful!");
//               onSuccess?.(response); // Pass payment response to onSuccess
//               resolve(response);
//             } catch (error) {
//               toast.error("Payment verification failed");
//               onError?.(error);
//               reject(error);
//             }
//           },
//           modal: {
//             ondismiss: function () {
//               toast.error("Payment cancelled");
//               onError?.(new Error("Payment cancelled"));
//               reject(new Error("Payment cancelled"));
//             },
//           },
//           prefill: {
//             name: "Customer Name",
//             email: "customer@example.com",
//           },
//           theme: {
//             color: "#dc2626",
//           },
//         };

//         const paymentObject = new (window as any).Razorpay(options);
//         paymentObject.open();
//       };

//       script.onerror = () => {
//         const error = new Error("Failed to load payment gateway");
//         toast.error("Failed to load payment gateway");
//         onError?.(error);
//         reject(error);
//       };
//     });
//   } catch (error) {
//     toast.error("Payment initialization failed");
//     onError?.(error);
//     throw error;
//   }
// }
