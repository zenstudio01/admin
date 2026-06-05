import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaTools,
  FaClipboardList,
} from "react-icons/fa";

import {
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Properties",
      path: "/properties",
      icon: <FaBuilding />,
    },
    {
      name: "Tenants",
      path: "/tenants",
      icon: <FaUsers />,
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: <FaTools />,
    },
    {
      name: "Workers",
      path: "/workers",
      icon: <FaClipboardList />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token"); 
    localStorage.removeItem("refresh_token"); 
    localStorage.removeItem("admin"); 
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-5">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-green-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}