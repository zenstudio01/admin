import React, { useState, useEffect } from "react";
import { 
  Wrench, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  UserPlus, 
  Building2, 
  Briefcase, 
  X,
  Phone,
  ShieldAlert,
  RefreshCw 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";
import api from "../../api/api";
import Colors from "../../constants/colors";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [availableWorkers, setAvailableWorkers] = useState([]);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatusRequest, setSelectedStatusRequest] = useState(null);
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchMaintenanceRequests();
    fetchProfessionals();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/property_manager_maintenance_requests/");
      setRequests(response.data.requests || []);

    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      Swal.fire({
        icon: "error",
        title: "Sync Error",
        text: "Failed to load maintenance requests.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await api.get("/get_company_professionals/");
      setAvailableWorkers(response.data.professionals || []);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  };

  const handleOpenDispatch = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleAssignWorker = async (worker) => {
    try {
      setIsUpdating(true);
      await api.put(
        `/assign_professional/${selectedRequest.id}/`,
        {
          professional_id: worker.id,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Professional Assigned",
        text: `${worker.name} has been assigned to this ticket.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      fetchMaintenanceRequests();

    } catch (error) {
      console.error("Error assigning worker:", error);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: "Unable to assign professional. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusModal = (request) => {
    setSelectedStatusRequest(request);
    setStatus(request.status);
    setStatusModalOpen(true);
  };

  const updateMaintenanceStatus = async () => {
    try {
      setIsUpdating(true);
      await api.put(
        `/update_maintenance_status/${selectedStatusRequest.id}/`,
        {
          status,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Maintenance request status updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setStatusModalOpen(false);
      fetchMaintenanceRequests();
    } catch (error) {
      console.error("Error updating maintenance status:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update maintenance status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const titleMatch = (r.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const propertyMatch = (r.property || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || propertyMatch;
    
    const matchesPriority = filterPriority === "All" || r.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        
        {/* Module Header Elements */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Maintenance Ops & Dispatch</h1>
          <p className="text-sm text-gray-500 mt-1">Track asset defects reported by owners or tenants and deploy verified service providers.</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Filter by issue title or building asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none text-sm transition focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {["All", "Emergency", "High", "Medium"].map((prio) => {
              const isSelected = filterPriority === prio;
              return (
                <button
                  key={prio}
                  onClick={() => setFilterPriority(prio)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected ? "text-white shadow-2xs" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{ backgroundColor: isSelected ? Colors.primary : undefined }}
                >
                  {prio}
                </button>
              );
            })}
          </div>
        </div>

        {/* Requests Dashboard Board */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div 
              className="h-8 w-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
            ></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Wrench size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">All Clear</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">No active maintenance flags or outstanding ticket streams found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((request) => (
              <div 
                key={request.id}
                className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Core Issue Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      request.priority === "Emergency" ? "bg-red-50 text-red-700 border border-red-100" :
                      request.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}>
                      <ShieldAlert size={10} />
                      {request.priority || "Medium"}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      request.status === "Open" || request.status === "pending" 
                        ? "bg-gray-100 text-gray-600" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-900">{request.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-3xl">{request.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1"><Building2 size={12} /> {request.property} — <b>{request.unit}</b></span>
                    <span>•</span>
                    <span>Reported by: <span className="text-gray-600 font-medium">{request.reportedBy || "Tenant"}</span></span>
                  </div>
                </div>

                {/* Tracking Assignments / Interaction Nodes */}
                <div className="border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50 min-w-[260px] space-y-3">
                  {request.status === "Assigned" || request.assignedTo ? (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl">
                      <CheckCircle size={16} style={{ color: Colors.primary }} />

                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          Assigned Fundi
                        </p>

                        <p className="text-xs font-bold text-slate-900">
                          {request.assignedTo || "Assigned Specialist"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenDispatch(request)}
                      className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-xs font-semibold transition hover:opacity-90 shadow-2xs"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      <UserPlus size={14} />
                      Assign Marketplace Fundi
                    </button>
                  )}

                  {/* Update Status Button */}
                  <button
                    onClick={() => openStatusModal(request)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow-2xs"
                  >
                    <RefreshCw size={14} />
                    Update Status
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}

        {/* Worker Dispatch Selection Drawer */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-2xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div 
                className="p-6 border-b border-gray-100 flex items-center justify-between text-white"
                style={{ backgroundColor: Colors.primary }}
              >
                <div>
                  <h3 className="text-lg font-bold">Assign Task Force</h3>
                  <p className="text-xs text-white/80 mt-0.5">Link verified task units to reported structures.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Resolution Ticket</p>
                <h4 className="font-bold text-slate-900 text-base mt-0.5">{selectedRequest.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{selectedRequest.property} • {selectedRequest.unit}</p>
              </div>

              {/* Provider Matches Feed */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recommended Specialists Nearby</h5>
                
                {availableWorkers.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No service professionals currently available.</p>
                ) : (
                  availableWorkers.map((worker) => (
                    <div 
                      key={worker.id}
                      className="border border-gray-100 rounded-xl p-4 bg-white transition-all shadow-xs space-y-3 hover:border-gray-300"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="font-bold text-gray-800 text-sm">{worker.name}</h6>
                          <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-md mt-1">
                            {worker.category || "General Maintenance"}
                          </span>
                        </div>
                        <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-100">
                          ★ {worker.rating || "5.0"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-50">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Briefcase size={12} /> {worker.type || "Specialist"}
                        </span>
                        <button
                          onClick={() => handleAssignWorker(worker)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-lg font-bold transition text-[11px] hover:opacity-90 disabled:opacity-50"
                          style={{ 
                            backgroundColor: `${Colors.primary}15`, 
                            color: Colors.primary 
                          }}
                        >
                          Book & Deploy
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-150">

            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Update Maintenance Status
            </h2>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm bg-white"
            >
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateMaintenanceStatus}
                disabled={isUpdating}
                className="flex-1 text-white font-medium py-3 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                style={{ backgroundColor: Colors.primary }}
              >
                {isUpdating ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
}