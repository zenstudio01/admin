import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import {
  Building2,
  Wallet,
  Users,
  ArrowUpRight,
  Calendar,
  FileBarChart2,
} from "lucide-react";

export default function LandlordDashboard() {
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
      console.log(error);
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
        <div className="flex justify-center items-center h-[80vh]">
          <div className="h-10 w-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-6">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">

          <div>

            <span className="text-xs uppercase tracking-widest text-[#2E9D47] font-bold">
              Landlord Dashboard
            </span>

            <h1 className="text-4xl font-bold text-[#0A4429] mt-2">
              Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Monitor your rental income, occupancy levels,
              tenant payments and overall portfolio performance
              from one centralized dashboard.
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
              <Calendar size={16} />
              {today}
            </div>

          </div>

          {/* Quick Actions */}

          <div className="flex flex-wrap gap-3">

            <button className="flex items-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-3 rounded-xl transition">
              <Building2 size={18} />
              My Properties
            </button>

            <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-5 py-3 rounded-xl transition">
              <Users size={18} />
              My Tenants
            </button>

            <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-5 py-3 rounded-xl transition">
              <FileBarChart2 size={18} />
              Reports
            </button>

          </div>

        </div>

        {/* ================= PORTFOLIO BANNER ================= */}

        <div className="bg-gradient-to-r from-[#0A4429] to-[#2E9D47] rounded-3xl p-8 text-white shadow-lg mb-10">

          <div className="flex flex-col lg:flex-row justify-between gap-8">

            <div>

              <p className="uppercase tracking-widest text-green-200 text-xs">
                Portfolio Overview
              </p>

              <h2 className="text-3xl font-bold mt-3">
                Your Investment Portfolio
              </h2>

              <p className="text-green-100 mt-3 max-w-xl">
                Keep track of your rental properties,
                occupancy performance and monthly income
                through UNIT's intelligent property
                management platform.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">

                <Wallet size={28} />

                <p className="mt-4 text-green-100 text-sm">
                  Monthly Revenue
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  Ksh {dashboard.summary.rent_collected.toLocaleString()}
                </h3>

              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">

                <ArrowUpRight size={28} />

                <p className="mt-4 text-green-100 text-sm">
                  Occupancy Rate
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  {dashboard.summary.occupancy_rate}%
                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* ================= SUMMARY CARDS ================= */}

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

  {[
    {
      title: "My Properties",
      value: dashboard.summary.properties,
      subtitle: "Registered Buildings",
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Units",
      value: dashboard.summary.units,
      subtitle: "Rental Units",
      icon: Building2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Occupied Units",
      value: dashboard.summary.occupied_units,
      subtitle: "Currently Occupied",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Available Units",
      value: dashboard.summary.available_units,
      subtitle: "Ready for Leasing",
      icon: Building2,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Rent Collected",
      value: `Ksh ${dashboard.summary.rent_collected.toLocaleString()}`,
      subtitle: "This Month",
      icon: Wallet,
      color: "bg-green-100 text-[#2E9D47]",
    },
    {
      title: "Pending Rent",
      value: `Ksh ${dashboard.summary.pending_rent.toLocaleString()}`,
      subtitle: "Awaiting Payment",
      icon: Wallet,
      color: "bg-red-50 text-red-600",
    },
  ].map((card, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold text-[#0A4429] mt-3">
            {card.value}
          </h2>

          <p className="text-xs text-gray-400 mt-3">
            {card.subtitle}
          </p>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}
        >
          <card.icon size={28} />
        </div>

      </div>

      <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-[#2E9D47]"
          style={{
            width:
              card.title === "Occupied Units"
                ? `${dashboard.summary.occupancy_rate}%`
                : "100%",
          }}
        />

      </div>

    </div>
  ))}

</div>

      </div>
    </Layout>
  );
}