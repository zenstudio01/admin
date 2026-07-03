import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Search, 
  Calendar, 
  ShieldCheck, 
  Scale, 
  Compass, 
  Map, 
  FileText, 
  Clock, 
  X, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Layout from "../layouts/Layout";
import Swal from "sweetalert2";

export default function ProfessionalServices() {
  const [experts, setExperts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [bookingDetails, setBookingDetails] = useState({
    property: "",
    milestone_note: "",
    preferred_date: "",
  });

  useEffect(() => {
    fetchProfessionalNetwork();
  }, []);

  const fetchProfessionalNetwork = async () => {
    try {
      setLoading(true);
      
      // Verified expert network dataset
      const fallbackExperts = [
        { id: 201, name: "Wanyama & Associates Advocates", category: "Legal / Conveyancing", experience: "12 Yrs", rate: "KES 45,000 / Retainer", icon: Scale, verified: true, billing: "Escrow Verified" },
        { id: 202, name: "Nairobi Valuers & Surveyors Ltd", category: "Valuation & Surveying", experience: "8 Yrs", rate: "KES 30,000 / Plot", icon: Map, verified: true, billing: "Milestone Contract" },
        { id: 203, name: "ArchStudio Kenya", category: "Architecture & Design", experience: "15 Yrs", rate: "KES 4,000 / Hr", icon: Compass, verified: true, billing: "Fixed Quote Basis" },
      ];

      const fallbackBookings = [
        { id: 1, expert: "Wanyama & Associates Advocates", task: "Title Deed Rectification & Search", property: "Kilimani Heights", date: "2026-07-10", status: "Awaiting Escrow Deposit" },
        { id: 2, expert: "Nairobi Valuers & Surveyors Ltd", task: "Boundary Beacon Verification", property: "Ngong Road Arcade", date: "2026-06-20", status: "Completed" }
      ];

      setExperts(fallbackExperts);
      setBookings(fallbackBookings);
    } catch (error) {
      console.error("Error reading professional registry framework", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (expert) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();

    const newEntry = {
      id: Date.now(),
      expert: selectedExpert.name,
      task: `${selectedExpert.category} Consultation Setup`,
      property: bookingDetails.property,
      date: bookingDetails.preferred_date,
      status: "Awaiting Escrow Deposit"
    };

    setBookings([newEntry, ...bookings]);
    setIsModalOpen(false);
    setBookingDetails({ property: "", milestone_note: "", preferred_date: "" });

    Swal.fire({
      icon: "success",
      title: "Engagement Initialized",
      text: "Booking registered. Please configure deposit streams inside the Finance Reconciler to begin work routing pipelines.",
      confirmButtonColor: "#2E9D47"
    });
  };

  const filteredExperts = experts.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || exp.category.includes(activeCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Professional Services Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Contract verified structural engineers, valuers, boundary surveyors, and corporate lawyers.</p>
        </div>

        {/* Live Active Engagements Pipeline Dashboard */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-8">
          <h3 className="text-sm font-bold text-[#0A4429] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[#2E9D47]" /> Active Statutory & Advisory Logs
          </h3>
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
                <div>
                  <div className="font-bold text-gray-800">{b.task}</div>
                  <div className="text-xs text-gray-400 mt-1">Vendor: <span className="text-[#0A4429] font-medium">{b.expert}</span> • Target: <b>{b.property}</b></div>
                </div>
                <div className="flex items-center gap-4 justify-between md:justify-end">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {b.date}</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "Completed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {b.status === "Completed" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Engine Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search via names, expertise definitions, licenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {["All", "Legal", "Valuation", "Architecture"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat || (cat === "All" && activeCategory === "All")
                    ? "bg-[#0A4429] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "All" ? "Show All Network Experts" : `${cat} Specialists`}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Experts Grid Mapping */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Specialists Matching Found</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">Refine search values or adjust the dynamic filter arrays above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => {
              const IconComponent = expert.icon;
              return (
                <div key={expert.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-[#0A4429]/5 text-[#0A4429] rounded-xl group-hover:bg-[#2E9D47] group-hover:text-white transition-all">
                        <IconComponent size={22} />
                      </div>
                      {expert.verified && (
                        <span className="bg-green-50 text-green-700 font-semibold text-[10px] px-2 py-0.5 rounded border border-green-100 flex items-center gap-1 uppercase tracking-wider">
                          <ShieldCheck size={12} /> Verified Member
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">{expert.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{expert.category} • Experience: {expert.experience}</p>
                    </div>

                    <div className="text-xs font-bold text-[#0A4429] bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100/50">
                      <span>Rate Base:</span>
                      <span className="text-gray-800">{expert.rate}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between text-xs">
                    <span className="text-gray-400 italic">{expert.billing}</span>
                    <button 
                      onClick={() => handleOpenBooking(expert)}
                      className="bg-[#0A4429] hover:bg-[#2E9D47] text-white font-bold px-4 py-2 rounded-xl transition shadow-xs"
                    >
                      Book Professional
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Escrow Booking Selection Form Drawer */}
        {isModalOpen && selectedExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">Initialize Project Escrow</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Secure professional assignment conditions inside the system loop.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-white/10 rounded-lg text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 bg-gray-50/50 border-b border-gray-100 text-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Contractor Unit</p>
                <p className="font-bold text-[#0A4429] text-base mt-0.5">{selectedExpert.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selectedExpert.rate}</p>
              </div>

              <form onSubmit={handleCreateBooking} className="p-6 flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Target Asset Mapped</label>
                  <input
                    type="text"
                    required
                    value={bookingDetails.property}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, property: e.target.value })}
                    placeholder="e.g. Kilimani Heights"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Preferred Execution Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDetails.preferred_date}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, preferred_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm text-gray-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Scope of Operations / Project Description</label>
                  <textarea
                    rows="4"
                    required
                    value={bookingDetails.milestone_note}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, milestone_note: e.target.value })}
                    placeholder="Provide detailed instruction outlines regarding titles, zoning requirements, survey anchors or valuer targets..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm resize-none"
                  ></textarea>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 space-y-1">
                  <p className="font-bold uppercase tracking-wider flex items-center gap-1">🔒 Safe-Escrow Framework Active</p>
                  <p>Funds remain securely held until milestone sign-offs are confirmed by the property manager or neutral arbitrator metrics.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white font-medium py-2.5 rounded-xl text-sm shadow-sm"
                  >
                    Lock Scope Order
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