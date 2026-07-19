import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
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
            const response = await api.get("/company/company_professionals/");
            setProfessionals(response.data.professionals || []);
        } catch (error) {
            console.error(error);
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
                text: "Professional has been added successfully.",
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
                title: "Error",
                text: "Unable to create professional.",
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
                text: "Professional updated successfully.",
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
                text: "Unable to update professional.",
            });
        }
    };

    const deleteProfessional = (id) => {
        Swal.fire({
            title: "Delete Professional?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/company/delete_professional/${id}/`);
                    Swal.fire("Deleted", "Professional deleted successfully.", "success");
                    fetchProfessionals();
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    // Derived values calculated directly from the state
    const available = professionals.filter((p) => p.user?.is_active).length;
    const unavailable = professionals.length - available;
    const averageExperience = professionals.length
        ? Math.round(
              professionals.reduce((acc, p) => acc + (Number(p.years_of_experience) || 0), 0) /
                  professionals.length
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

    return (
        <Layout>
            <div className="min-h-screen bg-[#F8F8F8] p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0A4429]">Professionals</h1>
                        <p className="text-gray-500 mt-2">Manage all professionals working in your company.</p>
                    </div>
                    <button
                        onClick={() => setOpenDrawer(true)}
                        className="bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-3 rounded-xl flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Professional
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <Users className="text-[#2E9D47] mb-4" />
                        <p className="text-gray-500">Professionals</p>
                        <h2 className="text-3xl font-bold mt-2">{professionals.length}</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <UserCircle className="text-green-600 mb-4" />
                        <p className="text-gray-500">Available</p>
                        <h2 className="text-3xl font-bold mt-2">{available}</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <Briefcase className="text-orange-500 mb-4" />
                        <p className="text-gray-500">Unavailable</p>
                        <h2 className="text-3xl font-bold mt-2">{unavailable}</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <Award className="text-blue-600 mb-4" />
                        <p className="text-gray-500">Avg Experience</p>
                        <h2 className="text-3xl font-bold mt-2">{averageExperience} yrs</h2>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl border shadow-sm p-5 mb-8">
                    <div className="relative max-w-md">
                        <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search professionals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded-xl py-3 pl-10 pr-4"
                        />
                    </div>
                </div>

                {/* Grid Content / Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProfessionals.map((professional) => (
                            <div
                                key={professional.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={professional.user?.profile_image}
                                        alt={professional.user?.full_name}
                                        className="w-16 h-16 rounded-full object-cover border"
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-[#0A4429]">
                                            {professional.user?.full_name}
                                        </h2>
                                        <p className="text-[#2E9D47]">{professional.professional_title}</p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} />
                                        {professional.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        {professional.user?.phone_number}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />
                                        {professional.years_of_experience} Years Experience
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            professional.user?.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {professional.user?.is_active ? "Available" : "Unavailable"}
                                    </span>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => viewProfessional(professional)}
                                            className="text-[#2E9D47] font-semibold hover:text-[#0A4429] text-sm"
                                        >
                                            View
                                        </button>
                                        <button 
                                            onClick={() => openEditProfessional(professional)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => deleteProfessional(professional.id)}
                                            className="text-red-500 hover:text-red-700"
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

            {/* Add Drawer */}
            {openDrawer && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center bg-[#0A4429]">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Add Professional</h2>
                                <p className="text-white text-sm">Register a new professional for your company.</p>
                            </div>
                            <button onClick={() => setOpenDrawer(false)} className="text-gray-500 hover:text-red-500 text-xl">✕</button>
                        </div>

                        <form onSubmit={addProfessional} className="p-6 space-y-5">
                            <div>
                                <label className="font-medium">Full Name</label>
                                <input type="text" placeholder="e.g John Doe" name="full_name" value={newProfessional.full_name} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Email</label>
                                <input type="email" placeholder="e.g johndoe@example.com" name="email" value={newProfessional.email} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Phone Number</label>
                                <input type="text" placeholder="e.g 254701020304" name="phone_number" value={newProfessional.phone_number} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Username</label>
                                <input type="text" placeholder="e.g johndoe" name="username" value={newProfessional.username} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Password</label>
                                <input type="password" placeholder="e.g johndoe" name="password" value={newProfessional.password} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Professional Title</label>
                                <input type="text" placeholder="e.g Software developer" name="professional_title" value={newProfessional.professional_title} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Years of Experience</label>
                                <input type="number" placeholder="e.g 3" name="years_of_experience" value={newProfessional.years_of_experience} onChange={handleInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Bio</label>
                                <textarea rows={5} placeholder="e.g write the professional bio here..." name="bio" value={newProfessional.bio} onChange={handleInputChange} className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setOpenDrawer(false)} className="flex-1 border rounded-xl py-3">Cancel</button>
                                <button type="submit" className="flex-1 bg-[#2E9D47] text-white rounded-xl py-3">Save Professional</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Drawer */}
            {openEditDrawer && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0A4429]">Edit Professional</h2>
                                <p className="text-gray-500 text-sm">Update professional registration details.</p>
                            </div>
                            <button onClick={() => setOpenEditDrawer(false)} className="text-gray-500 hover:text-red-500 text-xl">✕</button>
                        </div>

                        <form onSubmit={updateProfessional} className="p-6 space-y-5">
                            <div>
                                <label className="font-medium">Full Name</label>
                                <input type="text" name="full_name" value={editProfessional.full_name} onChange={handleEditInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Email</label>
                                <input type="email" name="email" value={editProfessional.email} onChange={handleEditInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Phone Number</label>
                                <input type="text" name="phone_number" value={editProfessional.phone_number} onChange={handleEditInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Username</label>
                                <input type="text" placeholder="e.g johndoe" name="username" value={editProfessional.username} onChange={handleEditInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Professional Title</label>
                                <input type="text" name="professional_title" value={editProfessional.professional_title} onChange={handleEditInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Years of Experience</label>
                                <input type="number" name="years_of_experience" value={editProfessional.years_of_experience} onChange={handleEditInputChange} required className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div>
                                <label className="font-medium">Bio</label>
                                <textarea rows={5} name="bio" value={editProfessional.bio} onChange={handleEditInputChange} className="w-full border rounded-xl p-3 mt-2" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setOpenEditDrawer(false)} className="flex-1 border rounded-xl py-3">Cancel</button>
                                <button type="submit" className="flex-1 bg-[#2E9D47] text-white rounded-xl py-3">Update Professional</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {openViewModal && selectedProfessional && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold text-[#0A4429] mb-6">Professional Details</h2>
                        <div className="flex flex-col items-center">
                            <img src={selectedProfessional.user?.profile_image} alt={selectedProfessional.user?.full_name} className="w-24 h-24 rounded-full object-cover border mb-4" />
                            <h3 className="text-xl font-bold">{selectedProfessional.user?.full_name}</h3>
                            <p className="text-[#2E9D47]">{selectedProfessional.professional_title}</p>
                        </div>
                        <div className="mt-8 space-y-4 text-sm">
                            <p><strong>Email:</strong> {selectedProfessional.user?.email}</p>
                            <p><strong>Phone:</strong> {selectedProfessional.user?.phone_number}</p>
                            <p><strong>Username:</strong> {selectedProfessional.user?.username}</p>
                            <p><strong>Experience:</strong> {selectedProfessional.years_of_experience} Years</p>
                            <p><strong>Bio:</strong></p>
                            <p className="text-gray-600">{selectedProfessional.bio || "No biography provided."}</p>
                        </div>
                        <div className="mt-8 text-right">
                            <button onClick={() => setOpenViewModal(false)} className="bg-[#2E9D47] text-white px-6 py-2 rounded-xl">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}