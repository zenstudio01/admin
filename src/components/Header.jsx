import React from "react";
import Colors from "../constants/colors";

export default function Header() {
  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  };

  const user = getUser();
  const userName = user?.user_name || user?.name || "Admin User";
  const userRole = user?.role || user?.user_type || "Property Manager";

  // Dynamic Avatar URL using the current user's name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=0A4429&color=ffffff&bold=true`;

  return (
    <header className="bg-white border-b border-gray-100 shadow-2xs sticky top-0 z-30">
      <div className="px-4 md:px-8 py-3.5 flex justify-between items-center">
        {/* Brand/System Title */}
        <div className="flex items-center gap-2">
          <h1
            className="text-xl md:text-2xl font-black tracking-tight"
            style={{ color: Colors.primary }}
          >
            Unit
          </h1>
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="hidden sm:block">
            <h4 className="font-bold text-slate-900 text-sm leading-tight">
              {userName}
            </h4>
            <p className="text-xs font-medium text-gray-400 capitalize mt-0.5">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}