import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  Percent, 
  DollarSign, 
  X, 
  FileCheck, 
  ArrowUpRight 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";
import api from "../../api/api";

export default function Landlords() {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newLndlord, setNewLandlord] = useState({
    name: "",
    email: "",
    phone_number: "",
    commission_rate: "10", // Default MVP subscription/commission split floor
    assigned_properties: "",
  });

  useEffect(() => {
    fetchLandlords();
  }, []);

  const fetchLandlords = async () => {
    try {
      setLoading(true);

      const response = await api.get("/landlords/");
      setLandlords(response.data);

    } catch (error) {
      console.error("Error loading landlords database profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewLandlord({ ...newLndlord, [e.target.name]: e.target.value });
  };

  const handleAddLandlord = (e) => {
    e.preventDefault();
    
    const createdLandlord = {
      id: Date.now(),
      name: newLndlord.name,
      email: newLndlord.email,
      phone_number: newLndlord.phone_number,
      properties_count: newLndlord.assigned_properties ? newLndlord.assigned_properties.split(",").length : 0,
      total_units: 0,
      commission_rate: parseFloat(newLndlord.commission_rate) || 10,
      last_payout: "KES 0"
    };

    setLandlords([createdLandlord, ...landlords]);
    setIsModalOpen(false);
    setNewLandlord({ name: "", email: "", phone_number: "", commission_rate: "10", assigned_properties: "" });

    Swal.fire({
      icon: "success",
      title: "Asset Owner Added",
      text: "Landlord profile created successfully with standard commission tracking overrides.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const triggerPayoutSettlement = (landlord) => {
    Swal.fire({
      title: "Approve Disbursement",
      text: `Authorize monthly rental payment transfer to ${landlord.name} via configured bank account/M-Pesa wallet node?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2E9D47",
      cancelButtonColor: "#d33",
      confirmButtonText: "Disburse Funds"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Disbursed!", "The payout routing protocol has been successfully initiated.", "success");
      }
    });
  };

  const filteredLandlords = landlords.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Landlord Ledger</h1>
            <p className="text-sm text-gray-500 mt-1">Manage asset owners, custom commission contracts, and automated financial disbursements.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm self-start sm:self-center"
          >
            <Plus size={18} />
            <span>Add Asset Owner</span>
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search landlords by name or email details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Landlord Portfolio List Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLandlords.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Landlords Found</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">There are no asset owners connected or registered to your property system dashboard context yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredLandlords.map((landlord) => (
              <div 
                key={landlord.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow"
              >
                {/* Upper Details Panel */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A4429]/5 flex items-center justify-center text-[#0A4429] font-bold text-lg">
                      {landlord.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0A4429]">{landlord.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Mail size={12} /> {landlord.email}</span>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {landlord.phone_number}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-[#2E9D47]/10 text-[#0A4429] border border-[#2E9D47]/20 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 self-start sm:self-auto">
                    <Percent size={12} /> {landlord.commission_rate}% Commission Rate
                  </span>
                </div>

                {/* Mid Metric Distribution Matrix */}
                <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-50 py-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Building2 size={12} /> Buildings</p>
                    <p className="font-bold text-base text-[#0A4429] mt-1">{landlord.properties_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Units</p>
                    <p className="font-bold text-base text-[#0A4429] mt-1">{landlord.total_units || "--"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><DollarSign size={12} /> Last Payout</p>
                    <p className="font-bold text-base text-[#2E9D47] mt-1">{landlord.last_payout}</p>
                  </div>
                </div>

                {/* Footer Action Bars */}
                <div className="flex justify-between items-center gap-4 text-sm">
                  <button className="text-xs font-semibold text-gray-500 hover:text-[#0A4429] flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                    <FileCheck size={14} />
                    <span>View Financial Statements</span>
                  </button>
                  <button 
                    onClick={() => triggerPayoutSettlement(landlord)}
                    className="text-xs font-semibold bg-[#0A4429] hover:bg-[#2E9D47] text-white flex items-center gap-1 px-4 py-2 rounded-lg transition shadow-sm"
                  >
                    <span>Process Payout</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onboarding Form Sheet Drawer */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">Register Landlord Account</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Initialize external asset legal entities.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddLandlord} className="p-6 flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Legal / Corporate Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newLndlord.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Kobia"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={newLndlord.email}
                    onChange={handleInputChange}
                    placeholder="name@landlorddomain.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Phone Number (Payout Destination)</label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={newLndlord.phone_number}
                    onChange={handleInputChange}
                    placeholder="e.g. +254722111222"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Management Contract Commission Take Rate (%)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-xs font-semibold">%</span>
                    <input
                      type="number"
                      name="commission_rate"
                      required
                      min="10"
                      max="20"
                      value={newLndlord.commission_rate}
                      onChange={handleInputChange}
                      placeholder="Standard range: 10 - 20"
                      className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Based on UNIT core models, normal platform agency rates split between 10% and 20% total volume gross yield values.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Assign Initial Properties (Comma separated)</label>
                  <input
                    type="text"
                    name="assigned_properties"
                    value={newLndlord.assigned_properties}
                    onChange={handleInputChange}
                    placeholder="e.g. Kilimani Heights, Westlands Hub"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white font-medium py-2.5 rounded-xl text-sm"
                  >
                    Create Account
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