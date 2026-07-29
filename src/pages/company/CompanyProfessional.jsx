import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Colors from "../../constants/colors";
import Swal from "sweetalert2";

import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Briefcase,
  Award,
  UserCircle,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

export default function CompanyProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    username: "",
    password: "",
    professional_title: "",
    years_of_experience: "",
    bio: "",
  });

  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [editProfessional, setEditProfessional] = useState({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
    username: "",
    professional_title: "",
    years_of_experience: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/company/company_professionals/");
      setProfessionals(response.data?.professionals || []);
    } catch (error) {
      console.error("Failed to retrieve company professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProfessional = async (e) => {
    e.preventDefault();
    try {
      await api.post("/company/add_professional/", newProfessional);
      Swal.fire({
        icon: "success",
        title: "Professional Added",
        text: "Professional has been registered successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      setOpenDrawer(false);
      setNewProfessional({
        full_name: "",
        email: "",
        phone_number: "",
        username: "",
        password: "",
        professional_title: "",
        years_of_experience: "",
        bio: "",
      });
      fetchProfessionals();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: "Unable to create professional record.",
      });
    }
  };

  const handleInputChange = (e) => {
    setNewProfessional({
      ...newProfessional,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    setEditProfessional({
      ...editProfessional,
      [e.target.name]: e.target.value,
    });
  };

  const viewProfessional = (professional) => {
    setSelectedProfessional(professional);
    setOpenViewModal(true);
  };

  const openEditProfessional = (professional) => {
    setEditProfessional({
      id: professional.id,
      full_name: professional.user?.full_name || "",
      email: professional.user?.email || "",
      phone_number: professional.user?.phone_number || "",
      username: professional.user?.username || "",
      professional_title: professional.professional_title || "",
      years_of_experience: professional.years_of_experience || "",
      bio: professional.bio || "",
    });
    setOpenEditDrawer(true);
  };

  const updateProfessional = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/company/update_professional/${editProfessional.id}/`,
        editProfessional
      );
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Professional details updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      setOpenEditDrawer(false);
      fetchProfessionals();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update professional record.",
      });
    }
  };

  const deleteProfessional = (id) => {
    Swal.fire({
      title: "Delete Professional?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/company/delete_professional/${id}/`);
          Swal.fire("Deleted", "Professional record removed.", "success");
          fetchProfessionals();
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  // Derived metrics
  const available = professionals.filter((p) => p.user?.is_active).length;
  const unavailable = professionals.length - available;
  const averageExperience = professionals.length
    ? Math.round(
        professionals.reduce(
          (acc, p) => acc + (Number(p.years_of_experience) || 0),
          0
        ) / professionals.length
      )
    : 0;

  const filteredProfessionals = professionals.filter((professional) => {
    const query = search.toLowerCase();
    return (
      professional.user?.full_name?.toLowerCase().includes(query) ||
      professional.user?.email?.toLowerCase().includes(query) ||
      professional.user?.phone_number?.toLowerCase().includes(query) ||
      professional.professional_title?.toLowerCase().includes(query)
    );
  });

  const getAvatarUrl = (userObj) => {
    if (userObj?.profile_image) return userObj.profile_image;
    const name = userObj?.full_name || "Professional";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=0A4429&color=ffffff&bold=true`;
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Company Professionals
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage personnel, staff allocations, and operational profiles.
            </p>
          </div>

          <button
            onClick={() => setOpenDrawer(true)}
            className="text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition hover:opacity-90 shadow-2xs self-start sm:self-center shrink-0"
            style={{ backgroundColor: Colors.primary }}
          >
            <Plus size={18} />
            Add Professional
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Users size={20} style={{ color: Colors.primary }} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Professionals
            </p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              {professionals.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <UserCircle className="text-emerald-600" size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Available Personnel
            </p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              {available}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Briefcase className="text-amber-600" size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Unavailable / Allocated
            </p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              {unavailable}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Award className="text-blue-600" size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Avg Experience
            </p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              {averageExperience} yrs
            </h2>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 mb-8">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-3.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Main Content Grid / Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: `${Colors.primary} transparent transparent transparent`,
              }}
            />
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <p className="text-sm font-medium">
              No matching professionals found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <div
                key={professional.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={getAvatarUrl(professional.user)}
                      alt={professional.user?.full_name || "Professional"}
                      className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-2xs shrink-0"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight">
                        {professional.user?.full_name || "Unnamed"}
                      </h2>
                      <p
                        className="text-xs font-semibold mt-0.5"
                        style={{ color: Colors.primary }}
                      >
                        {professional.professional_title || "Staff Member"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={15} className="text-gray-400" />
                      <span className="truncate">
                        {professional.user?.email || "No email"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-gray-400" />
                      <span>{professional.user?.phone_number || "No phone"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={15} className="text-gray-400" />
                      <span>
                        {professional.years_of_experience || 0} Years Experience
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      professional.user?.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {professional.user?.is_active ? "Available" : "Unavailable"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewProfessional(professional)}
                      className="text-xs font-bold hover:underline px-2 py-1"
                      style={{ color: Colors.primary }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditProfessional(professional)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteProfessional(professional.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Professional Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div
                className="p-6 border-b border-gray-100 flex justify-between items-center"
                style={{ backgroundColor: Colors.primary }}
              >
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Add Professional
                  </h2>
                  <p className="text-white/80 text-xs mt-0.5">
                    Register a new professional for your company roster.
                  </p>
                </div>
                <button
                  onClick={() => setOpenDrawer(false)}
                  className="text-white/70 hover:text-white p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addProfessional} className="p-6 space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    name="full_name"
                    value={newProfessional.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. johndoe@example.com"
                    name="email"
                    value={newProfessional.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 254701020304"
                    name="phone_number"
                    value={newProfessional.phone_number}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="e.g. johndoe"
                      name="username"
                      value={newProfessional.username}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      name="password"
                      value={newProfessional.password}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Professional Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Electrician"
                      name="professional_title"
                      value={newProfessional.professional_title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      name="years_of_experience"
                      value={newProfessional.years_of_experience}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Biography</label>
                  <textarea
                    rows={4}
                    placeholder="Write professional bio summary..."
                    name="bio"
                    value={newProfessional.bio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setOpenDrawer(false)}
                    className="flex-1 border border-gray-200 rounded-xl py-3 font-semibold text-gray-600 hover:bg-gray-50 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-white rounded-xl py-3 font-semibold text-xs transition hover:opacity-90"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    Save Professional
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Professional Drawer */}
      {openEditDrawer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Edit Professional
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Update profile details and account metadata.
                  </p>
                </div>
                <button
                  onClick={() => setOpenEditDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={updateProfessional} className="p-6 space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={editProfessional.full_name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editProfessional.email}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={editProfessional.phone_number}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editProfessional.username}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Professional Title</label>
                    <input
                      type="text"
                      name="professional_title"
                      value={editProfessional.professional_title}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      name="years_of_experience"
                      value={editProfessional.years_of_experience}
                      onChange={handleEditInputChange}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Biography</label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={editProfessional.bio}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setOpenEditDrawer(false)}
                    className="flex-1 border border-gray-200 rounded-xl py-3 font-semibold text-gray-600 hover:bg-gray-50 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-white rounded-xl py-3 font-semibold text-xs transition hover:opacity-90"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    Update Professional
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Professional Modal */}
      {openViewModal && selectedProfessional && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setOpenViewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={getAvatarUrl(selectedProfessional.user)}
                alt={selectedProfessional.user?.full_name || "Professional"}
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-2xs mb-3"
              />
              <h3 className="text-xl font-bold text-slate-900">
                {selectedProfessional.user?.full_name || "Unnamed"}
              </h3>
              <p
                className="text-xs font-semibold mt-0.5"
                style={{ color: Colors.primary }}
              >
                {selectedProfessional.professional_title || "Staff Member"}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-xs border-t border-gray-100 pt-5">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="font-semibold text-slate-800">
                  {selectedProfessional.user?.email || "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Phone:</span>
                <span className="font-semibold text-slate-800">
                  {selectedProfessional.user?.phone_number || "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Username:</span>
                <span className="font-semibold text-slate-800">
                  {selectedProfessional.user?.username || "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Experience:</span>
                <span className="font-semibold text-slate-800">
                  {selectedProfessional.years_of_experience || 0} Years
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-400 font-medium block mb-1">
                  Biography:
                </span>
                <p className="text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedProfessional.bio || "No biography provided."}
                </p>
              </div>
            </div>

            <div className="mt-6 text-right pt-4 border-t border-gray-100">
              <button
                onClick={() => setOpenViewModal(false)}
                className="text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition hover:opacity-90"
                style={{ backgroundColor: Colors.primary }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}