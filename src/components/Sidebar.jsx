import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaTools,
  FaClipboardList,
} from "react-icons/fa";

import {
  LogOut,
  Settings,
  Store,
  Package,
  BadgeCheck,
  UserCheck,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  const role = user?.role;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
      roles: ["property manager", "landlord", "TENANT", "SERVICE_PROVIDER"],
    },
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
      roles: ["admin"],
    },
    {
      name: "Users",
      path: "/user-management",
      icon: <FaUsers />,
      roles: ["admin"],
    },
    {
      name: "Properties",
      path: "/properties",
      icon: <FaBuilding />,
      roles: ["admin", "property manager", "landlord"],
    },
    {
      name: "Tenants",
      path: "/tenants",
      icon: <FaUsers />,
      roles: ["property manager", "landlord"],
    },
    {
      name: "Landlords",
      path: "/landlords",
      icon: <FaUsers />,
      roles: ["admin", "property manager"],
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: <FaTools />,
      roles: ["admin"],
    },
    {
      name: "Finances",
      path: "/finances",
      icon: <FaClipboardList />,
      roles: ["admin", "property manager", "landlord"],
    },
    {
      name: "Professional Services",
      path: "/professional-services",
      icon: <UserCheck />,
      roles: ["admin", "property manager", "SERVICE_PROVIDER"],
    },
    {
      name: "Compliance",
      path: "/compliance",
      icon: <BadgeCheck />,
      roles: ["admin"],
    },
    {
      name: "Maintenance Store",
      path: "/maintenance-store",
      icon: <Store />,
      roles: ["admin", "property manager", "landlord", "TENANT"],
    },
    {
      name: "Admin Settings",
      path: "/admin-settings",
      icon: <Settings />,
      roles: ["admin"],
    },
    {
      name: "Subscription Packages",
      path: "/subscription-packages",
      icon: <Package />,
      roles: ["admin", "property manager"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen flex flex-col justify-between">
      <nav className="p-5">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-green-100 text-[#0A4429] font-semibold"
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

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}