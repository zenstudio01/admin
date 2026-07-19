import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Grid, 
  Plus, 
  Users, 
  Search, 
  DollarSign, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  ImagePlus,
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";
import axios from "axios";
import api from "../../api/api"; 

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    total_units: "",
    property_type: "Residential",
    description: "",
  });

  // Fetch properties from Django backend
  useEffect(() => {
    fetchProperties();
  }, []);


  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response = await api.get("/property_list/");
      
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching portfolios from backend server", error);
      Swal.fire({
        icon: "error",
        title: "Sync Error",
        text: "Failed to retrieve your properties portfolio from the database.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
  };



  const handleAddProperty = async (e) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if(user.role != "property manager"){
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to add properties.",
        timer: 2000,
        showConfirmButton: false,
      });

      return;

    }

    e.preventDefault();
    setIsSaving(true);
    try {

      const formData = new FormData();

formData.append("name", newProperty.name);
formData.append("location", newProperty.location);
formData.append("total_units", newProperty.total_units);
formData.append("property_type", newProperty.property_type);
formData.append("description", newProperty.description);
formData.append("rent", newProperty.rent);
formData.append("deposit", newProperty.deposit);

selectedImages.forEach((image) => {
  formData.append("images", image);
});

const response = await api.post(
  "/property_create/",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
      
      setSelectedImages([]);
      setProperties([response.data, ...properties]);
      setIsModalOpen(false);
      setNewProperty({ name: "", location: "", total_units: "", property_type: "Residential", description: "" });

      Swal.fire({
        icon: "success",
        title: "Asset Registered",
        text: "The new property has been successfully added.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error committing asset allocation", error);
      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: error.response?.data?.message || "Something went wrong adding this property.",
      });
    }finally {
      setIsSaving(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Properties</h1>
            <p className="text-sm text-gray-500 mt-1">Manage physical real estate assets, tracking configurations, and tenants.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-[#2E9D47]/10 text-sm self-start sm:self-center"
          >
            <Plus size={18} />
            <span>Add Property</span>
          </button>
        </div>

        {/* Global Portfolio Search & Filter Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search assets by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#0A4429] border border-gray-200 rounded-lg hover:bg-gray-50 transition w-full md:w-auto justify-center">
            <SlidersHorizontal size={16} />
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* Portfolios Inventory View */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Assets Found</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">There are no properties matching your query or initialized inside your scope yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const occupancyRate = property.total_units > 0 
                ? Math.round((property.occupied_units / property.total_units) * 100) 
                : 0;

              return (
                <div 
                  key={property.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  {/* Card Header Content Banner */}
                  <div className="bg-[#0A4429]/5 p-5 border-b border-gray-50 relative">
                    <span className="absolute top-4 right-4 bg-white text-[#0A4429] font-medium text-xs px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
                      {property.property_type}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white rounded-xl text-[#2E9D47] border border-gray-100 shadow-sm">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0A4429] group-hover:text-[#2E9D47] transition-colors">{property.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />
                          {property.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Data Specifications Block */}
                  <div className="p-5 flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Grid size={12} /> Total Units</p>
                        <p className="font-bold text-lg text-[#0A4429] mt-0.5">{property.total_units}</p>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> Occupied</p>
                        <p className="font-bold text-lg text-[#0A4429] mt-0.5">{property.occupied_units}</p>
                      </div>
                    </div>

                    {/* Occupancy Indicator Status Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-gray-500">Occupancy Velocity</span>
                        <span className="text-[#2E9D47]">{occupancyRate}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full">
                        <div 
                          className="bg-[#2E9D47] h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${occupancyRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Yield (Est. Monthly)</p>
                        <p className="font-bold text-[#0A4429] text-base mt-0.5">{property.monthly_rent}</p>
                      </div>
                      <button className="flex items-center gap-1 font-semibold text-xs text-[#2E9D47] hover:text-[#0A4429] transition-colors bg-[#2E9D47]/5 px-3 py-1.5 rounded-lg group/btn">
                        <span>Configure Units</span>
                        <ChevronRight size={14} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Onboarding Drawer Side Sliding Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header Layout */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">Add New Property</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Initialize real estate infrastructure variables.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content Body Fields */}
              <form onSubmit={handleAddProperty} className="p-6 flex-1 overflow-y-auto space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Property / Building Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newProperty.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Kilimani Heights"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Location / Address</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={newProperty.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Kilimani, Nairobi"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Total Units</label>
                    <input
                      type="number"
                      name="total_units"
                      required
                      value={newProperty.total_units}
                      onChange={handleInputChange}
                      placeholder="e.g. 45"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Property Classification</label>
                    <select
                      name="property_type"
                      value={newProperty.property_type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm bg-white transition"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed Use">Mixed Use</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Rent per month</label>
                  <input
                    type="number"
                    name="rent"
                    required
                    value={newProperty.rent}
                    onChange={handleInputChange}
                    placeholder="e.g. 15000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Deposit</label>
                  <input
                    type="number"
                    name="deposit"
                    required
                    value={newProperty.deposit}
                    onChange={handleInputChange}
                    placeholder="e.g. 7500"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description (Optional)</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={newProperty.description}
                    onChange={handleInputChange}
                    placeholder="Brief structural notations or layout notes..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition resize-none"
                  ></textarea>
                </div>

                <div>
  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
    Property Images
  </label>

  <label className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E9D47] transition">

    <ImagePlus size={40} className="text-[#2E9D47]" />

    <p className="text-sm text-gray-500 mt-2">
      Click to upload images
    </p>

    <input
      type="file"
      multiple
      accept="image/*"
      hidden
      onChange={(e) =>
        setSelectedImages(Array.from(e.target.files))
      }
    />

  </label>

  {selectedImages.length > 0 && (
    <div className="grid grid-cols-3 gap-2 mt-4">

      {selectedImages.map((image, index) => (
        <img
          key={index}
          src={URL.createObjectURL(image)}
          alt=""
          className="w-full h-24 rounded-lg object-cover"
        />
      ))}

    </div>
  )}

</div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl transition text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white font-medium py-2.5 rounded-xl transition text-sm shadow-sm"
                  >
                    {isSaving ? (
                      <div className="flex justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     </div>
                     ) : "Add Property"
                    }
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