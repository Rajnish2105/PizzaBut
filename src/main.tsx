import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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
import NotFound from "./pages/NotFound.tsx";

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
        path: "user",
        element: <MainLayout />,
        loader: MiddleWare, // Move middleware here to protect all user routes
        children: [
          { path: "", element: <Navigate to="user/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          {
            path: "custom-order",
            loader: CustomPizzaLoader,
            element: <OrderCustomPizza />,
          },
          {
            path: "orderhistory",
            element: <OrderHistory />,
          },
          { path: "*", element: <NotFound /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />, // Use AdminLayout here
        children: [
          { path: "", element: <Navigate to="inventory" replace /> },
          {
            path: "inventory",
            loader: InventoryLoader,
            element: <MiniInvintory />,
          },
          {
            path: "handleorders",
            element: <AdminOrdersPage />, // Remove the loader
          },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "*", element: <NotFound /> },
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
    const response = await fetch(
      "https://pizzabut-be.rajnishchahar.tech/protected",
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (data.isAuthenticated) {
      throw new Error("You are logged in already!");
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
    const response = await fetch(
      "https://pizzabut-be.rajnishchahar.tech/protected",
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!data.isAuthenticated) {
      throw new Error("redirect me!");
    }

    return data;
  } catch (error) {
    console.error("You are not logged in!");
    throw redirect("/auth?signin");
  }
}
