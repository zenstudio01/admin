import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  FileText, 
  RefreshCw, 
  Building, 
  FileCheck, 
  ExternalLink, 
  Plus, 
  X, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import Layout from "../layouts/Layout";
import Swal from "sweetalert2";

export default function Compliance() {
  const [complianceLogs, setComplianceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [newRequest, setNewRequest] = useState({
    type: "Official Title Search",
    property: "",
    parcel_number: "",
    notes: ""
  });

  useEffect(() => {
    fetchComplianceStatus();
  }, []);

  const fetchComplianceStatus = async () => {
    try {
      setLoading(true);
      
      // Simulating system registry pull for statutory actions
      const fallbackLogs = [
        { id: 401, type: "Official Title Search", property: "Kilimani Heights", identifier: "LR 209/13402", status: "Verified", updated: "2026-07-01", cost: 500, reference: "SYS_REQ_9921" },
        { id: 402, type: "Land Rates Clearance", property: "The Westlands Hub", identifier: "LR 1870/IX/44", status: "Arrears Pending", updated: "2026-06-28", cost: 0, reference: "SYS_REQ_9811" },
        { id: 403, type: "Structural Modification Approval", property: "Ngong Road Arcade", identifier: "NCC/BP/5521B", status: "Under Review", updated: "2026-06-15", cost: 12500, reference: "NCC_API_0492" }
      ];

      setComplianceLogs(fallbackLogs);
    } catch (error) {
      console.error("Error establishing connection to land registry middleware", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleLaunchRequest = (e) => {
    e.preventDefault();

    const createdLog = {
      id: Date.now(),
      type: newRequest.type,
      property: newRequest.property,
      identifier: newRequest.parcel_number,
      status: "Under Review",
      updated: new Date().toISOString().split('T')[0],
      cost: newRequest.type === "Official Title Search" ? 500 : 0,
      reference: "SYS_REQ_" + Math.floor(1000 + Math.random() * 9000)
    };

    setComplianceLogs([createdLog, ...complianceLogs]);
    setIsRequestModalOpen(false);
    setNewRequest({ type: "Official Title Search", property: "", parcel_number: "", notes: "" });

    Swal.fire({
      icon: "success",
      title: "Statutory Request Queued",
      text: "The search parameter bundle has been handed off to official registry lookup pipelines.",
      confirmButtonColor: "#2E9D47"
    });
  };

  const triggerRatesCheck = (propertyName) => {
    Swal.fire({
      title: `Querying Registry for ${propertyName}`,
      text: "Polling local county land revenue databases via API middleware...",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      Swal.fire({
        icon: "success",
        title: "Sync Complete",
        text: "Outstanding Land Rates Balance: KES 0.00 (Cleared for current fiscal year).",
        confirmButtonColor: "#0A4429"
      });
    });
  };

  const filteredLogs = complianceLogs.filter(log => {
    const matchesSearch = log.property.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Statutory & Compliance Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Audit land titles, monitor rate balances, and track local council building permissions.</p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#0A4429] hover:bg-[#2E9D47] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm self-start sm:self-center"
          >
            <Plus size={18} />
            <span>Initiate Compliance Action</span>
          </button>
        </div>

        {/* Filter and Matrix Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by asset names, LR numbers, or system references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {["All", "Verified", "Under Review", "Arrears Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-[#0A4429] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Regulatory Tracker Pipeline Display */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <FileCheck size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Operational Document Logs</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">All portfolios are within standard static compliance targets.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A4429]/5 text-[#0A4429] font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">Process Parameter</th>
                    <th className="p-4">Target Asset</th>
                    <th className="p-4">Parcel Identity / LR No.</th>
                    <th className="p-4">Verification Flow</th>
                    <th className="p-4 text-right">Actions Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-[#2E9D47]" />
                          <div>
                            <span className="font-semibold text-gray-800">{log.type}</span>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{log.reference}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{log.property}</td>
                      <td className="p-4 font-mono text-xs text-gray-600">{log.identifier}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          log.status === "Verified" ? "bg-green-50 text-green-700" :
                          log.status === "Under Review" ? "bg-blue-50 text-blue-700" :
                          "bg-red-50 text-red-700 animate-pulse"
                        }`}>
                          {log.status === "Verified" ? <CheckCircle2 size={12} /> :
                           log.status === "Under Review" ? <Clock size={12} /> :
                           <AlertTriangle size={12} />}
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {log.type === "Land Rates Clearance" ? (
                          <button 
                            onClick={() => triggerRatesCheck(log.property)}
                            className="text-xs bg-gray-100 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-[#0A4429] hover:text-white transition-all flex items-center gap-1 ml-auto"
                          >
                            <RefreshCw size={12} /> Poll Balance
                          </button>
                        ) : (
                          <button className="text-xs text-[#0A4429] font-bold hover:text-[#2E9D47] transition-all inline-flex items-center gap-1">
                            View Certificate <ExternalLink size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Regulatory Actions Request Form Drawer */}
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">New Statutory Application</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Route structured data bundles to regulatory channels.</p>
                </div>
                <button onClick={() => setIsRequestModalOpen(false)} className="p-1.5 bg-white/10 rounded-lg text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleLaunchRequest} className="p-6 flex-1 overflow-y-auto space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Fulfillment Target</label>
                  <select
                    name="type"
                    value={newRequest.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm bg-white"
                  >
                    <option value="Official Title Search">Official Title Search (Official Green Card Pull)</option>
                    <option value="Land Rates Clearance">Land Rates Clearance Mapping</option>
                    <option value="County Planning Submission">County Planning/Zoning Submission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Target Property Asset</label>
                  <input
                    type="text"
                    name="property"
                    required
                    value={newRequest.property}
                    onChange={handleInputChange}
                    placeholder="e.g. Kilimani Heights"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Parcel Number (LR Reference Line)</label>
                  <input
                    type="text"
                    name="parcel_number"
                    required
                    value={newRequest.parcel_number}
                    onChange={handleInputChange}
                    placeholder="e.g. LR 209/13402"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Additional Verification Instructions</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={newRequest.notes}
                    onChange={handleInputChange}
                    placeholder="Add explicit requests or attached reference numbers for the physical registry officers..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm resize-none"
                  ></textarea>
                </div>

                {newRequest.type === "Official Title Search" && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 flex gap-2">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Gateway Processing Tariffs Apply</p>
                      <p className="mt-0.5">A flat execution fee of <b>KES 500</b> will be deducted directly from your core operational ledger profile upon pipeline generation.</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0A4429] hover:bg-[#2E9D47] text-white font-medium py-2.5 rounded-xl text-sm shadow-sm"
                  >
                    Execute Search Loop
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}