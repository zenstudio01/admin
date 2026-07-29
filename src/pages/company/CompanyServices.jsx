import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Clock,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/api";
import Layout from "../../layouts/Layout";
import Colors from "../../constants/colors"; // Make sure this path is correct

export default function CompanyServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(services);
      return;
    }
    setFiltered(
      services.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, services]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin_get_company_services/");
      
      const fetchedServices = response.data?.services || [];
      setServices(fetchedServices);
      setFiltered(fetchedServices);
    } catch (error) {
      console.error("Failed to load services:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load company services.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    const result = await Swal.fire({
      title: "Delete Service?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // Rose 600
      cancelButtonColor: "#9ca3af", // Gray 400
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/delete_company_service/${id}/`);
      
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Service has been removed successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optimistically update UI instead of full reload for better UX
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete service:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Unable to delete service.",
      });
    }
  };

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#F8FAFC" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Company Services
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all services offered by your company.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-service")}
            className="self-start sm:self-auto text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-2xs hover:opacity-90 transition"
            style={{ backgroundColor: Colors.primary }}
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 mt-4 p-2 flex items-center focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
          <div className="pl-3 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="ml-3 w-full bg-transparent outline-none p-2 text-sm text-slate-700 placeholder-gray-400"
            placeholder="Search for a service by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div 
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-12 text-center mt-8 flex flex-col items-center justify-center min-h-[40vh]">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Tag size={48} className="text-gray-300" />
            </div>
            <h2 className="font-bold text-xl text-slate-800">
              {search ? "No matches found" : "No Services Available"}
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              {search 
                ? `We couldn't find any services matching "${search}". Try adjusting your search.` 
                : "You haven't added any services yet. Click the 'Add Service' button to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl shadow-2xs overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full bg-gray-100 shrink-0">
                  <img
                    src={service.image || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold capitalize shadow-xs">
                      {service.category || "Uncategorized"}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-bold text-lg md:text-xl text-slate-900 leading-tight">
                      {service.title}
                    </h2>
                    
                    {/* Status Badge */}
                    <div className="shrink-0 ml-2 mt-1">
                      {service.is_active ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-100">
                          <ToggleRight size={14} /> Active
                        </span>
                      ) : (
                        <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-rose-100">
                          <ToggleLeft size={14} /> Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {service.description || "No description provided."}
                  </p>

                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs font-medium text-gray-500">
                      <Clock size={15} className="mr-2 text-gray-400" />
                      Duration: {service.duration || "N/A"}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-gray-400">KES</span>
                      <p 
                        className="font-black text-lg md:text-xl"
                        style={{ color: Colors.primary }}
                      >
                        {Number(service.minimum_price || 0).toLocaleString()} - {Number(service.maximum_price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6 pt-2">
                    <button
                      onClick={() => navigate(`/company/edit-service/${service.id}`)}
                      className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-colors"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-colors"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
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