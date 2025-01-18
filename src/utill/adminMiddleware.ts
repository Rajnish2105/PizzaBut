import { redirect } from "react-router-dom";
import { toast } from "sonner";

const BACKEND_API = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

export async function adminMiddleware() {
  try {
    // First check if user is authenticated
    const authRes = await fetch(`${BACKEND_API}/protected`, {
      credentials: "include",
    });
    const authData = await authRes.json();

    if (!authData.isAuthenticated) {
      toast.error("Please login first");
      throw redirect("/auth?signin");
    }

    // Then check if user is admin
    const whoamiRes = await fetch(`${BACKEND_API}/whoami`, {
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
