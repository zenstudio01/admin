import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";
import {
  Building2,
  Wallet,
  Users,
  ArrowUpRight,
  Calendar,
  FileBarChart2,
  Clock,
  ArrowRight,
  Home,
} from "lucide-react";

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/landlords/landlord_dashboard/");
      setDashboard(response.data);
    } catch (error) {
      console.error("Error fetching landlord dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${Colors.primary || "#0A4429"} transparent transparent transparent`,
            }}
          />
        </div>
      </Layout>
    );
  }

  // Fallback defaults in case backend parameters are missing
  const summary = dashboard?.summary || {
    properties: 0,
    units: 0,
    occupied_units: 0,
    available_units: 0,
    rent_collected: 0,
    pending_rent: 0,
    occupancy_rate: 0,
  };

  const cards = [
    {
      title: "My Properties",
      value: summary.properties,
      subtitle: "Registered Buildings",
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      path: "/properties",
    },
    {
      title: "Total Units",
      value: summary.units,
      subtitle: "Rental Units",
      icon: Home,
      color: "bg-emerald-50 text-emerald-600",
      path: "/properties",
    },
    {
      title: "Occupied Units",
      value: summary.occupied_units,
      subtitle: "Currently Occupied",
      icon: Users,
      color: "bg-green-50 text-green-700",
      path: "/tenants",
    },
    {
      title: "Available Units",
      value: summary.available_units,
      subtitle: "Ready for Leasing",
      icon: Building2,
      color: "bg-amber-50 text-amber-600",
      path: "/properties",
    },
    {
      title: "Rent Collected",
      value: `Ksh ${Number(summary.rent_collected || 0).toLocaleString()}`,
      subtitle: "This Month",
      icon: Wallet,
      color: "bg-emerald-100/70 text-emerald-800",
      path: "/reports",
    },
    {
      title: "Pending Rent",
      value: `Ksh ${Number(summary.pending_rent || 0).toLocaleString()}`,
      subtitle: "Awaiting Payment",
      icon: Clock,
      color: "bg-rose-50 text-rose-600",
      path: "/reports",
    },
  ];

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#F8FAFC" }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: Colors.secondary || "#2E9D47" }}
              >
                Landlord Dashboard
              </span>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
                Welcome Back 👋
              </h1>

              <p className="text-gray-500 text-sm mt-2 max-w-2xl leading-relaxed">
                Monitor your rental income, occupancy levels, tenant payments, and
                overall portfolio performance from one centralized dashboard.
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mt-4">
                <Calendar size={15} />
                <span>{today}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/properties")}
                className="flex items-center gap-2 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xs hover:opacity-90 transition"
                style={{ backgroundColor: Colors.primary || "#0A4429" }}
              >
                <Building2 size={18} />
                My Properties
              </button>

              <button
                onClick={() => navigate("/tenants")}
                className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xs transition"
              >
                <Users size={18} />
                My Tenants
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xs transition"
              >
                <FileBarChart2 size={18} />
                Reports
              </button>
            </div>
          </div>

          {/* Portfolio Banner */}
          <div
            className="rounded-3xl p-6 md:p-10 text-white shadow-md relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${
                Colors.primary || "#0A4429"
              } 0%, ${Colors.secondary || "#2E9D47"} 100%)`,
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div>
                <span className="uppercase tracking-widest text-emerald-200 text-xs font-bold">
                  Portfolio Overview
                </span>

                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                  Your Investment Portfolio
                </h2>

                <p className="text-emerald-100/90 text-sm mt-2 max-w-xl leading-relaxed">
                  Keep track of your rental properties, occupancy performance, and
                  monthly income through the intelligent property management platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <Wallet size={22} />
                  </div>
                  <p className="mt-4 text-emerald-100 text-xs font-medium">
                    Monthly Revenue
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-1">
                    Ksh {Number(summary.rent_collected || 0).toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <ArrowUpRight size={22} />
                  </div>
                  <p className="mt-4 text-emerald-100 text-xs font-medium">
                    Occupancy Rate
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-1">
                    {summary.occupancy_rate}%
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => card.path && navigate(card.path)}
                className="bg-white rounded-3xl p-6 shadow-2xs border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-xs font-medium">
                        {card.title}
                      </p>
                      <h2
                        className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight"
                        style={{ color: Colors.primary || "#0A4429" }}
                      >
                        {card.value}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        {card.subtitle}
                      </p>
                    </div>

                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xs ${card.color}`}
                    >
                      <card.icon size={24} />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-400">Progress</span>
                    <ArrowRight
                      size={14}
                      className="text-gray-400 group-hover:translate-x-1 transition-transform"
                      style={{ color: Colors.secondary }}
                    />
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: Colors.secondary || "#2E9D47",
                        width:
                          card.title === "Occupied Units"
                            ? `${summary.occupancy_rate}%`
                            : "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}