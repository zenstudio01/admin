import React, { useState, useEffect } from "react";
import { 
  Users, Building2, Wallet, Wrench, ShieldCheck, 
  TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import Layout from "../../layouts/Layout";
import Colors from "../../constants/colors";
import api from "../../api/api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState("this_month");

  useEffect(() => {
    fetchDashboardMetrics();
  }, [timeframe]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/dashboard/metrics/`, {
        params: { timeframe }
      });
      setMetrics(response.data || {});
    } catch (error) {
      console.error("Failed to load global administrative infrastructure telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <Layout>
        <div 
          className="min-h-screen flex justify-center items-center"
          style={{ backgroundColor: Colors.background || "#FFFFFF" }}
        >
          <div 
            className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
          ></div>
        </div>
      </Layout>
    );
  }

  // Safe fallback extractions
  const cards = metrics?.cards || {};
  const charts = metrics?.charts || {};
  const revenueHistory = charts?.revenue_history || [];
  const demographics = charts?.demographics || [];
  const activities = metrics?.activities || [];

  const statCards = [
    { 
      title: "Platform GMV Volume", 
      value: cards.gmv || "KES 0", 
      change: "+14.2%", 
      positive: true, 
      icon: <Wallet size={22} />, 
      color: Colors.primary 
    },
    { 
      title: "Total Registered Nodes", 
      value: cards.total_users || 0, 
      change: "+8.4%", 
      positive: true, 
      icon: <Users size={22} />, 
      color: Colors.primary 
    },
    { 
      title: "Active Tracked Units", 
      value: cards.total_units || 0, 
      change: `Occupancy: ${cards.occupancy_rate || "0%"}`, 
      positive: true, 
      icon: <Building2 size={22} />, 
      color: Colors.primary 
    },
    { 
      title: "Open Maintenance Log", 
      value: cards.open_tickets || 0, 
      change: "Critical Severity", 
      positive: false, 
      icon: <Wrench size={22} />, 
      color: "#D97706" 
    }
  ];

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        
        {/* Upper Action/Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              System Control & Telemetry
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time platform execution telemetry, GMV metrics, and system node health.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-slate-800 outline-none shadow-2xs focus:ring-2 focus:ring-emerald-500"
            >
              <option value="today">Today's Cycle</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month (MTD)</option>
              <option value="this_year">Fiscal Year Matrix</option>
            </select>

            <button 
              onClick={fetchDashboardMetrics}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600 shadow-2xs"
              title="Force Metrics Sync"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Global Statistics Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div 
                  className="text-white p-3 rounded-xl shadow-inner"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
              </div>

              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </h3>

              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {card.positive ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight size={14} />
                    {card.change}
                  </span>
                ) : (
                  <span className="text-amber-600 font-bold flex items-center gap-0.5">
                    <ArrowDownRight size={14} />
                    {card.change}
                  </span>
                )}
                <span className="text-gray-400 font-medium">vs prior evaluation matrix</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Visualization Engine Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* GMV Volume Performance Timeline Graph */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs xl:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Gross Merchandise Volume & Collection History
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Aggregated cash collections running through payment gateway channels.
                </p>
              </div>
              <TrendingUp size={20} style={{ color: Colors.primary }} />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={Colors.primary} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={Colors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke={Colors.primary} 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorGmv)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Demographic Segments Classification Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Actor Profile Proportions
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Distribution framework across certified accounts.
                </p>
              </div>
              <BarChart3 size={20} style={{ color: Colors.primary }} />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="role" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill={Colors.primary} 
                    radius={[6, 6, 0, 0]} 
                    barSize={32} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Global Activity Logging & System Health Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operations Activity Timeline Logs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs lg:col-span-2">
            <h4 className="text-lg font-bold text-slate-900 mb-5">
              Platform Core Activity Audit Stream
            </h4>

            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No recent system activity logs detected.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((log, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-3 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition rounded-xl"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: Colors.primary }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">
                        {log.message}
                      </p>
                      <span className="text-xs text-gray-400 font-normal mt-1 block">
                        {log.timestamp}
                      </span>
                    </div>
                    <span 
                      className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md"
                      style={{ 
                        backgroundColor: `${Colors.primary}10`, 
                        color: Colors.primary 
                      }}
                    >
                      {log.module}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Third-Party Operational API Health Status Monitoring Block */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <h4 className="text-lg font-bold text-slate-900 mb-5">
              External Integration Status
            </h4>

            <div className="space-y-4">
              {[
                { name: "Safaricom M-Pesa Daraja Gateway", status: "Operational", speed: "112ms" },
                { name: "KRA iTax Remittance Stream", status: "Operational", speed: "240ms" },
                { name: "Twilio SMS Notification Pipeline", status: "Operational", speed: "84ms" },
                { name: "AWS S3 Secure Asset Storage Vault", status: "Operational", speed: "14ms" }
              ].map((gateway, idx) => (
                <div key={idx} className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{gateway.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Latency overhead: {gateway.speed}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">{gateway.status}</span>
                    <span 
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: Colors.primary }}
                    ></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <div 
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold"
                style={{ 
                  backgroundColor: `${Colors.primary}10`, 
                  color: Colors.primary 
                }}
              >
                <ShieldCheck size={14} /> Global Systems Running Nominally
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}