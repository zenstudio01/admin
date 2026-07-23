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
  ShoppingBasket,
  TrendingUp,
  Bell,
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
      roles: ["TENANT", "SERVICE_PROVIDER"],
    },
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
      roles: ["admin"],
    },
    {
      name: "Dashboard",
      path: "/property-manager-dashboard",
      icon: <FaHome />,
      roles: ["property manager"],
    },
    {
      name: "Dashboard",
      path: "/landlord-dashboard",
      icon: <FaHome />,
      roles: ["landlord"],
    },
    {
      name: "Dashboard",
      path: "/company-dashboard",
      icon: <FaHome />,
      roles: ["company admin"],
    },
    {
      name: "Professionals",
      path: "/company-professionals",
      icon: <UserCheck />,
      roles: ["company admin"],
    },
    {
      name: "Users",
      path: "/user-management",
      icon: <FaUsers />,
      roles: ["admin"],
    },
    {
      name: "Profile",
      path: "/company-profile",
      icon: <FaUsers />,
      roles: ["company admin"],
    },
    {
      name: "Services",
      path: "/company-services",
      icon: <FaUsers />,
      roles: ["company admin"],
    },
    {
      name: "Properties",
      path: "/properties",
      icon: <FaBuilding />,
      roles: ["admin", "property manager"],
    },
    {
      name: "Tenants",
      path: "/tenants",
      icon: <FaUsers />,
      roles: ["property manager", "landlord"],
    },
    {
      name: "Analytics",
      path: "/landlord-analytics",
      icon: <TrendingUp />,
      roles: ["landlord"],
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
      roles: ["property manager"],
    },
    {
      name: "Finances",
      path: "/finances",
      icon: <FaClipboardList />,
      roles: ["admin"],
    },
    {
      name: "Professional Services",
      path: "/professional-services",
      icon: <UserCheck />,
      roles: ["admin", "SERVICE_PROVIDER"],
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
      roles: ["admin", "TENANT"],
    },
    {
      name: "Units",
      path: "/property-manager-unit",
      icon: <Store />,
      roles: ["property manager"],
    },
    {
      name: "Dashboard",
      path: "/store-owner-dashboard",
      icon: <FaHome />,
      roles: ["store owner"],
    },
    {
      name: "Products",
      path: "/store-owner-products",
      icon: <Package />,
      roles: ["store owner"],
    },
    {
      name: "Orders",
      path: "/store-owner-orders",
      icon: <ShoppingBasket />,
      roles: ["store owner"],
    },
    {
      name: "Store Profile",
      path: "/store-owner-profile",
      icon: <UserCheck />,
      roles: ["store owner"],
    },
    {
      name: "Admin Settings",
      path: "/admin-settings",
      icon: <Settings />,
      roles: ["admin"],
    },
    {
      name: "Profile",
      path: "/property-manager-profile",
      icon: <FaUsers />,
      roles: ["property manager"],
    },
    {
      name: "Announcements",
      path: "/property-manager-announcements",
      icon: <Bell />,
      roles: ["property manager"],
    },
    {
      name: "Subscription Packages",
      path: "/subscription-packages",
      icon: <Package />,
      roles: ["store owner","admin", "property manager"],
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