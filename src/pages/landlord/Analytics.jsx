import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";

import {
  RefreshCw,
  Download,
  Filter,
  Wallet,
  TrendingUp,
  Percent,
  Clock3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function LandlordAnalytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchProperties();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);

      const params = {};
      if (selectedProperty) params.property = selectedProperty;
      if (startDate) params.start_date = startDate.toISOString().split("T")[0];
      if (endDate) params.end_date = endDate.toISOString().split("T")[0];

      const response = await api.get("/landlords/landlord_analytics/", {
        params,
      });

      setAnalytics(response.data || {});
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get("/property_list/");
      setProperties(response.data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const applyFilters = () => {
    fetchAnalytics();
  };

  const resetFilters = () => {
    setSelectedProperty("");
    setStartDate(null);
    setEndDate(null);
    // Fetch with cleared parameters
    setTimeout(() => {
      fetchAnalytics();
    }, 0);
  };

  const exportReport = () => {
    const summary = analytics?.summary || {};
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Metric,Value",
       `Total Revenue,Ksh ${summary.total_revenue || 0}`,
       `Pending Rent,Ksh ${summary.pending_rent || 0}`,
       `Occupancy Rate,${summary.occupancy_rate || 0}%`,
       `Collection Rate,${summary.collection_rate || 0}%`
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `landlord_analytics_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const summary = analytics?.summary || {
    total_revenue: 0,
    pending_rent: 0,
    occupancy_rate: 0,
    collection_rate: 0,
  };

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
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: Colors.secondary || "#2E9D47" }}
              >
                Landlord Analytics
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
                Property Performance Analytics
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Analyze rental income, occupancy trends, and portfolio performance metrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xs hover:bg-gray-50 transition"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                onClick={exportReport}
                className="flex items-center gap-2 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xs hover:opacity-90 transition"
                style={{ backgroundColor: Colors.secondary || "#2E9D47" }}
              >
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter size={18} style={{ color: Colors.secondary || "#2E9D47" }} />
                <h2 className="font-bold text-lg text-slate-900">
                  Analytics Filters
                </h2>
              </div>

              {(selectedProperty || startDate || endDate) && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-gray-400 hover:text-slate-700 flex items-center gap-1 transition"
                >
                  <RotateCcw size={14} /> Reset Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Property Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl p-3.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white"
                >
                  <option value="">All Properties</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name || prop.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Start Date
                </label>
                <div className="relative flex items-center">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="w-full border border-gray-200 rounded-2xl p-3.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholderText="Select start date"
                    dateFormat="yyyy-MM-dd"
                  />
                  <CalendarIcon
                    size={16}
                    className="absolute right-4 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  End Date
                </label>
                <div className="relative flex items-center">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="w-full border border-gray-200 rounded-2xl p-3.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholderText="Select end date"
                    dateFormat="yyyy-MM-dd"
                  />
                  <CalendarIcon
                    size={16}
                    className="absolute right-4 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="w-full text-white rounded-2xl p-3.5 text-sm font-bold shadow-2xs hover:opacity-90 transition"
                  style={{ backgroundColor: Colors.primary || "#0A4429" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Revenue</p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight"
                    style={{ color: Colors.primary || "#0A4429" }}
                  >
                    Ksh {Number(summary.total_revenue || 0).toLocaleString()}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
                  <Wallet size={24} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-emerald-600">
                <ArrowUpRight size={16} />
                <span>Income Generated</span>
              </div>
            </div>

            {/* Pending Rent */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500">Pending Rent</p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight"
                    style={{ color: Colors.primary || "#0A4429" }}
                  >
                    Ksh {Number(summary.pending_rent || 0).toLocaleString()}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs">
                  <Clock3 size={24} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-rose-500">
                <ArrowDownRight size={16} />
                <span>Awaiting Payment</span>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500">Occupancy Rate</p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight"
                    style={{ color: Colors.primary || "#0A4429" }}
                  >
                    {summary.occupancy_rate || 0}%
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Percent size={24} />
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: Colors.secondary || "#2E9D47",
                      width: `${summary.occupancy_rate || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Collection Rate */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500">Collection Rate</p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight"
                    style={{ color: Colors.primary || "#0A4429" }}
                  >
                    {summary.collection_rate || 0}%
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${summary.collection_rate || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}