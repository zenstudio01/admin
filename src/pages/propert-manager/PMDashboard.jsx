import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaUsers,
  FaMoneyBillWave,
  FaTools,
  FaDoorOpen,
  FaCheckCircle,
  FaMapMarkerAlt
} from "react-icons/fa";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";

export default function PMDashboard() {
  const [userName, setUserName] = useState("Property Manager");
  const [loading, setLoading] = useState(true);
  
  // State matches your exact API JSON data schema layout
  const [dashboardData, setDashboardData] = useState({
    statistics: {
      properties: 0,
      units: 0,
      tenants: 0,
      landlords: 0,
      occupied_units: 0,
      vacant_units: 0,
      occupancy_rate: 0,
      monthly_revenue: 0,
      pending_maintenance: 0,
      completed_maintenance: 0
    },
    revenue_graph: [],
    occupancy_graph: [],
    recent_properties: []
  });

  // Fetch data on initial component mount lifecycle layer
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user) {
      try {
        setUserName(user.user_name || "Property Manager");
      } catch (e) {
        console.error("Error parsing user data from local storage", e);
      }
    }

    fetchDashboardData();
  }, []);

  // Connects directly to backend API node matrices
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/prop/dashboard_statistics/");
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error connecting to administrative ecosystem metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData.statistics;

  // Primary KPI metrics array using Colors.primary
  const primaryMetricCards = [
    { title: "Managed Properties", value: stats.properties, icon: <FaBuilding /> },
    { title: "Total Units Tracked", value: stats.units, icon: <FaDoorOpen /> },
    { title: "Active Tenants", value: stats.tenants, icon: <FaUsers /> },
    { title: "Monthly Collection", value: `KES ${stats.monthly_revenue.toLocaleString()}`, icon: <FaMoneyBillWave /> },
  ];

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        
        {/* Header Greeting Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Property Manager Dashboard
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back,{" "}
              <span className="font-semibold" style={{ color: Colors.primary }}>
                {userName}
              </span>
              . Here is what is happening across your properties today.
            </p>
          </div>
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 self-start bg-white"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: Colors.primary }}
            ></div>
            <span 
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: Colors.primary }}
            >
              Live Properties Status
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div 
              className="h-8 w-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
            ></div>
          </div>
        ) : (
          <>
            {/* Dynamic Metrics Cards Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              {primaryMetricCards.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {item.title}
                      </p>
                      <h3 className="text-2xl font-bold mt-2 text-slate-900">
                        {item.value}
                      </h3>
                    </div>
                    <div 
                      className="text-white p-4 rounded-xl text-xl shadow-inner"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      {item.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modular Content Section Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Panel 1: Occupancy Distribution Progress Metric */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Occupancy Summary</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Current state index:{" "}
                    <span className="font-bold" style={{ color: Colors.primary }}>
                      {stats.occupancy_rate}% Occupied
                    </span>
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-600">Occupied Units</span>
                        <span className="text-slate-900 font-bold">{stats.occupied_units} / {stats.units}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full mt-1.5">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${stats.occupancy_rate}%`,
                            backgroundColor: Colors.primary
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-600">Vacant Units</span>
                        <span className="text-gray-500 font-bold">{stats.vacant_units} / {stats.units}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full mt-1.5">
                        <div 
                          className="bg-gray-300 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${100 - stats.occupancy_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 text-[11px] text-gray-400 flex justify-between">
                  <span>Total System Landlords:</span>
                  <span className="font-bold text-gray-700">{stats.landlords}</span>
                </div>
              </div>

              {/* Panel 2: Maintenance Tracker Operations */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Maintenance Health</h3>
                <p className="text-xs text-gray-400 mb-4">Active operational repair ticket tasks.</p>
                
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-800">
                    <div className="flex items-center gap-2 text-xs">
                      <FaTools className="text-amber-500" />
                      <span>Pending Maintenance Tickets</span>
                    </div>
                    <span className="font-bold text-base">{stats.pending_maintenance}</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-center p-3 rounded-xl border text-xs"
                    style={{
                      backgroundColor: `${Colors.primary}10`,
                      borderColor: `${Colors.primary}25`,
                      color: Colors.primary
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FaCheckCircle style={{ color: Colors.primary }} />
                      <span className="font-medium">Completed &amp; Settled Actions</span>
                    </div>
                    <span className="font-bold text-base">{stats.completed_maintenance}</span>
                  </div>
                </div>
              </div>

              {/* Panel 3: Recent Properties Matrix List */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Recent Portfolios Added</h3>
                <p className="text-xs text-gray-400 mb-4">Latest assets onboarded into system registries.</p>
                
                <div className="space-y-3">
                  {dashboardData.recent_properties.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No properties onboarded yet.</p>
                  ) : (
                    dashboardData.recent_properties.map((property) => (
                      <div 
                        key={property.id} 
                        className="p-3 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50/40"
                      >
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate">{property.name}</h4>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                            <FaMapMarkerAlt size={10} />
                            <span>{property.city}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span 
                            className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1"
                            style={{
                              backgroundColor: `${Colors.primary}15`,
                              color: Colors.primary
                            }}
                          >
                            {property.status}
                          </span>
                          <p className="text-[11px] text-gray-500 font-medium">{property.units} Units</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Section: Revenue Tracking Blocks */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 mt-8">
              <h3 className="text-lg font-bold text-slate-900">
                Monthly Revenue Trend
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Revenue collected over the last months.
              </p>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.revenue_graph}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={Colors.primary} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={Colors.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      tickFormatter={(value) => `${value / 1000}K`}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `KES ${Number(value).toLocaleString()}`,
                        "Revenue",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={Colors.primary}
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}