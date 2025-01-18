import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className={`flex-1 ml-16 overflow-y-auto bg-gray-50`}>
        <Outlet />
      </main>
    </div>
  );
}
