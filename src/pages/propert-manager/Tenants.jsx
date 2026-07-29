import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Building2, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Send 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";
import api from "../../api/api"; 
import Colors from "../../constants/colors";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);

  const [newTenant, setNewTenant] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    id_number: "",
    emergency_contact: "",
    property: "",
    unit: "",
  });

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_tenants/");
      setTenants(response.data.tenants);
      console.log(response.data);
    } catch (error) {
      console.error("Error loading tenants", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred.",
        text: "Failed to get tenants, please refresh the page.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get("/get_properties_with_units/");
      setProperties(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePropertyChange = (e) => {
    const propertyId = e.target.value;

    const selectedProperty = properties.find(
      (p) => String(p.id) === propertyId
    );

    setNewTenant({
      ...newTenant,
      property: propertyId,
      unit: "",
    });

    setUnits(selectedProperty ? selectedProperty.units : []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTenant = async (e) => {
    e.preventDefault();

    const createdTenant = {
      id: Date.now(),
      ...newTenant,
      status: "Pending"
    };
    setIsAdding(true);
    try {
      const response = await api.post("/add_tenant/", createdTenant);

      if (response.status === 200 || response.status === 201) {
        setTenants([createdTenant, ...tenants]);
        setIsModalOpen(false);
        setNewTenant({
          full_name: "",
          email: "",
          phone_number: "",
          id_number: "",
          emergency_contact: "",
          property: "",
          unit: "",
        });

        Swal.fire({
          icon: "success",
          title: "Tenant added successfully",
          text: "Tenant has been registered and assigned to their unit.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add tenant.",
          text: "Tenant was not added, please try again!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "An error occurred.",
        text: "Failed to add tenant, please try again.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Trigger local M-Pesa STK push workflow logic
  const triggerMpesaStkPush = async (tenant) => {
    Swal.fire({
      title: "Initiate Rent Collection",
      text: `Send M-Pesa STK Push of KES ${tenant.rent_amount} to ${tenant.name} (${tenant.phone_number})?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: Colors.primary || "#2E9D47",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Request Rent"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sending STK Push...",
          text: "Awaiting user confirmation on mobile device.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simulate backend communication with the Daraja API implementation
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "STK Push Dispatched",
            text: "Payment prompt successfully sent to the tenant's device.",
            timer: 2500,
            showConfirmButton: false
          });
        }, 2000);
      }
    });
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.property_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.unit_number || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "All" || t.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >

        {/* Module Header Elements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tenants</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor tenant records, active leases, and digital rent collection statuses.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-xs text-sm hover:opacity-90 self-start sm:self-center"
            style={{ backgroundColor: Colors.primary }}
          >
            <Plus size={18} />
            <span>Add Tenant</span>
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, property, or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none text-sm transition focus:border-transparent"
            />
          </div>

          {/* Segmented control filter badges */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {["All", "Paid", "Pending", "Overdue"].map((status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "text-white shadow-2xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={isActive ? { backgroundColor: Colors.primary } : {}}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table/List Wrapper */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div 
              className="h-8 w-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
            ></div>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Tenants Tracked</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">No tenant structures match your criteria or are assigned currently.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr 
                    className="font-semibold text-xs uppercase tracking-wider border-b border-gray-100"
                    style={{ backgroundColor: `${Colors.primary}08`, color: Colors.primary }}
                  >
                    <th className="p-4">Tenant Info</th>
                    <th className="p-4">Property</th>
                    <th className="p-4">Rent amount</th>
                    <th className="p-4">Rent status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name and Basic Contact */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{tenant.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone size={12} /> {tenant.phone_number}
                        </div>
                      </td>
                      {/* Property Details */}
                      <td className="p-4">
                        <div className="text-gray-700 flex items-center gap-1.5 font-medium">
                          <Building2 size={14} style={{ color: Colors.primary }} />
                          {tenant.property_name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Unit: <span className="font-semibold" style={{ color: Colors.primary }}>{tenant.unit_number}</span>
                        </div>
                      </td>
                      {/* Rent Details */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900">KES {tenant.rent_amount}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Per Month</div>
                      </td>
                      {/* Status Badges */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          tenant.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                          tenant.status === "Pending" ? "bg-amber-50 text-amber-700" :
                          "bg-rose-50 text-rose-700"
                        }`}>
                          {tenant.status === "Paid" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {tenant.status}
                        </span>
                      </td>
                      {/* Direct action tools */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => triggerMpesaStkPush(tenant)}
                            disabled={tenant.status === "Paid"}
                            title="Trigger M-Pesa STK Push Request"
                            className="flex items-center gap-1 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                            style={{ backgroundColor: Colors.primary }}
                          >
                            <Send size={12} />
                            <span>Request Rent</span>
                          </button>
                          <button 
                            title="View Active Digital Lease Details"
                            className="p-1.5 text-gray-500 hover:text-slate-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            <FileText size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onboarding Sliding Form Drawer */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-2xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">

              <div 
                className="p-6 border-b border-gray-100 flex items-center justify-between text-white"
                style={{ backgroundColor: Colors.primary }}
              >
                <div>
                  <h3 className="text-lg font-bold">Add Tenant</h3>
                  <p className="text-xs text-white/80 mt-0.5">Add tenant to your property.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTenant} className="p-6 flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={newTenant.full_name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={newTenant.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Phone Number (M-Pesa Connected)</label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={newTenant.phone_number}
                    onChange={handleInputChange}
                    placeholder="e.g. +254712345678"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">ID number</label>
                  <input
                    type="text"
                    name="id_number"
                    required
                    value={newTenant.id_number}
                    onChange={handleInputChange}
                    placeholder="e.g. 12345678"
                    maxLength={8}
                    minLength={8}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Emergency contact</label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    required
                    value={newTenant.emergency_contact}
                    onChange={handleInputChange}
                    placeholder="e.g. +254712345678"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Target Property</label>
                    <select
                      name="property"
                      value={newTenant.property}
                      onChange={handlePropertyChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition bg-white focus:border-transparent"
                    >
                      <option value="">Select Property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Unit Assignment</label>
                    <select
                      name="unit"
                      value={newTenant.unit}
                      onChange={handleInputChange}
                      required
                      disabled={!newTenant.property}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm transition bg-white focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">
                        {newTenant.property ? "Select Unit" : "Select Property First"}
                      </option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="flex-1 text-white font-medium py-2.5 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    {isAdding ? (
                      <div className="flex justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "Add Tenant"
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