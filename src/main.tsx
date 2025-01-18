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
import OrderHistory from "./pages/user/OrderHistoryPage.tsx";
import VerifyOtp from "./pages/VerifyOtp.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import MiniInvintory, {
  InventoryLoader,
} from "./pages/admin/MiniInventory.tsx";
import { CustomPizzaLoader } from "./Components/custom order/OrderCustomPizza.tsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.tsx"; // Removed adminOrdersLoader import
import AdminLayout from "./pages/admin/AdminLayout.tsx"; // Added AdminLayout import
import LandingPage from "./pages/LandingPage.tsx";

const BACKEND_API = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", loader: MiddleWare, element: <LandingPage /> },
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
          { path: "user/dashboard", element: <DashboardPage /> },
          {
            path: "user/custom-order",
            loader: CustomPizzaLoader,
            element: <OrderCustomPizza />,
          },
          {
            path: "user/orderhistory",
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
  try {
    const response = await fetch(`${BACKEND_API}/protected`, {
      credentials: "include",
    });
    const data = await response.json();

    if (data.isAuthenticated) {
      throw redirect("/user/dashboard");
    }

    return null;
  } catch (error) {
    console.log("You are logged in!");
    throw redirect("/user/dashboard");
  }
}

async function MiddleWare() {
  if (window.location.pathname === "/auth") {
    return null;
  }
  try {
    const response = await fetch(`${BACKEND_API}/protected`, {
      credentials: "include",
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
