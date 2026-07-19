import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
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
    Pencil
} from "lucide-react";

export default function CompanyProfile() {

    const [loading, setLoading] = useState(true);

    const [company, setCompany] = useState(null);

    const [statistics, setStatistics] = useState({});

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

            const response = await api.get("/company/company_profile/");

            setCompany(response.data.company);
            setFormData(response.data.company);

            setStatistics(response.data.statistics);

        } catch (error) {

            console.log(error);

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

        Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Unable to update company profile.",
        });

    }

};

    if (loading) {

        return (

            <Layout>

                <div className="flex justify-center py-20">

                    <div className="w-10 h-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"/>

                </div>

            </Layout>

        );

    }

        return (

        <Layout>

            <div className="min-h-screen bg-[#F8F8F8] p-8">
                <div className="flex justify-between items-center mb-8">

    <div>

        <h1 className="text-3xl font-bold text-[#0A4429]">

            Company Profile

        </h1>

        <p className="text-gray-500 mt-2">

            View and manage your company information.

        </p>

    </div>

    <button

        onClick={() => setEditing(true)}

        className="bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-3 rounded-xl flex items-center gap-2"

    >

        <Pencil size={18}/>

        Edit Profile

    </button>

</div>

<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">

    <div className="flex flex-col md:flex-row items-center gap-8">

        <img

            src={company.logo}

            alt="Company Logo"

            className="w-36 h-36 rounded-3xl object-cover border"

        />

        <div className="flex-1">

            <h2 className="text-3xl font-bold text-[#0A4429]">

                {company.name}

            </h2>

            <p className="text-[#2E9D47] mt-2 font-medium">

                {company.service}

            </p>

            <div className="flex flex-wrap gap-5 mt-5 text-gray-500">

                <span className="flex items-center gap-2">

                    <Mail size={16}/>

                    {company.email}

                </span>

                <span className="flex items-center gap-2">

                    <Phone size={16}/>

                    {company.phone_number}

                </span>

                <span className="flex items-center gap-2">

                    <MapPin size={16}/>

                    {company.city}, {company.country}

                </span>

                <span className="flex items-center gap-2">

                    <Globe size={16}/>

                    {company.website || "No website"}

                </span>

            </div>

            <div className="mt-5">

                {company.is_available ? (

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">

                        Available

                    </span>

                ) : (

                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm">

                        Unavailable

                    </span>

                )}

            </div>

        </div>

    </div>

</div>

<div className="grid md:grid-cols-4 gap-6">
    <div className="bg-white rounded-2xl shadow-sm border p-6">

    <Users className="text-[#2E9D47] mb-4"/>

    <p className="text-gray-500 text-sm">

        Professionals

    </p>

    <h2 className="text-3xl font-bold mt-2">

        {statistics.professionals}

    </h2>

</div>


<div className="bg-white rounded-2xl shadow-sm border p-6">

    <CalendarDays className="text-blue-600 mb-4"/>

    <p className="text-gray-500 text-sm">

        Total Bookings

    </p>

    <h2 className="text-3xl font-bold mt-2">

        {statistics.bookings}

    </h2>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-6">

    <Building2 className="text-orange-500 mb-4"/>

    <p className="text-gray-500 text-sm">

        Completed Jobs

    </p>

    <h2 className="text-3xl font-bold mt-2">

        {statistics.completed_jobs}

    </h2>

</div>

<div className="bg-white rounded-2xl shadow-sm border p-6">

    <Wallet className="text-green-600 mb-4"/>

    <p className="text-gray-500 text-sm">

        Wallet Balance

    </p>

    <h2 className="text-3xl font-bold mt-2">

        KES {statistics.wallet?.toLocaleString()}

    </h2>

</div>

            </div>

            {/* ================= BUSINESS INFORMATION ================= */}

<div className="grid lg:grid-cols-3 gap-8 mt-10">

    {/* About Company */}

    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

        <h2 className="text-2xl font-bold text-[#0A4429] mb-6">

            About Company

        </h2>

        <p className="text-gray-600 leading-8">

            {company.description || "No company description has been added yet."}

        </p>

    </div>

    {/* Availability */}

    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

        <h2 className="text-xl font-bold text-[#0A4429] mb-6">

            Business Status

        </h2>

        <div className="flex items-center justify-between">

            <span className="text-gray-500">

                Availability

            </span>

            {company.is_available ? (

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                    Available

                </span>

            ) : (

                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">

                    Unavailable

                </span>

            )}

        </div>

    </div>

</div>

{/* ================= COMPANY INFORMATION ================= */}

<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-8">

    <h2 className="text-2xl font-bold text-[#0A4429] mb-8">

        Company Information

    </h2>

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        <div>

    <p className="text-sm text-gray-400 mb-1">

        Company Name

    </p>

    <p className="font-semibold text-gray-800">

        {company.name}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        Email Address

    </p>

    <p className="font-semibold">

        {company.email}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        Phone Number

    </p>

    <p className="font-semibold">

        {company.phone_number}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        Website

    </p>

    <p className="font-semibold">

        {company.website || "--"}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        Service Category

    </p>

    <p className="font-semibold">

        {company.service}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        Address

    </p>

    <p className="font-semibold">

        {company.address}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        City

    </p>

    <p className="font-semibold">

        {company.city}

    </p>

</div>


<div>

    <p className="text-sm text-gray-400 mb-1">

        Country

    </p>

    <p className="font-semibold">

        {company.country}

    </p>

</div>

<div>

    <p className="text-sm text-gray-400 mb-1">

        Postal Code

    </p>

    <p className="font-semibold">

        {company.postal_code || "--"}

    </p>

</div>

    </div>

</div>


{/* ================= COMPANY TIMELINE ================= */}

<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-8">

    <h2 className="text-2xl font-bold text-[#0A4429] mb-8">

        Company Timeline

    </h2>

    <div className="grid md:grid-cols-2 gap-8">

        <div>

            <p className="text-sm text-gray-400">

                Company Created

            </p>

            <p className="font-semibold text-lg mt-2">

                {new Date(company.created_at).toLocaleDateString()}

            </p>

        </div>

        <div>

            <p className="text-sm text-gray-400">

                Last Updated

            </p>

            <p className="font-semibold text-lg mt-2">

                {new Date(company.updated_at).toLocaleDateString()}

            </p>

        </div>

    </div>

</div>


            </div>

            {editing && (

<div className="fixed inset-0 z-50 bg-black/40 flex justify-end">

    <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl">

        {/* Header */}

        <div className="bg-[#0A4429] text-white p-6 flex justify-between items-center">

            <div>

                <h2 className="text-2xl font-bold">

                    Edit Company

                </h2>

                <p className="text-sm text-green-100">

                    Update your company information

                </p>

            </div>

            <button
                onClick={() => setEditing(false)}
                className="text-white text-xl"
            >
                ✕
            </button>

        </div>

        <form
            onSubmit={handleUpdate}
            className="p-6 space-y-5"
        >
        <div>

<label className="block text-sm font-medium mb-2">

Company Name

</label>

<input
type="text"
name="name"
placeholder="e.g Company Name"
value={formData.name}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="block text-sm font-medium mb-2">

Email

</label>

<input
type="email"
name="email"
placeholder="e.g company@example.com"
value={formData.email}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="block text-sm font-medium mb-2">

Phone Number

</label>

<input
type="text"
name="phone_number"
placeholder="e.g 254712345678"
value={formData.phone_number}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="block text-sm font-medium mb-2">

Website

</label>

<input
type="text"
name="website"
placeholder="e.g https://www.company.com"
value={formData.website}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>


<div>

<label className="block text-sm font-medium mb-2">

Service

</label>

<input
type="text"
name="service"
placeholder="e.g Construction Services"
value={formData.service}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="block text-sm font-medium mb-2">

Address

</label>

<input
type="text"
name="address"
placeholder="e.g 123 Main Street"
value={formData.address}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>


<div className="grid grid-cols-2 gap-4">

<div>

<label className="block text-sm font-medium mb-2">

City

</label>

<input
type="text"
name="city"
placeholder="e.g Nairobi"
value={formData.city}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

<div>

<label className="block text-sm font-medium mb-2">

Country

</label>

<input
type="text"
name="country"
placeholder="e.g Kenya"
value={formData.country}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

</div>


<div>

<label className="block text-sm font-medium mb-2">

Postal Code

</label>

<input
type="text"
name="postal_code"
placeholder="e.g 123456"
value={formData.postal_code}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>


<div>

<label className="block text-sm font-medium mb-2">

Description

</label>

<textarea
rows={5}
name="description"
placeholder="Tell us about your company..."
value={formData.description}
onChange={handleChange}
className="w-full border rounded-xl p-3"
/>

</div>

<div className="flex items-center gap-3">

<input
type="checkbox"
name="is_available"
checked={formData.is_available}
onChange={handleChange}
/>

<label>

Company Available

</label>

</div>


<div className="flex gap-4 pt-6">

<button
type="button"
onClick={() => setEditing(false)}
className="flex-1 border rounded-xl py-3"
>

Cancel

</button>

<button
type="submit"
className="flex-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white rounded-xl py-3"
>

Save Changes

</button>

</div>

</form>

</div>

</div>

)}





        </Layout>


)

}