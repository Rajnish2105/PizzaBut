import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className={`flex-1 ml-16 overflow-y-auto bg-gray-50`}>
        <Outlet />
      </main>
    </div>
  );
}
