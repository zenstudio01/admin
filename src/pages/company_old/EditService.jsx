import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Loader2,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Swal from "sweetalert2";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors"; // Ensures design consistency across all screens

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [service, setService] = useState({
    title: "",
    description: "",
    category: "other",
    minimum_price: "",
    maximum_price: "",
    duration: "",
    image: "",
    is_active: true,
  });

  const categories = [
    "plumbing",
    "electrical",
    "cleaning",
    "painting",
    "roofing",
    "carpentry",
    "moving",
    "security",
    "internet",
    "other",
  ];

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/get_company_service/${id}/`);
      if (response.data?.service) {
        setService(response.data.service);
      }
    } catch (error) {
      console.error("Error loading service details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load service details.",
      });
    }finally {
      setFetching(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setService((prev) => ({
          ...prev,
          image: data.secure_url,
        }));
      } else {
        throw new Error("Upload response missing secure URL.");
      }
    } catch (e) {
      console.error("Image upload error:", e);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service.title?.trim() || !service.minimum_price || !service.maximum_price) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields (Title, Minimum Price, Maximum Price).",
      });
      return;
    }

    if (parseFloat(service.minimum_price) > parseFloat(service.maximum_price)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Price Range",
        text: "Minimum price cannot be greater than maximum price.",
      });
      return;
    }

    try {
      setLoading(true);

      await api.put(`/update_company_service/${id}/`, service);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Service updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/company-services");
    } catch (error) {
      console.error("Error updating service:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Unable to update service.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${Colors.primary || "#0A4429"} transparent transparent transparent`,
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#F8FAFC" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-slate-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Edit Service
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Update service details, pricing, or active status.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
              {/* Service Title */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Service Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) =>
                    setService({ ...service, title: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Service Name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={service.description || ""}
                  onChange={(e) =>
                    setService({ ...service, description: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Describe your service..."
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Category
                  </label>
                  <select
                    value={service.category}
                    onChange={(e) =>
                      setService({ ...service, category: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={service.duration || ""}
                    onChange={(e) =>
                      setService({ ...service, duration: e.target.value })
                    }
                    placeholder="e.g. 2 Hours"
                    className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Minimum & Maximum Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Minimum Price (KES) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-bold text-gray-400">
                      KES
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={service.minimum_price}
                      onChange={(e) =>
                        setService({
                          ...service,
                          minimum_price: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 rounded-2xl py-4 pl-14 pr-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Maximum Price (KES) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm font-bold text-gray-400">
                      KES
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={service.maximum_price}
                      onChange={(e) =>
                        setService({
                          ...service,
                          maximum_price: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 rounded-2xl py-4 pl-14 pr-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Service Image Section */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Service Image
                </label>

                {service.image ? (
                  <div className="relative w-full max-w-sm h-48 rounded-2xl overflow-hidden border border-gray-200 mb-4 group shadow-2xs">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setService({ ...service, image: "" })}
                      className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full transition shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50 rounded-3xl h-44 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <div className="p-3 bg-white rounded-full shadow-2xs mb-2 group-hover:scale-105 transition-transform">
                      {uploading ? (
                        <Loader2 size={24} className="animate-spin text-emerald-600" />
                      ) : (
                        <Upload size={24} className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {uploading ? "Uploading Image..." : "Upload New Image"}
                    </span>
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => uploadImage(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              {/* Service Active Toggle */}
              <div
                onClick={() =>
                  setService({ ...service, is_active: !service.is_active })
                }
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer border border-gray-100 hover:bg-gray-100/60 transition"
              >
                {service.is_active ? (
                  <ToggleRight size={28} className="text-emerald-600" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Service Active
                  </p>
                  <p className="text-xs text-gray-500">
                    Inactive services will be hidden from customer search results.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-2xs hover:opacity-90 transition disabled:opacity-50 mt-6"
                style={{ backgroundColor: Colors.primary }}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}