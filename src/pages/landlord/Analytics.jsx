import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";

import {
    RefreshCw,
    Download,
    Filter,
    Wallet,
    TrendingUp,
    Percent,
    Clock3,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function LandlordAnalytics() {

    const [loading,setLoading] = useState(true);

    const [analytics,setAnalytics] = useState({});

    const [properties,setProperties] = useState([]);

    const [selectedProperty,setSelectedProperty] = useState("");

    const [startDate,setStartDate] = useState(null);

    const [endDate,setEndDate] = useState(null);

    useEffect(()=>{

        fetchAnalytics();
        fetchProperties();

    },[]);



    const fetchAnalytics = async ()=>{

    try{

        setLoading(true);

        const response = await api.get("/landlords/landlord_analytics/",{

            params:{
                property:selectedProperty,
                start_date:startDate,
                end_date:endDate
            }

        });

        setAnalytics(response.data);

    }

    catch(error){

        console.log(error);

    }

    finally{

        setLoading(false);

    }

}


const fetchProperties = async()=>{

    try{

        const response = await api.get("/property_list/");

        setProperties(response.data);

    }

    catch(error){

        console.log(error);

    }

}


const applyFilters = ()=>{

    fetchAnalytics();

}

if(loading){

    return(

        <Layout>

            <div className="h-screen flex justify-center items-center">

                <div className="w-10 h-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"/>

            </div>

        </Layout>

    )

}

return(

<Layout>

<div className="min-h-screen bg-[#F7F8F9] p-8">
    <div className="flex justify-between items-center mb-8">

    <div>

        <p className="text-[#2E9D47] uppercase text-sm font-bold tracking-widest">

            Landlord Analytics

        </p>

        <h1 className="text-4xl font-bold text-[#0A4429] mt-2">

            Property Performance Analytics

        </h1>

        <p className="text-gray-500 mt-2">

            Analyze rental income, occupancy trends and portfolio performance.

        </p>

    </div>

    <div className="flex gap-3">

        <button
        onClick={fetchAnalytics}
        className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl hover:bg-gray-50">

            <RefreshCw size={18}/>

            Refresh

        </button>

        <button
        className="flex items-center gap-2 bg-[#2E9D47] text-white px-5 py-3 rounded-xl hover:bg-[#0A4429]">

            <Download size={18}/>

            Export Report

        </button>

    </div>

</div>


<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">

    <div className="flex items-center gap-2 mb-6">

        <Filter size={18} className="text-[#2E9D47]"/>

        <h2 className="font-bold text-lg">

            Analytics Filters

        </h2>

    </div>

    <div className="grid lg:grid-cols-4 gap-5">

        <div>

            <label className="block text-sm font-medium mb-2">

                Property

            </label>

            <select
            value={selectedProperty}
            onChange={(e)=>setSelectedProperty(e.target.value)}
            className="w-full border rounded-xl p-3">

                <option value="">

                    All Properties

                </option>

                {properties.map(property=>(

                    <option
                    key={property.id}
                    value={property.id}>

                        {property.name}

                    </option>

                ))}

            </select>

        </div>

        <div>

            <label className="block text-sm font-medium mb-2">

                Start Date

            </label>

            <DatePicker
            selected={startDate}
            onChange={(date)=>setStartDate(date)}
            className="w-full border rounded-xl p-3"
            placeholderText="Select start date"
            />

        </div>

        <div>

            <label className="block text-sm font-medium mb-2">

                End Date

            </label>

            <DatePicker
            selected={endDate}
            onChange={(date)=>setEndDate(date)}
            className="w-full border rounded-xl p-3"
            placeholderText="Select end date"
            />

        </div>

        <div className="flex items-end">

            <button
            onClick={applyFilters}
            className="w-full bg-[#2E9D47] hover:bg-[#0A4429] text-white rounded-xl p-3 font-semibold">

                Apply Filters

            </button>

        </div>

    </div>

</div>

{/* ================= KPI CARDS ================= */}

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

    {/* Revenue */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

        <div className="flex justify-between items-start">

            <div>

                <p className="text-sm text-gray-500">
                    Total Revenue
                </p>

                <h2 className="text-3xl font-bold text-[#0A4429] mt-3">
                    KES {(analytics.summary?.total_revenue || 0).toLocaleString()}
                </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

                <Wallet className="text-[#2E9D47]" size={28}/>

            </div>

        </div>

        <div className="flex items-center gap-2 mt-6">

            <ArrowUpRight
                size={16}
                className="text-green-600"
            />

            <span className="text-green-600 text-sm font-semibold">

                Income Generated

            </span>

        </div>

    </div>

    {/* Pending Rent */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

        <div className="flex justify-between">

            <div>

                <p className="text-sm text-gray-500">

                    Pending Rent

                </p>

                <h2 className="text-3xl font-bold text-[#0A4429] mt-3">

                    KES {(analytics.summary?.pending_rent || 0).toLocaleString()}

                </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

                <Clock3
                    className="text-red-600"
                    size={28}
                />

            </div>

        </div>

        <div className="flex items-center gap-2 mt-6">

            <ArrowDownRight
                size={16}
                className="text-red-500"
            />

            <span className="text-red-500 text-sm font-semibold">

                Awaiting Payment

            </span>

        </div>

    </div>

    {/* Occupancy */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

        <div className="flex justify-between">

            <div>

                <p className="text-sm text-gray-500">

                    Occupancy Rate

                </p>

                <h2 className="text-3xl font-bold text-[#0A4429] mt-3">

                    {analytics.summary?.occupancy_rate || 0}%

                </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                <Percent
                    className="text-blue-600"
                    size={28}
                />

            </div>

        </div>

        <div className="mt-6">

            <div className="w-full bg-gray-100 rounded-full h-2">

                <div
                    className="bg-[#2E9D47] h-2 rounded-full"
                    style={{
                        width: `${analytics.summary?.occupancy_rate || 0}%`,
                    }}
                />

            </div>

        </div>

    </div>

    {/* Collection Rate */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

        <div className="flex justify-between">

            <div>

                <p className="text-sm text-gray-500">

                    Collection Rate

                </p>

                <h2 className="text-3xl font-bold text-[#0A4429] mt-3">

                    {analytics.summary?.collection_rate || 0}%

                </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

                <TrendingUp
                    className="text-purple-600"
                    size={28}
                />

            </div>

        </div>

        <div className="mt-6">

            <div className="w-full bg-gray-100 rounded-full h-2">

                <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                        width: `${analytics.summary?.collection_rate || 0}%`,
                    }}
                />

            </div>

        </div>

    </div>

</div>

</div>

</Layout>

)
}