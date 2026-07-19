import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";

import {
    Building2,
    CalendarCheck2,
    Wallet,
    Clock3,
    CheckCircle2,
    RefreshCw,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function CompanyDashboard(){
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const COLORS = [
    "#2E9D47",
    "#0A4429",
    "#F59E0B",
    "#EF4444",
];

    useEffect(() => {

    fetchDashboard();

}, []);

    const fetchDashboard = async () => {

    try {

        setLoading(true);

        const response = await api.get("/company/company_dashboard/");

        setDashboard(response.data);

    } catch (error) {

        console.log(error);

    } finally {

        setLoading(false);

    }

};


if (loading) {

    return (

        <Layout>

            <div className="flex justify-center items-center h-screen">

                <div className="w-12 h-12 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"/>

            </div>

        </Layout>

    );

}


    return(
        <Layout>

<div className="min-h-screen bg-[#F8F9FB] p-8">

<div className="flex flex-col lg:flex-row justify-between items-center mb-10">

    <div className="flex items-center gap-5">

        <img
            src={dashboard.company.logo}
            alt=""
            className="w-20 h-20 rounded-2xl object-cover border"
        />

        <div>

            <h1 className="text-4xl font-bold text-[#0A4429]">

                {dashboard.company.name}

            </h1>

            <p className="text-gray-500 mt-2">

                {dashboard.company.service}

            </p>

            <p className="text-sm text-gray-400">

                {dashboard.company.city},{" "}
                {dashboard.company.country}

            </p>

        </div>

    </div>

    <button

        onClick={fetchDashboard}

        className="mt-6 lg:mt-0 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"

    >

        <RefreshCw size={18}/>

        Refresh Dashboard

    </button>

</div>

<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
    <div className="bg-white rounded-2xl p-6 shadow-sm border">

    <div className="flex justify-between">

        <div>

            <p className="text-gray-500 text-sm">

                Total Bookings

            </p>

            <h2 className="text-3xl font-bold mt-3 text-[#0A4429]">

                {dashboard.summary.total_bookings}

            </h2>

        </div>

        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

            <CalendarCheck2
                className="text-blue-600"
            />

        </div>

    </div>

</div>

<div className="bg-white rounded-2xl p-6 shadow-sm border">

    <div className="flex justify-between">

        <div>

            <p className="text-gray-500 text-sm">

                Pending Bookings

            </p>

            <h2 className="text-3xl font-bold mt-3 text-orange-600">

                {dashboard.summary.pending_bookings}

            </h2>

        </div>

        <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">

            <Clock3
                className="text-orange-600"
            />

        </div>

    </div>

</div>

<div className="bg-white rounded-2xl p-6 shadow-sm border">

    <div className="flex justify-between">

        <div>

            <p className="text-gray-500 text-sm">

                Completed Jobs

            </p>

            <h2 className="text-3xl font-bold mt-3 text-green-600">

                {dashboard.summary.completed_bookings}

            </h2>

        </div>

        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

            <CheckCircle2
                className="text-green-600"
            />

        </div>

    </div>

</div>

<div className="bg-white rounded-2xl p-6 shadow-sm border">

    <div className="flex justify-between">

        <div>

            <p className="text-gray-500 text-sm">

                Wallet Balance

            </p>

            <h2 className="text-3xl font-bold mt-3 text-[#0A4429]">

                Ksh {dashboard.summary.wallet_balance.toLocaleString()}

            </h2>

        </div>

        <div className="w-14 h-14 rounded-xl bg-[#2E9D47]/10 flex items-center justify-center">

            <Wallet
                className="text-[#2E9D47]"
            />

        </div>

    </div>

</div>




</div>

{/* ================= ANALYTICS ================= */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

    <div className="mb-6">

        <h2 className="text-xl font-bold text-[#0A4429]">
            Monthly Revenue
        </h2>

        <p className="text-gray-500 text-sm">
            Revenue earned each month
        </p>

    </div>

    <div className="h-[320px]">

        <ResponsiveContainer width="100%" height="100%">

            <BarChart
                data={dashboard.monthly_revenue}
            >

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>

                <Bar
                    dataKey="amount"
                    fill="#2E9D47"
                    radius={[8,8,0,0]}
                />

            </BarChart>

        </ResponsiveContainer>

    </div>

</div>
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

    <div className="mb-6">

        <h2 className="text-xl font-bold text-[#0A4429]">
            Monthly Bookings
        </h2>

        <p className="text-gray-500 text-sm">
            Number of bookings received
        </p>

    </div>

    <div className="h-[320px]">

        <ResponsiveContainer width="100%" height="100%">

            <LineChart
                data={dashboard.monthly_bookings}
            >

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>

                <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#0A4429"
                    strokeWidth={3}
                />

            </LineChart>

        </ResponsiveContainer>

    </div>

</div>

</div>
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">

    <div className="mb-6">

        <h2 className="text-xl font-bold text-[#0A4429]">
            Booking Status
        </h2>

        <p className="text-gray-500 text-sm">
            Distribution of all bookings
        </p>

    </div>

    <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

            <PieChart>

                <Pie
                    data={dashboard.booking_status}
                    dataKey="value"
                    nameKey="status"
                    outerRadius={120}
                    label
                >

                    {dashboard.booking_status.map((entry, index) => (

                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />

                    ))}

                </Pie>

                <Tooltip/>

                <Legend/>

            </PieChart>

        </ResponsiveContainer>

    </div>

</div>
{/* ================= Wallet + Company ================= */}

<div className="grid lg:grid-cols-3 gap-8 mb-10">
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

    <h2 className="text-xl font-bold text-[#0A4429] mb-6">

        Wallet Summary

    </h2>

    <div className="space-y-5">

        <div className="flex justify-between">

            <span className="text-gray-500">

                Available Balance

            </span>

            <span className="font-bold text-green-600">

                KES {dashboard.wallet.available_balance.toLocaleString()}

            </span>

        </div>

        <div className="flex justify-between">

            <span className="text-gray-500">

                Pending Balance

            </span>

            <span className="font-bold text-orange-600">

                KES {dashboard.wallet.pending_balance.toLocaleString()}

            </span>

        </div>

        <div className="flex justify-between">

            <span className="text-gray-500">

                Float Balance

            </span>

            <span className="font-bold text-blue-600">

                KES {dashboard.wallet.float_balance.toLocaleString()}

            </span>

        </div>

    </div>

</div>

<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">

    <div className="flex items-center gap-5">

        <img

            src={dashboard.company.logo}

            className="w-24 h-24 rounded-2xl object-cover border"

        />

        <div>

            <h2 className="text-2xl font-bold text-[#0A4429]">

                {dashboard.company.name}

            </h2>

            <p className="text-gray-500 mt-2">

                {dashboard.company.service}

            </p>

            <p className="text-sm text-gray-400 mt-1">

                {dashboard.company.city}, {dashboard.company.country}

            </p>

        </div>

    </div>

    <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div>

            <p className="text-sm text-gray-400">

                Email

            </p>

            <p className="font-medium">

                {dashboard.company.email}

            </p>

        </div>

        <div>

            <p className="text-sm text-gray-400">

                Phone

            </p>

            <p className="font-medium">

                {dashboard.company.phone_number}

            </p>

        </div>

        <div>

            <p className="text-sm text-gray-400">

                Website

            </p>

            <p className="font-medium">

                {dashboard.company.website || "--"}

            </p>

        </div>

        <div>

            <p className="text-sm text-gray-400">

                Professionals

            </p>

            <p className="font-medium">

                {dashboard.company.professionals}

            </p>

        </div>

    </div>

</div>

</div>

<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">

    <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold text-[#0A4429]">

            Recent Bookings

        </h2>

    </div>

    <div className="overflow-x-auto">

        <table className="w-full">

            <thead>

                <tr className="border-b">

                    <th className="text-left py-3">Customer</th>

                    <th className="text-left">Service</th>

                    <th className="text-left">Budget</th>

                    <th className="text-left">Date</th>

                    <th className="text-left">Status</th>

                </tr>

            </thead>

            <tbody>

                {dashboard.recent_bookings.map((booking) => (

                    <tr
                        key={booking.id}
                        className="border-b hover:bg-gray-50"
                    >

                        <td className="py-4">

                            {booking.customer}

                        </td>

                        <td>

                            {booking.title}

                        </td>

                        <td>

                            KES {booking.budget.toLocaleString()}

                        </td>

                        <td>

                            {booking.preferred_date}

                        </td>

                        <td>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold

                                ${
                                    booking.status === "completed"

                                        ? "bg-green-100 text-green-700"

                                    : booking.status === "accepted"

                                        ? "bg-blue-100 text-blue-700"

                                    : booking.status === "pending"

                                        ? "bg-orange-100 text-orange-700"

                                    : "bg-red-100 text-red-700"

                                }

                                `}
                            >

                                {booking.status}

                            </span>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>

<div className="grid md:grid-cols-4 gap-5">

    <button className="bg-[#2E9D47] text-white rounded-2xl p-6 hover:bg-[#0A4429] transition">

        View Bookings

    </button>

    <button className="bg-white rounded-2xl border p-6 hover:border-[#2E9D47] transition">

        Manage Professionals

    </button>

    <button className="bg-white rounded-2xl border p-6 hover:border-[#2E9D47] transition">

        Wallet

    </button>

    <button className="bg-white rounded-2xl border p-6 hover:border-[#2E9D47] transition">

        Edit Company

    </button>

</div>



</div>

</Layout>

    )
}