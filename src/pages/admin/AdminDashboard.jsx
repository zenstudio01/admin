import React, { useState, useEffect } from "react";
import { 
  Users, Building2, Wallet, Wrench, ShieldCheck, 
  TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from "recharts";
import Layout from "../../layouts/Layout";
import axios from "axios";
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
      setMetrics(response.data);
    } catch (error) {
      console.error("Failed to load global administrative infrastructure telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F4F1E6]/30 flex justify-center items-center">
          <div className="h-10 w-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Upper Action/Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">System Control & Telemetry</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time platform execution telemetry, GMV metrics, and system node health.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-[#0A4429] outline-none focus:ring-2 focus:ring-[#2E9D47]"
            >
              <option value="today">Today's Cycle</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month (MTD)</option>
              <option value="this_year">Fiscal Year Matrix</option>
            </select>
            <button 
              onClick={fetchDashboardMetrics}
              className="p-2.5 bg-white border rounded-xl hover:bg-gray-50 transition text-gray-500"
              title="Force Metrics Sync"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Global Statistics Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Platform GMV Volume", value: metrics.cards.gmv, change: "+14.2%", positive: true, icon: <Wallet size={22} />, color: "bg-[#0A4429]" },
            { title: "Total Registered Nodes", value: metrics.cards.total_users, change: "+8.4%", positive: true, icon: <Users size={22} />, color: "bg-[#2E9D47]" },
            { title: "Active Tracked Units", value: metrics.cards.total_units, change: "Occupancy: " + metrics.cards.occupancy_rate, positive: true, icon: <Building2 size={22} />, color: "bg-emerald-700" },
            { title: "Open Maintenance Log", value: metrics.cards.open_tickets, change: "Critical Severity", positive: false, icon: <Wrench size={22} />, color: "bg-amber-600" }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.title}</span>
                <div className={`${card.color} text-white p-3 rounded-xl shadow-inner`}>{card.icon}</div>
              </div>
              <h3 className="text-3xl font-black text-[#0A4429] tracking-tight">{card.value}</h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {card.positive ? (
                  <span className="text-[#2E9D47] font-bold flex items-center gap-0.5"><ArrowUpRight size={14} />{card.change}</span>
                ) : (
                  <span className="text-amber-600 font-bold flex items-center gap-0.5"><ArrowDownRight size={14} />{card.change}</span>
                )}
                <span className="text-gray-400 font-medium">vs prior evaluation matrix</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Visualization Engine Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* GMV Volume Performance Timeline Graph */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm xl:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-bold text-[#0A4429]">Gross Merchandise Volume & Collection History</h4>
                <p className="text-xs text-gray-400">Aggregated cash collections running through payment gateway channels.</p>
              </div>
              <TrendingUp size={20} className="text-[#2E9D47]" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.charts.revenue_history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E9D47" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2E9D47" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="volume" stroke="#2E9D47" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGmv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Demographic Segments Classification Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-bold text-[#0A4429]">Actor Profile Proportions</h4>
                <p className="text-xs text-gray-400">Distribution framework across certified accounts.</p>
              </div>
              <BarChart3 size={20} className="text-[#0A4429]" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.charts.demographics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="role" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0A4429" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Global Activity Logging & System Health Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operations Activity Timeline Logs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
            <h4 className="text-lg font-bold text-[#0A4429] mb-5">Platform Core Activity Audit Stream</h4>
            <div className="space-y-4">
              {metrics.activities.map((log, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transitionrounded-xl">
                  <div className="w-2 h-2 rounded-full bg-[#2E9D47] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{log.message}</p>
                    <span className="text-xs text-gray-400 font-normal mt-1 block">{log.timestamp}</span>
                  </div>
                  <span className="text-xs font-semibold uppercase bg-gray-100 text-[#0A4429] px-2 py-0.5 rounded-md">{log.module}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Third-Party Operational API Health Status Monitoring Block */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-lg font-bold text-[#0A4429] mb-5">External Integration Status</h4>
            <div className="space-y-4">
              {[
                { name: "Safaricom M-Pesa Daraja Gateway", status: "Operational", speed: "112ms", health: "bg-[#2E9D47]" },
                { name: "KRA iTax Remittance Stream", status: "Operational", speed: "240ms", health: "bg-[#2E9D47]" },
                { name: "Twilio SMS Notification Pipeline", status: "Operational", speed: "84ms", health: "bg-[#2E9D47]" },
                { name: "AWS S3 Secure Asset Storage Vault", status: "Operational", speed: "14ms", health: "bg-[#2E9D47]" }
              ].map((gateway, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0A4429]">{gateway.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Latency overhead: {gateway.speed}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">{gateway.status}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${gateway.health} animate-pulse`}></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#2E9D47] bg-green-50 px-3 py-1.5 rounded-xl font-bold">
                <ShieldCheck size={14} /> Global Systems Running Nominally
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}