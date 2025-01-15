import { useState } from "react";
import { Link } from "react-router-dom";
import { Pizza, History, Menu, X, LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        window.location.href = "/auth?signin";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`bg-red-600 text-white h-screen fixed ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 flex flex-col items-center h-full">
        <div className="flex items-center justify-between w-full mb-8">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl hover:bg-red-700 p-2 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {isOpen && <h1 className="text-xl font-bold">PIZZABUT</h1>}
        </div>
        <ul className="space-y-4 w-full">
          <li>
            <Link
              to="/user/dashboard"
              className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded transition-colors"
            >
              <LayoutDashboard size={20} />
              <span className={isOpen ? "block" : "hidden"}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/user/custom-order"
              className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded transition-colors"
            >
              <Pizza size={20} />
              <span className={isOpen ? "block" : "hidden"}>
                Order Custom Pizza
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/user/orderhistory"
              className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded transition-colors"
            >
              <History size={20} />
              <span className={isOpen ? "block" : "hidden"}>Order History</span>
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-2 hover:bg-red-700 p-2 rounded transition-colors text-left w-full"
        >
          <LogOut size={20} />
          <span className={isOpen ? "block" : "hidden"}>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
