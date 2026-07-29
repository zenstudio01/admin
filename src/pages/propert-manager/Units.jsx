import { useEffect, useMemo, useState } from "react";
import {
  Search,
  BedDouble,
  Bath,
  Users,
  Pencil,
  Building2,
  X,
  Save,
  Plus
} from "lucide-react";
import api from "../../api/api";
import Layout from "../../layouts/Layout";
import Colors from "../../constants/colors";
import Swal from "sweetalert2";

export default function Units() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [units, setUnits] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [amenity, setAmenity] = useState("");

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/units/get_my_units/`);
      setUnits(res.data.units || []);
    } catch (err) {
      console.error("Error fetching units:", err);
      Swal.fire({
        icon: "error",
        title: "Sync Error",
        text: "Unable to retrieve unit records.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const unitName = unit.name || "";
      const propertyName = unit.property_name || "";

      const searchMatch =
        unitName.toLowerCase().includes(search.toLowerCase()) ||
        propertyName.toLowerCase().includes(search.toLowerCase());

      const filterMatch = filter === "all" || unit.status === filter;

      return searchMatch && filterMatch;
    });
  }, [units, search, filter]);

  const openEdit = (unit) => {
    setSelectedUnit({ ...unit });
    setSelectedImages([]);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const addAmenity = () => {
    if (!amenity.trim()) return;

    setSelectedUnit((prev) => ({
      ...prev,
      amenities: [...(prev.amenities || []), amenity.trim()],
    }));

    setAmenity("");
  };

  const removeAmenity = (index) => {
    setSelectedUnit((prev) => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_, i) => i !== index),
    }));
  };

  const saveUnit = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      formData.append("name", selectedUnit.name || "");
      formData.append("description", selectedUnit.description || "");
      formData.append("price_per_month", selectedUnit.price_per_month || 0);
      formData.append("bedrooms", selectedUnit.bedrooms || 0);
      formData.append("bathrooms", selectedUnit.bathrooms || 0);
      formData.append("max_guests", selectedUnit.max_guests || 0);
      formData.append("status", selectedUnit.status || "available");

      // Upload new images if present
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // Add amenities
      formData.append(
        "amenities",
        JSON.stringify(selectedUnit.amenities || [])
      );

      await api.put(`/units/update_unit/${selectedUnit.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Unit Updated",
        text: "Unit details have been successfully saved.",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchUnits();
    } catch (err) {
      console.error("Error saving unit:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update unit information. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20 min-h-screen" style={{ backgroundColor: Colors.background || "#FFFFFF" }}>
          <div 
            className="h-8 w-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
          ></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div 
        className="p-4 md:p-8 min-h-screen font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Units</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and update all structure rental unit profiles.</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 flex items-center mb-6">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search units by name or property..."
            className="flex-1 ml-3 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "available", "occupied", "under_maintenance"].map((status) => {
            const isSelected = filter === status;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                  isSelected
                    ? "text-white shadow-2xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                style={{ backgroundColor: isSelected ? Colors.primary : undefined }}
              >
                {status.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>

        {/* Units Portfolio Grid */}
        {filteredUnits.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Units Available</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">There are no units matching your specified query context.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-8">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={
                    unit.images && unit.images.length > 0
                      ? unit.images[0]
                      : "https://placehold.co/600x400?text=No+Unit+Image"
                  }
                  alt={unit.name}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h2 className="font-bold text-xl text-slate-900">{unit.name}</h2>
                      <p className="text-gray-500 text-xs mt-1 flex items-center">
                        <Building2 size={14} className="mr-1 text-gray-400" />
                        {unit.property_name || "Unassigned Property"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        unit.status === "available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : unit.status === "occupied"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {(unit.status || "").replace(/_/g, " ")}
                    </span>
                  </div>

                  <h3 className="font-bold text-2xl mt-5" style={{ color: Colors.primary }}>
                    KES {Number(unit.price_per_month || 0).toLocaleString()}
                    <span className="text-sm font-normal text-gray-500"> / month</span>
                  </h3>

                  <div className="flex justify-between mt-6 text-gray-600 text-xs border-t border-gray-50 pt-4">
                    <div className="flex items-center" title="Bedrooms">
                      <BedDouble size={16} className="text-gray-400" />
                      <span className="ml-1.5 font-medium">{unit.bedrooms || 0} Beds</span>
                    </div>

                    <div className="flex items-center" title="Bathrooms">
                      <Bath size={16} className="text-gray-400" />
                      <span className="ml-1.5 font-medium">{unit.bathrooms || 0} Baths</span>
                    </div>

                    <div className="flex items-center" title="Max Capacity">
                      <Users size={16} className="text-gray-400" />
                      <span className="ml-1.5 font-medium">{unit.max_guests || 0} Guests</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openEdit(unit)}
                    className="mt-6 w-full text-white py-3 rounded-xl flex justify-center items-center text-xs font-bold transition hover:opacity-90 shadow-2xs"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    <Pencil size={14} />
                    <span className="ml-2">Edit Unit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Unit Modal */}
        {showModal && selectedUnit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
              
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-slate-900">Edit Unit Profile</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Unit Label / Number</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm transition focus:border-transparent"
                    placeholder="e.g. Apartment 4B"
                    value={selectedUnit.name || ""}
                    onChange={(e) =>
                      setSelectedUnit({ ...selectedUnit, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm transition focus:border-transparent"
                    rows="3"
                    placeholder="Unit features or specifications..."
                    value={selectedUnit.description || ""}
                    onChange={(e) =>
                      setSelectedUnit({ ...selectedUnit, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Monthly Rent (KES)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm transition focus:border-transparent"
                    placeholder="e.g. 25000"
                    value={selectedUnit.price_per_month || ""}
                    onChange={(e) =>
                      setSelectedUnit({ ...selectedUnit, price_per_month: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm"
                      placeholder="Beds"
                      value={selectedUnit.bedrooms || ""}
                      onChange={(e) =>
                        setSelectedUnit({ ...selectedUnit, bedrooms: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm"
                      placeholder="Baths"
                      value={selectedUnit.bathrooms || ""}
                      onChange={(e) =>
                        setSelectedUnit({ ...selectedUnit, bathrooms: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Max Guests</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm"
                      placeholder="Guests"
                      value={selectedUnit.max_guests || ""}
                      onChange={(e) =>
                        setSelectedUnit({ ...selectedUnit, max_guests: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Occupancy Status</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none text-sm bg-white"
                    value={selectedUnit.status || "available"}
                    onChange={(e) =>
                      setSelectedUnit({ ...selectedUnit, status: e.target.value })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>

                {/* Amenities Manager */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Amenities & Features
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => setAmenity(e.target.value)}
                      placeholder="e.g. High-Speed WiFi, Balcony"
                      className="flex-1 border border-gray-200 rounded-xl p-3 text-sm outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedUnit.amenities?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-3 py-1 text-xs font-medium"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload Gallery */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Unit Media
                  </label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-xl file:border-0
                               file:text-xs file:font-semibold
                               file:bg-gray-100 file:text-slate-700
                               hover:file:bg-gray-200
                               file:cursor-pointer cursor-pointer"
                  />

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {/* Display existing images if no new ones picked */}
                    {selectedImages.length === 0 &&
                      selectedUnit.images?.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          className="h-24 w-full rounded-xl object-cover border border-gray-100"
                          alt="Unit preview"
                        />
                      ))}

                    {/* Preview new selected files */}
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          className="h-24 w-full rounded-xl object-cover border border-gray-100"
                          alt="New preview"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImages(
                              selectedImages.filter((_, i) => i !== index)
                            )
                          }
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveUnit}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                  style={{ backgroundColor: Colors.primary }}
                >
                  {isSaving ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}