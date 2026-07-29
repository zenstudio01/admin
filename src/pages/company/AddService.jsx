import React, { useState } from "react";
import { Upload, ArrowLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/api";
import Layout from "../../layouts/Layout";
import Colors from "../../constants/colors"; // Make sure this path matches your project structure

export default function AddService() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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

  const pickImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = (e) => {
    e.stopPropagation();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview("");
  };

  const saveService = async (e) => {
    e.preventDefault();

    if (!title.trim() || !minimumPrice || !maximumPrice) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields (Title, Minimum Price, and Maximum Price).",
      });
      return;
    }

    if (parseFloat(minimumPrice) > parseFloat(maximumPrice)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Price Range",
        text: "Minimum price cannot be greater than maximum price.",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("minimum_price", minimumPrice);
      formData.append("maximum_price", maximumPrice);
      formData.append("duration", duration.trim());

      if (image) {
        formData.append("image", image);
      }

      await api.post("/create_company_service/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Service added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/company-services");
    } catch (e) {
      console.error("Error saving service:", e.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.response?.data?.message || "Unable to save service.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#F8FAFC" }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-slate-700 hover:bg-gray-50 transition shadow-2xs"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Add New Service
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create a new service listing for customers.
            </p>
          </div>
        </div>

        <form
          onSubmit={saveService}
          className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-10 max-w-4xl mx-auto space-y-6"
        >
          {/* Image Dropzone */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Service Image
            </label>

            <label className="relative border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden bg-gray-50 group">
              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full transition shadow-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="p-4 bg-white rounded-full shadow-2xs mb-3 group-hover:scale-105 transition-transform">
                    <Upload size={28} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Click to upload service image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, or WEBP up to 5MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={pickImage}
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Service Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              value={title}
              placeholder="e.g. Full House Deep Cleaning"
              onChange={(e) => setTitle(e.target.value)}
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
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              value={description}
              placeholder="Describe what is included in this service..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Prices */}
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
                  value={minimumPrice}
                  placeholder="5000"
                  onChange={(e) => setMinimumPrice(e.target.value)}
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
                  value={maximumPrice}
                  placeholder="10000"
                  onChange={(e) => setMaximumPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl py-4 pl-14 pr-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2 Hours, 1-2 Days"
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-2xs hover:opacity-90 transition disabled:opacity-50 mt-4"
            style={{ backgroundColor: Colors.primary }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Service
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}