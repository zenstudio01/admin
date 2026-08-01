import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";
import Swal from "sweetalert2";
import {
  Building2,
  Users,
  CalendarDays,
  Wallet,
  MapPin,
  Globe,
  Mail,
  Phone,
  Pencil,
  X,
} from "lucide-react";

export default function CompanyProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [subscription, setSubscription] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    website: "",
    service: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    description: "",
    logo: "",
    is_available: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/company/company_profile/");

      const companyData = response.data?.company || {};
      setCompany(companyData);
      setFormData(companyData);

      setStatistics(response.data?.statistics || {});
      setSubscription(response.data?.subscription || null);
    } catch (error) {
      console.error("Failed to load company profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load company profile details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/company/update_company_profile/", formData);
      setCompany(formData);
      setEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Company profile updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Unable to update company profile.",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${Colors.primary} transparent transparent transparent`,
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
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Company Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your organization details and operational stats.
            </p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="self-start sm:self-auto text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-2xs hover:opacity-90 transition"
            style={{ backgroundColor: Colors.primary }}
          >
            <Pencil size={18} />
            Edit Profile
          </button>
        </div>

        {/* Company Overview Header Card */}
        {company && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
              <img
                src={
                  company.logo ||
                  "https://via.placeholder.com/150?text=Company+Logo"
                }
                alt={company.name || "Company Logo"}
                className="w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border border-gray-100 shadow-xs shrink-0"
              />

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {company.name || "Company Name"}
                  </h2>

                  <div>
                    {company.is_available ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1 rounded-full text-xs font-bold inline-block">
                        Available
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 border border-rose-100 px-3.5 py-1 rounded-full text-xs font-bold inline-block">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className="mt-1 font-semibold text-sm"
                  style={{ color: Colors.primary }}
                >
                  {company.service || "Service Category"}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Mail size={15} className="text-gray-400" />
                    {company.email || "--"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Phone size={15} className="text-gray-400" />
                    {company.phone_number || "--"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-gray-400" />
                    {company.city ? `${company.city}, ${company.country}` : "--"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Globe size={15} className="text-gray-400" />
                    {company.website ? (
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-emerald-700 font-medium"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "No website"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operational Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
            <Users size={24} style={{ color: Colors.primary }} className="mb-3" />
            <p className="text-gray-500 text-xs font-medium">Professionals</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {statistics.professionals ?? 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
            <CalendarDays size={24} className="text-blue-600 mb-3" />
            <p className="text-gray-500 text-xs font-medium">Total Bookings</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {statistics.bookings ?? 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
            <Building2 size={24} className="text-amber-500 mb-3" />
            <p className="text-gray-500 text-xs font-medium">Completed Jobs</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {statistics.completed_jobs ?? 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
            <Wallet size={24} className="text-emerald-600 mb-3" />
            <p className="text-gray-500 text-xs font-medium">Wallet Balance</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              KES {Number(statistics.wallet || 0).toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Business Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              About Company
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {company?.description || "No company description added yet."}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Business Availability
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Toggle your company state to accept or pause incoming client requests.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-semibold text-slate-700">
                Current Status
              </span>
              {company?.is_available ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1 rounded-full text-xs font-bold">
                  Active
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-700 border border-rose-100 px-3.5 py-1 rounded-full text-xs font-bold">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Company Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium">Company Name</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.name || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Email Address</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.email || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Phone Number</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.phone_number || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Website</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.website || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Service Category</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.service || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Address</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.address || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">City</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.city || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Country</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.country || "--"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Postal Code</p>
              <p className="font-semibold text-slate-800 mt-1">{company?.postal_code || "--"}</p>
            </div>
          </div>
        </div>

        {/* Company Timeline */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Company Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-400 font-medium">Date Registered</p>
              <p className="font-bold text-slate-800 text-base mt-1">
                {company?.created_at
                  ? new Date(company.created_at).toLocaleDateString()
                  : "--"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-400 font-medium">Last Profile Update</p>
              <p className="font-bold text-slate-800 text-base mt-1">
                {company?.updated_at
                  ? new Date(company.updated_at).toLocaleDateString()
                  : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Plan Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 font-medium">Current Plan</p>
              <h2 className="text-2xl font-black text-slate-900 mt-1 capitalize">
                {subscription?.package?.name || "No Active Plan"}
              </h2>
            </div>

            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                subscription?.is_active
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-100"
              }`}
            >
              {subscription?.is_active ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-medium">Started On</p>
              <p className="font-bold text-slate-800 text-sm mt-1">
                {subscription?.start_date
                  ? new Date(subscription.start_date).toLocaleDateString()
                  : "--"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-medium">Expires On</p>
              <p className="font-bold text-slate-800 text-sm mt-1">
                {subscription?.end_date
                  ? new Date(subscription.end_date).toLocaleDateString()
                  : "--"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-medium">Units Allowed</p>
              <p
                className="font-black text-lg mt-1"
                style={{ color: Colors.primary }}
              >
                {subscription?.package?.number_of_units ?? "--"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-medium">Days Remaining</p>
              <p className="font-black text-lg text-slate-900 mt-1">
                {subscription?.days_remaining ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/subscription-packages")}
              className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-2xs hover:opacity-90 transition"
              style={{ backgroundColor: Colors.primary }}
            >
              {subscription?.is_active
                ? "Upgrade / Renew Subscription"
                : "Activate Subscription"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Sidebar Drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div>
              <div
                className="p-6 text-white flex justify-between items-center"
                style={{ backgroundColor: Colors.primary }}
              >
                <div>
                  <h2 className="text-xl font-bold">Edit Company Profile</h2>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Update public and operational details
                  </p>
                </div>
                <button
                  onClick={() => setEditing(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service Category
                    </label>
                    <input
                      type="text"
                      name="service"
                      value={formData.service || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Description
                  </label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    name="is_available"
                    checked={formData.is_available ?? true}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 rounded-xs focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="is_available"
                    className="text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Set Company Available for Requests
                  </label>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 border border-gray-200 text-slate-700 hover:bg-gray-50 font-bold py-3 rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 text-white font-bold py-3 rounded-xl text-xs transition shadow-2xs hover:opacity-90"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}