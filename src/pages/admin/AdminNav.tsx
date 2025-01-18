import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, ClipboardList, Menu, X, LogOut } from "lucide-react";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("https://pizzabut-be.rajnishchahar.tech/logout", {
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
      className={`bg-gray-800 text-gray-100 h-screen fixed ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 ease-in-out flex flex-col z-50 shadow-2xl`}
    >
      <div className="p-4 flex flex-col items-center h-full">
        <div className="flex items-center justify-between w-full mb-8">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl hover:bg-gray-700 p-2 rounded-xl transition-all duration-300 w-10 h-10 flex items-center justify-center hover:text-purple-400"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {isOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              PIZZABUT
            </h1>
          )}
        </div>
        <ul className="space-y-4 w-full">
          <li>
            <Link
              to="/admin/inventory"
              className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300 group"
            >
              <Boxes
                size={20}
                className="group-hover:text-purple-400 transition-colors duration-300"
              />
              <span
                className={`${
                  isOpen ? "block" : "hidden"
                } group-hover:text-purple-400 transition-colors duration-300`}
              >
                Manage Inventory
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/handleorders"
              className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300 group"
            >
              <ClipboardList
                size={20}
                className="group-hover:text-purple-400 transition-colors duration-300"
              />
              <span
                className={`${
                  isOpen ? "block" : "hidden"
                } group-hover:text-purple-400 transition-colors duration-300`}
              >
                Manage Orders
              </span>
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300 text-left w-full group"
        >
          <LogOut
            size={20}
            className="group-hover:text-purple-400 transition-colors duration-300"
          />
          <span
            className={`${
              isOpen ? "block" : "hidden"
            } group-hover:text-purple-400 transition-colors duration-300`}
          >
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;
