import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";
import Swal from "sweetalert2";
import {
  Megaphone,
  Plus,
  Trash2,
  Pencil,
  Building2,
  Home,
  Globe,
  X,
  Send,
} from "lucide-react";

export default function Announcements() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    target: "all",
    property_id: "",
    unit_id: "",
  });

  useEffect(() => {
    loadAnnouncements();
    loadProperties();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/get_announcements/");
      setAnnouncements(res.data.announcements || []);
    } catch (e) {
      console.error("Error loading announcements:", e);
      Swal.fire({
        icon: "error",
        title: "Sync Error",
        text: "Could not retrieve announcements.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const res = await api.get("/property_list/");
      setProperties(res.data || []);
    } catch (e) {
      console.error("Error loading properties:", e);
    }
  };

  const loadUnits = async (propertyId) => {
    if (!propertyId) {
      setUnits([]);
      return;
    }
    try {
      const res = await api.get(`/property_units/${propertyId}/`);
      setUnits(res.data.units || []);
    } catch (e) {
      console.error("Error loading units:", e);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      target: "all",
      property_id: "",
      unit_id: "",
    });
    setEditingId(null);
    setUnits([]);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      message: item.message || "",
      target: item.target || "all",
      property_id: item.property_id || "",
      unit_id: item.unit_id || "",
    });

    if (item.property_id) {
      loadUnits(item.property_id);
    }

    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/update_announcement/${editingId}/`, form);
        Swal.fire({
          icon: "success",
          title: "Announcement Updated",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await api.post("/create_announcement/", form);
        Swal.fire({
          icon: "success",
          title: "Announcement Published",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setModalOpen(false);
      resetForm();
      loadAnnouncements();
    } catch (e) {
      console.error("Error saving announcement:", e);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: e.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAnnouncement = (id) => {
    Swal.fire({
      title: "Delete announcement?",
      text: "This notification will no longer be visible to tenants.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await api.delete(`/delete_announcement/${id}/`);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1500,
          showConfirmButton: false,
        });
        loadAnnouncements();
      } catch (e) {
        console.error("Error deleting announcement:", e);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Could not remove this announcement.",
        });
      }
    });
  };

  if (loading) {
    return (
      <Layout>
        <div
          className="flex justify-center items-center min-h-screen"
          style={{ backgroundColor: Colors.background || "#FFFFFF" }}
        >
          <div
            className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${Colors.primary} transparent transparent transparent`,
            }}
          ></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Announcements
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Broadcast circulars, notices, and updates to your tenants.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition hover:opacity-90 shadow-2xs shrink-0"
            style={{ backgroundColor: Colors.primary }}
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>

        {/* Announcement Feed */}
        {announcements.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Megaphone size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">
              No Announcements Found
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You haven't dispatched any notices to tenants yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-line">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold">
                      {item.target === "all" && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          <Globe size={14} />
                          All Tenants
                        </span>
                      )}

                      {item.target === "property" && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Building2 size={14} />
                          {item.property || "Property Scope"}
                        </span>
                      )}

                      {item.target === "unit" && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                          <Home size={14} />
                          {item.unit || "Unit Scope"}
                        </span>
                      )}

                      <span className="text-gray-400 font-normal">
                        Published: {item.created_at || "Just now"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Notice"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteAnnouncement(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Notice"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create or Edit Announcement */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? "Edit Announcement" : "Create Announcement"}
                </h2>

                <button
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Notice Title
                  </label>
                  <input
                    required
                    placeholder="e.g. Scheduled Water Maintenance"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Notice Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter announcement instructions or context..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Audience Target
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white"
                    value={form.target}
                    onChange={(e) =>
                      setForm({ ...form, target: e.target.value })
                    }
                  >
                    <option value="all">All Tenants Across Properties</option>
                    <option value="property">Specific Property</option>
                    <option value="unit">Specific Unit</option>
                  </select>
                </div>

                {/* Target Scope: Property Selection */}
                {(form.target === "property" || form.target === "unit") && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Property
                    </label>
                    <select
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white"
                      value={form.property_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, property_id: val, unit_id: "" });
                        loadUnits(val);
                      }}
                    >
                      <option value="">Select Target Property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Target Scope: Unit Selection */}
                {form.target === "unit" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Unit
                    </label>
                    <select
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white"
                      value={form.unit_id}
                      onChange={(e) =>
                        setForm({ ...form, unit_id: e.target.value })
                      }
                    >
                      <option value="">Select Target Unit</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unit_number || unit.name || `Unit ${unit.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      resetForm();
                    }}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    {submitting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={16} />
                        {editingId ? "Save Changes" : "Send Announcement"}
                      </>
                    )}
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