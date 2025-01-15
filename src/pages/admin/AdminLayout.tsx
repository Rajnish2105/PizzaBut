import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav />
      <main className="flex-1 ml-16">  {/* ml-16 matches the closed nav width */}
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
