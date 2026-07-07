import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Search, 
  Sliders, 
  Activity, 
  Key, 
  Users, 
  Lock, 
  Terminal, 
  RefreshCw,
  Database,
  CheckCircle,
  AlertOctagon
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";

export default function AdminSettings() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("AuditLogs");
  const [searchQuery, setSearchQuery] = useState("");

  // Role Permissions Matrix Configuration Matrix
  const [roles, setRoles] = useState([
    { id: 1, name: "Property Manager", users: 4, modules: ["Properties", "Tenants", "Finances", "Listings", "Maintenance"] },
    { id: 2, name: "Landlord / Owner", users: 12, modules: ["Finances (Read-Only)", "Landlord Statements"] },
    { id: 3, name: "Service Provider", users: 28, modules: ["Maintenance Store", "Service Requests"] },
    { id: 4, name: "Tenant", users: 180, modules: ["M-Pesa STK Inflows", "Maintenance Ticketing"] }
  ]);

  useEffect(() => {
    fetchSystemSecurityTrails();
  }, []);

  const fetchSystemSecurityTrails = async () => {
    try {
      setLoading(true);
      
      // Seed data simulating raw production engine security streams
      const mockLogs = [
        { id: 9001, timestamp: "2026-07-03 09:41:12", event: "Daraja Webhook Execution Success", actor: "M-PESA API Gateway", severity: "Success", target: "MPESA_TX_MK821", ip: "196.201.214.20" },
        { id: 9002, timestamp: "2026-07-03 08:15:44", event: "Escrow Contract Generation", actor: "Gideon Ushindi (Admin)", severity: "Success", target: "REQ_9921 / LR 209/13402", ip: "41.89.22.104" },
        { id: 9003, timestamp: "2026-07-02 17:30:22", event: "Landlord Net Allocation Settlement Reconciled", actor: "Finances.jsx Engine", severity: "Success", target: "Dr. Kobia Portfolio Pool", ip: "Internal System Loop" },
        { id: 9004, timestamp: "2026-07-02 11:05:19", event: "Unauthorized API Route Mapping Interception", actor: "Unknown Scanner", severity: "Warning", target: "/api/v1/compliance/raw-titles", ip: "185.220.101.5" }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error("Critical failure reading security telemetry matrices", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModulePermission = (roleId, moduleName) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasModule = role.modules.includes(moduleName);
        const updatedModules = hasModule 
          ? role.modules.filter(m => m !== moduleName)
          : [...role.modules, moduleName];
        return { ...role, modules: updatedModules };
      }
      return role;
    }));

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'ACL Permissions Set Propagated Successfully',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const filteredLogs = logs.filter(log => 
    log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ip.includes(searchQuery)
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">System Core Administration</h1>
          <p className="text-sm text-gray-500 mt-1">Audit security metrics telemetry, view global audit logs, and manipulate granular system application access control policies.</p>
        </div>

        {/* Operational Section Navigation Matrix */}
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button 
            onClick={() => setActiveTab("AuditLogs")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "AuditLogs" ? "border-b-2 border-[#2E9D47] text-[#0A4429]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Terminal size={16} /> Immutable System Audit Trails
          </button>
          <button 
            onClick={() => setActiveTab("RBAC")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "RBAC" ? "border-b-2 border-[#2E9D47] text-[#0A4429]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Key size={16} /> Granular Access Policies (RBAC)
          </button>
        </div>

        {/* Tab Content Rendering Pipeline Layout */}
        {activeTab === "AuditLogs" ? (
          <div className="space-y-6">
            {/* Search Filter Strip Layout */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4 items-center">
              <div className="relative w-full sm:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Filter logs via actors, events, IP strings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                />
              </div>
              <button 
                onClick={fetchSystemSecurityTrails}
                className="text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-1.5 font-bold shrink-0 self-stretch sm:self-auto justify-center"
              >
                <RefreshCw size={14} /> Refresh Stream
              </button>
            </div>

            {/* Audit Logs Table Matrix Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="bg-[#0A4429]/5 text-[#0A4429] font-bold uppercase tracking-wider border-b border-gray-100">
                        <th className="p-4">Timestamp Matrix</th>
                        <th className="p-4">Event Context Signature</th>
                        <th className="p-4">System Actor Identification</th>
                        <th className="p-4">Target Resource Node</th>
                        <th className="p-4">Origin IP Node</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 whitespace-nowrap text-gray-400">{log.timestamp}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              log.severity === "Success" ? "text-green-700" : "text-amber-700"
                            }`}>
                              {log.severity === "Success" ? <CheckCircle size={12} /> : <AlertOctagon size={12} />}
                              {log.event}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-gray-900">{log.actor}</td>
                          <td className="p-4 text-gray-500">{log.target}</td>
                          <td className="p-4 text-gray-400">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Role Based Access Control Interfacing Block */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800 text-base flex items-center gap-1.5">
                      <Shield size={18} className="text-[#2E9D47]" /> {role.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">Active Connections Pool: <b>{role.users}</b> accounts mapped.</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                    ID Profile: 00{role.id}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Application Routing Capability Keys</p>
                  <div className="flex flex-wrap gap-2">
                    {["Properties", "Tenants", "Finances", "Listings", "Maintenance Store", "Statutory Compliance"].map((mod) => {
                      const isGranted = role.modules.some(m => m.toLowerCase().includes(mod.toLowerCase().split(" ")[0]));
                      return (
                        <button
                          key={mod}
                          onClick={() => handleToggleModulePermission(role.id, mod)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                            isGranted 
                              ? "bg-green-50 border-green-200 text-green-700 font-semibold" 
                              : "bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200"
                          }`}
                        >
                          <Lock size={12} className={isGranted ? "text-green-600" : "text-gray-300"} />
                          {mod}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}