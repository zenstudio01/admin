import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";

import {
  CalendarCheck2,
  Wallet,
  Clock3,
  CheckCircle2,
  RefreshCw,
  Building2,
  ExternalLink,
  Users,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function CompanyDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const CHART_COLORS = [
    Colors.primary || "#0A4429",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get("/company/company_dashboard/");
      setDashboard(response.data || {});
    } catch (error) {
      console.error("Failed to load company dashboard telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <Layout>
        <div
          className="flex justify-center items-center min-h-screen"
          style={{ backgroundColor: Colors.background || "#FFFFFF" }}
        >
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${Colors.primary} transparent transparent transparent`,
            }}
          />
        </div>
      </Layout>
    );
  }

  // Safe extractions with fallbacks
  const company = dashboard?.company || {};
  const summary = dashboard?.summary || {};
  const wallet = dashboard?.wallet || {};
  const recentBookings = dashboard?.recent_bookings || [];
  const monthlyRevenue = dashboard?.monthly_revenue || [];
  const monthlyBookings = dashboard?.monthly_bookings || [];
  const bookingStatus = dashboard?.booking_status || [];

  const companyLogo =
    company.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      company.name || "Company"
    )}&background=0A4429&color=ffffff&bold=true`;

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-5">
            <img
              src={companyLogo}
              alt={company.name || "Company Logo"}
              className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-2xs"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {company.name || "Company Portal"}
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {company.service || "Service Enterprise"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {[company.city, company.country].filter(Boolean).join(", ") ||
                  "Regional Hub"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchDashboard}
            className="text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition hover:opacity-90 shadow-2xs shrink-0"
            style={{ backgroundColor: Colors.primary }}
          >
            <RefreshCw size={18} />
            Refresh Telemetry
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Total Bookings
                </p>
                <h2 className="text-3xl font-black mt-2 text-slate-900">
                  {summary.total_bookings || 0}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <CalendarCheck2 className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Pending Bookings
                </p>
                <h2 className="text-3xl font-black mt-2 text-amber-600">
                  {summary.pending_bookings || 0}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Clock3 className="text-amber-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Completed Jobs
                </p>
                <h2 className="text-3xl font-black mt-2 text-emerald-600">
                  {summary.completed_bookings || 0}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Wallet Balance
                </p>
                <h2
                  className="text-2xl font-black mt-2"
                  style={{ color: Colors.primary }}
                >
                  KES {Number(summary.wallet_balance || 0).toLocaleString()}
                </h2>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${Colors.primary}15`,
                  color: Colors.primary,
                }}
              >
                <Wallet size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= ANALYTICS CHARTS ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Monthly Revenue Stream
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Aggregated monthly financial yields (KES)
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    fill={Colors.primary}
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Bookings Line Chart */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Booking Volume Trends
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Total monthly customer service requests
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke={Colors.primary}
                    strokeWidth={3}
                    dot={{ fill: Colors.primary, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Booking Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Booking Status Distribution
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Proportional allocation across status lifecycle states
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatus}
                  dataKey="value"
                  nameKey="status"
                  outerRadius={110}
                  innerRadius={50}
                  paddingAngle={4}
                  label
                >
                  {bookingStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= Wallet & Company Profile Info ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Wallet Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Wallet Ledger Breakdown
            </h2>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-gray-500">Available Balance</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  KES {Number(wallet.available_balance || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-gray-500">Pending Balance</span>
                <span className="font-extrabold text-amber-600 text-sm">
                  KES {Number(wallet.pending_balance || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Float Reserve</span>
                <span className="font-extrabold text-blue-600 text-sm">
                  KES {Number(wallet.float_balance || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Company Context */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 lg:col-span-2">
            <div className="flex items-center gap-5">
              <img
                src={companyLogo}
                alt={company.name || "Company"}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {company.name || "Enterprise Context"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {company.service || "Primary Service Unit"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-50">
              <div>
                <p className="text-xs text-gray-400 font-medium">Official Email</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {company.email || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium">Contact Phone</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {company.phone_number || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium">Corporate Website</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {company.website} <ExternalLink size={12} />
                    </a>
                  ) : (
                    "--"
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium">Verified Staff</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Users size={14} className="text-gray-400" />
                  {company.professionals || 0} Registered Personnel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Service Requests
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Service</th>
                  <th className="py-3 px-2">Budget</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-xs text-gray-400 italic"
                    >
                      No recent bookings found.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-2 font-semibold text-slate-900">
                        {booking.customer || "Anonymous"}
                      </td>
                      <td className="py-3.5 px-2 text-gray-600">
                        {booking.title || "--"}
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-slate-900">
                        KES {Number(booking.budget || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-2 text-gray-500 text-xs">
                        {booking.preferred_date || "--"}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            booking.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : booking.status === "accepted"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : booking.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Footer Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="text-white rounded-2xl p-5 font-bold text-sm transition hover:opacity-90 shadow-2xs text-center"
            style={{ backgroundColor: Colors.primary }}
          >
            View Bookings
          </button>

          <button className="bg-white text-slate-800 rounded-2xl border border-gray-200 p-5 font-bold text-sm hover:border-emerald-500 transition shadow-2xs text-center">
            Manage Professionals
          </button>

          <button className="bg-white text-slate-800 rounded-2xl border border-gray-200 p-5 font-bold text-sm hover:border-emerald-500 transition shadow-2xs text-center">
            Wallet Settings
          </button>

          <button className="bg-white text-slate-800 rounded-2xl border border-gray-200 p-5 font-bold text-sm hover:border-emerald-500 transition shadow-2xs text-center">
            Edit Company Profile
          </button>
        </div>
      </div>
    </Layout>
  );
}