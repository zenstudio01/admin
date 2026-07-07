import React, { useState, useEffect } from "react";
import { 
  Users as UsersIcon, Building2, UserCheck, ShieldAlert, Search, SlidersHorizontal,
  Eye, Edit3, Trash2, Ban, CheckCircle2, Key, Shield, X, Mail, Phone, Calendar, ArrowLeftRight
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../config/env";
import api from "../../api/api";

export default function UsersManagement() {
  // Operational State Matrices
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pm: 0, landlord: 0, tenant: 0, provider: 0 });
  const [loading, setLoading] = useState(true);
  
  // Search, Pagination & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Interface Hooks
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ role: "", is_active: false });

  useEffect(() => {
    fetchUsersData();
  }, [currentPage, roleFilter, statusFilter]);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(`/admin/users/`, {
        params: {
          page: currentPage,
          search: searchQuery,
          role: roleFilter,
          status: statusFilter
        },
      });

      setUsers(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Failed executing administration query matrix:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsersData();
  };

  // Administrative Modification Mutators
  const toggleUserStatus = async (userId, currentStatus) => {
    const actionText = currentStatus ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: "Modify Access Scope?",
      text: `Are you sure you want to ${actionText} this user's account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#d33" : "#2E9D47",
      confirmButtonText: `Yes, ${actionText}`
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/admin/users/${userId}/toggle-active/`, {});
        Swal.fire("Status Updated", `User has been successfully ${actionText}d.`, "success");
        fetchUsersData();
      } catch (e) {
        Swal.fire("Action Failed", "Could not complete account status transition.", "error");
      }
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/verify/`, {});
      Swal.fire("Account Verified", "Identity parameters cleared.", "success");
      fetchUsersData();
      if (isViewModalOpen) setIsViewModalOpen(false);
    } catch (e) {
      Swal.fire("Error", "Could not execute background verification routine.", "error");
    }
  };

  const handlePasswordReset = async (userId) => {
    const result = await Swal.fire({
      title: "Trigger Recovery Reset?",
      text: "System will construct a structural bypass password.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#0A4429"
    });

    if (result.isConfirmed) {
      try {
        const res = await api.post(`/admin/users/${userId}/reset-password/`, {});
        Swal.fire("Temporary Secret Created", `Temporary Credential: ${res.data.temporary_password}`, "success");
      } catch (e) {
        Swal.fire("Error", "Authentication database refused reset logic bypass.", "error");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Purge Record Permanently?",
      text: "This action will permanently delete this user account. It cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete Account Record"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/admin/users/${userId}/`);
        Swal.fire("Purge Completed", "User removed from infrastructure matrices.", "success");
        fetchUsersData();
      } catch (e) {
        Swal.fire("Refused", "Database rejected drop query due to historical relational logging constraints.", "error");
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({ role: user.role, is_active: user.is_active });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${selectedUser.id}/update-profile/`, editForm);
      setIsEditModalOpen(false);
      Swal.fire("Record Patched", "User tracking values updated safely.", "success");
      fetchUsersData();
    } catch (e) {
      Swal.fire("Failed", "Server rejected form payload properties validation.", "error");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Identity & User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Oversee globally authenticated actors, control roles, security keys, and access profiles.</p>
        </div>

        {/* Dynamic Aggregations Framework Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Accounts", value: summary.total, icon: <UsersIcon size={20} />, color: "bg-[#0A4429]" },
            { label: "Property Managers", value: summary.pm, icon: <Building2 size={20} />, color: "bg-[#2E9D47]" },
            { label: "Landlords", value: summary.landlord, icon: <Building2 size={20} />, color: "bg-[#0A4429]/80" },
            { label: "Tenants", value: summary.tenant, icon: <UsersIcon size={20} />, color: "bg-blue-700" },
            { label: "Service Providers", value: summary.provider, icon: <UserCheck size={20} />, color: "bg-amber-600" }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-bold text-[#0A4429] mt-1">{card.value}</h3>
              </div>
              <div className={`${card.color} text-white p-3 rounded-xl shadow-inner`}>{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Query Optimization Pipeline Tools Control Grid Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full xl:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, or email target criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent"
            />
          </form>

          <div className="flex flex-wrap w-full xl:w-auto gap-3 items-center">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white text-gray-600 outline-none focus:ring-2 focus:ring-[#2E9D47]"
            >
              <option value="">All Roles Classification</option>
              <option value="admin">System Administrator</option>
              <option value="property manager">Property Manager</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
              <option value="service provider">Service Provider</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white text-gray-600 outline-none focus:ring-2 focus:ring-[#2E9D47]"
            >
              <option value="">All Verification Status</option>
              <option value="verified">Verified Identity profiles</option>
              <option value="unverified">Unverified Pending accounts</option>
              <option value="active">Active Access states</option>
              <option value="inactive">Suspended / Deactivated accounts</option>
            </select>
          </div>
        </div>

        {/* Identity Registry Main Metrics Display Panel Layout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="h-9 w-9 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShieldAlert size={44} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No system records matched search parameter sets.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4">Global Identifier Node</th>
                    <th className="p-4">Contact Coordinate</th>
                    <th className="p-4">Role Assigned</th>
                    <th className="p-4">Infrastructure Assets</th>
                    <th className="p-4">Identity Health</th>
                    <th className="p-4 text-center">Action Control Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.profile_image} 
                            alt="Avatar Cell" 
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#0A4429]">{user.full_name}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-600 font-medium">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{user.phone_number}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-[#0A4429] font-semibold text-xs px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-[#0A4429]">
                        {user.assets_count} items
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-[#2E9D47]' : 'bg-red-500'}`}></span>
                          <span className="text-xs font-medium text-gray-600">{user.is_active ? "Active" : "Suspended"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${user.is_verified ? 'bg-blue-600' : 'bg-amber-500'}`}></span>
                          <span className="text-xs font-medium text-gray-500">{user.is_verified ? "Verified" : "Pending Vetting"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-[#0A4429] bg-gray-50 hover:bg-gray-100 rounded-lg transition" title="Inspect Identity Context"><Eye size={16} /></button>
                          <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition" title="Modify Roles"><Edit3 size={16} /></button>
                          <button onClick={() => toggleUserStatus(user.id, user.is_active)} className={`p-1.5 rounded-lg transition ${user.is_active ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-[#2E9D47] hover:bg-green-50'}`} title={user.is_active ? "Suspend System Entry" : "Lift Suspension"}><Ban size={16} /></button>
                          <button onClick={() => handlePasswordReset(user.id)} className="p-1.5 text-gray-400 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 rounded-lg transition" title="Reset Secret Keys"><Key size={16} /></button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition" title="Purge Record Row"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Context Row Toolbar Footer */}
          <div className="p-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-500 bg-gray-50/50">
            <span>Viewing Frame Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                Previous Frame
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                Next Frame
              </button>
            </div>
          </div>
        </div>

        {/* MODAL 1: VIEW PROFILE LAYER EXPANSION DRAWER */}
        {isViewModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-6 bg-[#0A4429] text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Shield size={22} className="text-[#2E9D47]" />
                  <div>
                    <h3 className="text-lg font-bold">Metadata Identity Profile</h3>
                    <p className="text-xs text-[#F4F1E6]/70">Auditing active state variable metrics.</p>
                  </div>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition"><X size={18} /></button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-5">
                  <img src={selectedUser.profile_image} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50" />
                  <div className="text-center sm:text-left">
                    <h4 className="text-xl font-bold text-[#0A4429]">{selectedUser.full_name}</h4>
                    <p className="text-sm text-gray-400">System Namespace UUID Cluster Node: #{selectedUser.id}</p>
                    <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                      {!selectedUser.is_verified && (
                        <button onClick={() => handleVerifyUser(selectedUser.id)} className="flex items-center gap-1.5 px-3 py-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white text-xs font-semibold rounded-lg transition shadow-xs">
                          <CheckCircle2 size={13} /> Clear Identity Vetting
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-gray-600"><Mail size={16} className="text-gray-400" /> {selectedUser.email}</p>
                    <p className="flex items-center gap-2 text-gray-600"><Phone size={16} className="text-gray-400" /> {selectedUser.phone_number}</p>
                    <p className="flex items-center gap-2 text-gray-600"><Calendar size={16} className="text-gray-400" /> Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Relational Schema Assets</p>
                    <p className="text-2xl font-black text-[#0A4429]">{selectedUser.assets_count} <span className="text-xs font-semibold text-gray-500">Active Records Tracked</span></p>
                  </div>
                </div>

                {/* Secure Vault Images Panel */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">KYC Government Clearance Identification Media</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">National ID Document Front</p>
                      <img src={selectedUser.id_front_image} className="w-full h-32 rounded-xl object-cover border bg-gray-50" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">National ID Document Reverse</p>
                      <img src={selectedUser.id_back_image} className="w-full h-32 rounded-xl object-cover border bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT ACCESS ROLE MATRIX MODAL */}
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="p-5 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#0A4429] font-bold">
                  <ArrowLeftRight size={18} />
                  <h3>Modify Operational Parameters</h3>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">System Privilege Level Token</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#2E9D47]"
                  >
                    <option value="admin">Admin Override Access</option>
                    <option value="property manager">Property Manager</option>
                    <option value="landlord">Landlord Portfolio Owner</option>
                    <option value="tenant">Tenant Consumer Account</option>
                    <option value="service provider">Service Provider / Fundi</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
                  <div>
                    <p className="text-sm font-semibold text-[#0A4429]">Authorization Gateway Gate</p>
                    <p className="text-xs text-gray-400">Controls immediate routing clearance validation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="w-5 h-5 accent-[#2E9D47] rounded cursor-pointer"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 border py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white py-2.5 rounded-xl text-sm font-medium transition shadow-xs">Commit Registry Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}