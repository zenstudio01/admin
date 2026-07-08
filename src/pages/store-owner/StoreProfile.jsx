import React, { useState, useEffect } from "react";
import { 
  Store, MapPin, FileText, Camera, Save, 
  RefreshCw, ShieldCheck, Building2, Globe, UploadCloud
} from "lucide-react";
import { Layout } from "lucide-react";
import axios from "axios";
import api from "../../api/api";
import Swal from "sweetalert2";

export default function StoreProfile() {
  const [activeTab, setActiveTab] = useState("general"); // general or legal
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Structural State Vectors
  const [formData, setFormData] = useState({
    name: "",
    location_desc: "",
    county: "Nairobi",
    description: "",
    till_number: "",
    phone_number: "",
  });

  const [files, setFiles] = useState({
    logo: null,
    business_permit: null,
    tax_cert: null
  });

  useEffect(() => {
    fetchStoreProfile();
  }, []);

  const fetchStoreProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/store/profile/`);
      
      const d = response.data;
      setFormData({
        name: d.name || "",
        location_desc: d.location_desc || "",
        county: d.county || "Nairobi",
        description: d.description || "",
        till_number: d.till_number || "",
        phone_number: d.phone_number || "",
      });
      if (d.logo_url) {
        setPreviewImage(d.logo_url);
      }
    } catch (error) {
      console.error("Failed fetching store configuration canvas:", error);
      Swal.fire("Error", "Could not retrieve store identity settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles(prev => ({ ...prev, [name]: file }));

      if (name === "logo") {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      // Multi-part form-data compiler setup
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (files.logo) data.append("logo", files.logo);
      if (files.business_permit) data.append("business_permit", files.business_permit);
      if (files.tax_cert) data.append("tax_cert", files.tax_cert);

      await api.put(`/store/profile/update/`, data, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      Swal.fire("Saved", "Store telemetry data updated across active node registries.", "success");
      fetchStoreProfile();
    } catch (error) {
      Swal.fire("Error", "Failed to preserve configuration edits.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F4F1E6]/30 flex justify-center items-center">
          <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans max-w-4xl mx-auto">
        
        {/* Module Meta Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Store Customization Core</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your outward brand interface identity parameters, physical geo-locations, and corporate documentation registers.</p>
          </div>
          <button onClick={fetchStoreProfile} className="p-2.5 bg-white border rounded-xl hover:bg-gray-50 transition text-gray-400">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Tab Selection Row Strip */}
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button 
            onClick={() => setActiveTab("general")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "general" ? "border-[#2E9D47] text-[#0A4429]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Store size={15} />
            <span>General Layout Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab("legal")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "legal" ? "border-[#2E9D47] text-[#0A4429]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <ShieldCheck size={15} />
            <span>Compliance Documents</span>
          </button>
        </div>

        {/* Core Profile Form Canvas wrapper */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
              
              {/* Profile Image Node Upload Picker */}
              <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                <div className="relative w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center group shrink-0">
                  {previewImage ? (
                    <img src={previewImage} alt="Store Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={32} className="text-gray-300" />
                  )}
                  <label className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
                    <Camera size={18} />
                    <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Shopfront Banner Identity</h4>
                  <p className="text-xs text-gray-400 mt-1">Accepts PNG, JPG format matrices up to 5MB. This brand mark will display across consumer invoicing blocks.</p>
                </div>
              </div>

              {/* General Form Inputs Grid Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Registered Retail Shop Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleTextChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="e.g. Ushindi Wholesalers" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Geographic Operational County *</label>
                  <select name="county" value={formData.county} onChange={handleTextChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:border-[#2E9D47]">
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Uasin Gishu">Uasin Gishu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Store Support Phone Node</label>
                  <input type="text" name="phone_number" value={formData.phone_number} onChange={handleTextChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="e.g. 0712345678" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Integrated M-Pesa Till / Shortcode Pipeline</label>
                  <input type="text" name="till_number" value={formData.till_number} onChange={handleTextChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-[#2E9D47]" placeholder="e.g. 5432101" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-sans flex items-center gap-1">
                  <MapPin size={14} className="text-[#2E9D47]" /> Precise Location Description / Building Coordinates
                </label>
                <input type="text" name="location_desc" value={formData.location_desc} onChange={handleTextChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="e.g., Block B, Ground Floor Shop No. 4, Tom Mboya Street, CBD" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Store Tagline Description Bio</label>
                <textarea rows={4} name="description" value={formData.description} onChange={handleTextChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="Brief baseline detailing catalog matrices or business operational rules..." />
              </div>

            </div>
          )}

          {activeTab === "legal" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
              <div className="flex gap-3 bg-green-50/50 p-4 border border-green-100 rounded-xl text-xs text-green-800">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Compliance Documentation Check</h5>
                  <p className="mt-0.5 leading-relaxed">Verification elements maintain security validations. Active document storage pipelines enable priority settlements, merchant escrows, and expanded financial counter limit authorizations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File Upload Slot 1 */}
                <div className="border border-dashed border-gray-200 p-5 rounded-2xl text-center hover:bg-gray-50/50 transition relative">
                  <UploadCloud size={28} className="mx-auto text-gray-400 mb-2" />
                  <h5 className="text-xs font-bold text-gray-700">County Single Business Permit</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">PDF or structural scan file format variants (Max 10MB)</p>
                  <label className="mt-3 inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">
                    {files.business_permit ? files.business_permit.name : "Select File Block"}
                    <input type="file" name="business_permit" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* File Upload Slot 2 */}
                <div className="border border-dashed border-gray-200 p-5 rounded-2xl text-center hover:bg-gray-50/50 transition relative">
                  <UploadCloud size={28} className="mx-auto text-gray-400 mb-2" />
                  <h5 className="text-xs font-bold text-gray-700">KRA Tax Compliance Certificate</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">PDF or structural scan file format variants (Max 10MB)</p>
                  <label className="mt-3 inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">
                    {files.tax_cert ? files.tax_cert.name : "Select File Block"}
                    <input type="file" name="tax_cert" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* Persistent Form Execution Tray Bar */}
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] disabled:bg-gray-400 text-white font-bold text-xs tracking-wide uppercase px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={15} />
              )}
              <span>Commit Settings Modification</span>
            </button>
          </div>

        </form>

      </div>
    </Layout>
  );
}