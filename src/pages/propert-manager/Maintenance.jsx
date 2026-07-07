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
  ShieldAlert
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  // Mock list of available localized service providers/workers from the marketplace network
  const availableWorkers = [
    { id: 101, name: "Fundi Kakamega Plumbers", category: "Plumbing", rating: "4.8", phone: "+254711223344", type: "Organization" },
    { id: 102, name: "Juma Electricals", category: "Electrical", rating: "4.9", phone: "+254722556677", type: "Individual Specialist" },
    { id: 103, name: "Nairobi Paint & Masonry Ltd", category: "Masonry/Painting", rating: "4.6", phone: "+254733889900", type: "Organization" },
  ];

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      
      // Seed data representing active structural reports inside pilot buildings
      const fallbackRequests = [
        { id: 1, title: "Main Water Line Burst", property: "Kilimani Heights", unit: "Block B Area", reportedBy: "Dr. Kobia (Landlord)", priority: "Emergency", status: "Open", description: "Water leaking heavily from the ceiling joints, risking lower unit flooding." },
        { id: 2, title: "Elevator Power Tripping", property: "The Westlands Hub", unit: "Main Elevator Shaft", reportedBy: "Nairobi Corporate Holdings", priority: "High", status: "Open", description: "Breaker switch trips repeatedly during peak operation hours." },
        { id: 3, title: "Balcony Railing Loose", property: "Kilimani Heights", unit: "Unit A-12", reportedBy: "Alex Njuguna (Tenant)", priority: "Medium", status: "Assigned", assignedTo: "Nairobi Paint & Masonry Ltd", description: "Rust has structurally compromised the anchoring bolts on the external balcony frame." },
      ];

      setRequests(fallbackRequests);
    } catch (error) {
      console.error("Error loading maintenance streams", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDispatch = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleAssignWorker = (worker) => {
    // Dynamically map assigned entity data back into memory state tracking arrays
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return { 
          ...req, 
          status: "Assigned", 
          assignedTo: worker.name 
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    setIsModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Service Worker Dispatched",
      text: `${worker.name} has been assigned to resolve the "${selectedRequest.title}" request.`,
      confirmButtonColor: "#2E9D47",
    });
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || r.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Maintenance Ops & Dispatch</h1>
          <p className="text-sm text-gray-500 mt-1">Track asset defects reported by owners or tenants and deploy verified service providers.</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Filter by issue title or building asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {["All", "Emergency", "High", "Medium"].map((prio) => (
              <button
                key={prio}
                onClick={() => setFilterPriority(prio)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterPriority === prio
                    ? "bg-[#0A4429] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {prio}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Dashboard Board */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Wrench size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">All Clear</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">No active maintenance flags or outstanding ticket streams found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((request) => (
              <div 
                key={request.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow"
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
                      {request.priority}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      request.status === "Open" ? "bg-gray-100 text-gray-600" : "bg-green-50 text-green-700"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-[#0A4429]">{request.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-3xl">{request.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1"><Building2 size={12} /> {request.property} — <b>{request.unit}</b></span>
                    <span>•</span>
                    <span>Reported by: <span className="text-gray-600 font-medium">{request.reportedBy}</span></span>
                  </div>
                </div>

                {/* Tracking Assignments / Interaction Nodes */}
                <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50 justify-between lg:justify-end min-w-[240px]">
                  {request.status === "Assigned" ? (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl w-full lg:w-auto">
                      <CheckCircle size={16} className="text-[#2E9D47]" />
                      <div className="text-left">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Assigned Provider</p>
                        <p className="text-xs font-bold text-[#0A4429]">{request.assignedTo}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenDispatch(request)}
                      className="flex items-center justify-center gap-2 bg-[#0A4429] hover:bg-[#2E9D47] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm w-full lg:w-auto"
                    >
                      <UserPlus size={14} />
                      <span>Dispatch Marketplace Fundi</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Worker Dispatch Selection Slider Drawer */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">Assign Task Force</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Link verified task units to reported structures.</p>
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
                <h4 className="font-bold text-[#0A4429] text-base mt-0.5">{selectedRequest.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{selectedRequest.property} • {selectedRequest.unit}</p>
              </div>

              {/* Provider Matches Feed */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recommended Specialists Nearby</h5>
                
                {availableWorkers.map((worker) => (
                  <div 
                    key={worker.id}
                    className="border border-gray-100 rounded-xl p-4 bg-white hover:border-[#2E9D47] transition-all shadow-xs space-y-3 group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h6 className="font-bold text-gray-800 text-sm group-hover:text-[#2E9D47] transition-colors">{worker.name}</h6>
                        <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-md mt-1">
                          {worker.category}
                        </span>
                      </div>
                      <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-100">
                        ★ {worker.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-50">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Briefcase size={12} /> {worker.type}
                      </span>
                      <button
                        onClick={() => handleAssignWorker(worker)}
                        className="bg-[#2E9D47]/10 text-[#0A4429] hover:bg-[#0A4429] hover:text-white px-3 py-1.5 rounded-lg font-bold transition text-[11px]"
                      >
                        Book & Deploy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}