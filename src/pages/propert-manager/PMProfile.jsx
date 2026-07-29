import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  Calendar,
  Shield,
  Lock,
  Home,
  Building,
  Users,
  CheckCircle,
  Edit,
  X,
  Camera,
} from "lucide-react";

export default function PMProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Edit Modal & Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone_number: "",
    company: "",
    national_id: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/property_manager_profile/");
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching PM profile:", err);
      Swal.fire({
        icon: "error",
        title: "Load Error",
        text: "Failed to retrieve property manager profile details.",
        timer: 2500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (!profile?.user) return;
    setEditFormData({
      name: profile.user.name || "",
      phone_number: profile.user.phone_number || "",
      company: profile.user.company || "",
      national_id: profile.user.national_id || "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("phone_number", editFormData.phone_number);
      formData.append("company", editFormData.company);
      formData.append("national_id", editFormData.national_id);

      if (selectedImage) {
        formData.append("profile_image", selectedImage);
      }

      await api.put("/update_property_manager_profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile details have been saved.",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowEditModal(false);
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update profile details. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div 
          className="flex justify-center items-center h-[70vh] min-h-screen"
          style={{ backgroundColor: Colors.background || "#FFFFFF" }}
        >
          <div
            className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
          ></div>
        </div>
      </Layout>
    );
  }

  const user = profile?.user || {};
  const statistics = profile?.statistics || {};
  const subscription = profile?.subscription || {};
  const usage = subscription?.usage || {};
  const limits = subscription?.limits || {};

  const usagePercentage = limits.properties
    ? Math.min(Math.round(((usage.properties || 0) / limits.properties) * 100), 100)
    : 0;

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account credentials, statistics, and platform subscription.
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <img
              src={
                user.profile_image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "PM")}&background=0D8ABC&color=fff`
              }
              alt={user.name || "Profile"}
              className="w-28 h-28 rounded-full object-cover border-4"
              style={{ borderColor: Colors.primary }}
            />

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name || "Manager Name"}</h2>
              <p className="font-semibold text-sm capitalize mt-0.5" style={{ color: Colors.primary }}>
                {user.role || "Property Manager"}
              </p>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {user.email || "N/A"}
                </p>

                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={16} className="text-gray-400" />
                  {user.phone_number || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openEditModal}
            className="mt-6 md:mt-0 flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 shadow-2xs"
            style={{ backgroundColor: Colors.primary }}
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              icon: Home,
              label: "Properties",
              value: statistics.properties ?? 0,
            },
            {
              icon: Building,
              label: "Units",
              value: statistics.units ?? 0,
            },
            {
              icon: Users,
              label: "Tenants",
              value: statistics.tenants ?? 0,
            },
            {
              icon: Building2,
              label: "Landlords",
              value: statistics.landlords ?? 0,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6"
            >
              <item.icon style={{ color: Colors.primary }} size={30} />

              <h2 className="text-3xl font-bold mt-4 text-slate-900">
                {item.value}
              </h2>

              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Two Columns: Personal Information & Subscription Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-gray-50 pb-3">
              Personal Information
            </h2>

            <div className="space-y-4">
              <Info icon={User} label="Full Name" value={user.name} />
              <Info icon={Mail} label="Email Address" value={user.email} />
              <Info icon={Phone} label="Phone Number" value={user.phone_number} />
              <Info icon={Building2} label="Company / Entity" value={user.company || "Independent"} />
              <Info icon={CreditCard} label="National ID / Passport" value={user.national_id || "N/A"} />
              <Info icon={Calendar} label="Account Created" value={user.date_joined || "N/A"} />
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-gray-50 pb-3">
                Subscription Tier
              </h2>

              <div className="space-y-4">
                <Info
                  icon={CreditCard}
                  label="Current Package"
                  value={subscription.package || "Free Tier"}
                />
                <Info
                  icon={Shield}
                  label="Subscription Status"
                  value={subscription.status || "Active"}
                />
                <Info
                  icon={Calendar}
                  label="Renewal / Expiry"
                  value={subscription.expires_at || "N/A"}
                />
                <Info
                  icon={Calendar}
                  label="Days Remaining"
                  value={`${subscription.remaining_days ?? 0} Days`}
                />
              </div>
            </div>

            {/* Property Allocation Progress */}
            <div className="mt-8 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                <span>Property Portfolio Limit</span>
                <span>
                  {usage.properties ?? 0} / {limits.properties ?? "Unlimited"} ({usagePercentage}%)
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${usagePercentage}%`,
                    backgroundColor: Colors.primary,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Included */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-gray-50 pb-3">
            Package Capabilities & Features
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(subscription.features || [
              "Tenant Billing Automation",
              "M-Pesa STK Push Integration",
              "Financial Reports Generation",
              "Maintenance Ticketing System",
              "SMS & Email Alerts",
            ]).map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50"
              >
                <CheckCircle size={18} style={{ color: Colors.primary }} className="shrink-0" />
                <span className="text-xs font-semibold text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Actions */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-gray-50 pb-3">
            Security & Authentication
          </h2>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                Swal.fire({
                  title: "Change Password",
                  text: "A password reset link will be dispatched to your email address.",
                  icon: "info",
                  showCancelButton: true,
                  confirmButtonText: "Send Link",
                  confirmButtonColor: Colors.primary,
                });
              }}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl text-xs font-semibold hover:opacity-90 transition shadow-2xs"
              style={{ backgroundColor: Colors.primary }}
            >
              <Lock size={16} />
              Change Password
            </button>

            <button 
              onClick={() => {
                Swal.fire({
                  title: "Two-Factor Auth",
                  text: "2FA feature settings are currently configured at the administrative directory level.",
                  icon: "info",
                  confirmButtonColor: Colors.primary,
                });
              }}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
            >
              <Shield size={16} />
              Two Factor Authentication
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-slate-900">Edit Manager Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                {/* Profile Image Preview/Picker */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={
                        imagePreview ||
                        user.profile_image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "PM")}`
                      }
                      alt="Avatar Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                    <label 
                      className="absolute bottom-0 right-0 p-2 text-white rounded-full cursor-pointer shadow-md transition hover:opacity-90"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      <Camera size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone_number}
                    onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    placeholder="e.g. +254 700 000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    placeholder="Company or Enterprise"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    National ID / Passport Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.national_id}
                    onChange={(e) => setEditFormData({ ...editFormData, national_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    placeholder="e.g. 12345678"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    {isUpdating ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Save Profile"
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

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 pb-3 text-sm">
      <div className="flex items-center gap-3 text-gray-600">
        <Icon size={16} style={{ color: Colors.primary }} />
        <span>{label}</span>
      </div>

      <span className="font-semibold text-slate-900">
        {value || "—"}
      </span>
    </div>
  );
}