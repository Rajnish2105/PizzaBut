import { redirect } from "react-router-dom";
import { toast } from "sonner";
import { config } from "./config";

export async function adminMiddleware() {
  try {
    // First check if user is authenticated
    const authRes = await fetch(`${config.API}/protected`, {
      credentials: "include",
    });
    const authData = await authRes.json();

    if (!authData.isAuthenticated) {
      toast.error("Please login first");
      throw redirect("/auth?signin");
    }

    // Then check if user is admin
    const whoamiRes = await fetch(`${config.API}/whoami`, {
      credentials: "include",
    });
    const userData = await whoamiRes.json();

    if (!userData.user?.role || userData.user.role !== "admin") {
      toast.error("Admin access required");
      throw redirect("/user/dashboard");
    }

    return null;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    toast.error("Access denied");
    throw redirect("/user/dashboard");
  }
}

export async function MiddleWare() {
  if (window.location.pathname === "/auth") {
    return null;
  }
  try {
    const response = await fetch(`${config.API}/protected`, {
      credentials: "include",
    });

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
