import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { redirect } from "react-router-dom";

import Layout from "./Layout.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";
import DashboardPage from "./pages/user/DashboardPage.tsx";
import MainLayout from "./pages/user/MainLayout.tsx";
import OrderCustomPizza from "./pages/user/OrderCustomPizzaPage.tsx";
import OrderHistory, { getAllOrders } from "./pages/user/OrderHistoryPage.tsx";
import VerifyOtp from "./pages/VerifyOtp.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import MiniInvintory, {
  InventoryLoader,
} from "./pages/admin/MiniInventory.tsx";
import { CustomPizzaLoader } from "./Components/custom order/OrderCustomPizza.tsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.tsx"; // Removed adminOrdersLoader import
import AdminLayout from "./pages/admin/AdminLayout.tsx"; // Added AdminLayout import

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/auth",
        element: <SignupPage />,
        loader: authLoader,
      },
      { path: "/verifyotp", element: <VerifyOtp /> },
      { path: "/forgotpass", element: <ForgotPassword /> },
      {
        path: "/",
        element: <MainLayout />,
        loader: MiddleWare, // Move middleware here to protect all user routes
        children: [
          { path: "/", element: <DashboardPage /> }, // Add default route
          { path: "user/dashboard", element: <DashboardPage /> },
          {
            path: "user/custom-order",
            loader: CustomPizzaLoader,
            element: <OrderCustomPizza />,
          },
          {
            path: "user/orderhistory",
            loader: getAllOrders,
            element: <OrderHistory />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />, // Use AdminLayout here
        children: [
          {
            path: "inventory",
            loader: InventoryLoader,
            element: <MiniInvintory />,
          },
          {
            path: "handleorders",
            element: <AdminOrdersPage />, // Remove the loader
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Separate loader for auth route
async function authLoader() {
  const response = await fetch("http://localhost:3000/protected", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (data.isAuthenticated) {
    throw redirect("/");
  }
  return null;
}

async function MiddleWare() {
  // Don't check auth for auth route
  if (window.location.pathname === "/auth") {
    return null;
  }

  try {
    const response = await fetch("http://localhost:3000/protected", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data.isAuthenticated) {
      throw redirect("/auth?signin");
    }

    return data;
  } catch (error) {
    console.error("Middleware error:", error);
    throw redirect("/auth?signin");
  }
}
