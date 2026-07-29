import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Eye,
  UserPlus,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/api";
import Colors from "../../constants/colors";
import Layout from "../../layouts/Layout";

export default function CompanyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let data = bookings;

    if (status !== "all") {
      data = data.filter((b) => b.status === status);
    }

    if (search.trim() !== "") {
      const query = search.toLowerCase();
      data = data.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(query) ||
          (b.customer_name || "").toLowerCase().includes(query)
      );
    }

    setFiltered(data);
  }, [search, status, bookings]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get_company_bookings/");
      const fetchedBookings = response.data?.bookings || [];
      setBookings(fetchedBookings);
      setFiltered(fetchedBookings);
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load company bookings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (id) => {
    try {
      await api.post(`/accept_booking/${id}/`);
      Swal.fire({
        icon: "success",
        title: "Accepted",
        text: "Booking request accepted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      loadBookings();
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: e.response?.data?.message || "Unable to accept booking.",
      });
    }
  };

  const rejectBooking = async (id) => {
    const result = await Swal.fire({
      title: "Reject Booking?",
      text: "Are you sure you want to decline this customer request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Reject",
    });

    if (!result.isConfirmed) return;

    try {
      await api.post(`/reject_booking/${id}/`);
      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Booking request rejected.",
        timer: 2000,
        showConfirmButton: false,
      });
      loadBookings();
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: e.response?.data?.message || "Unable to reject booking.",
      });
    }
  };

  const badgeColor = (bookingStatus) => {
    switch (bookingStatus) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "assigned":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Booking Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review, accept, and assign incoming customer service orders.
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex bg-white rounded-xl flex-1 px-4 items-center border border-gray-100 shadow-2xs">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              className="flex-1 outline-none p-3 text-sm text-slate-800"
              placeholder="Search by title or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-2xs text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div
              className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: `${Colors.primary} transparent transparent transparent`,
              }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <p className="text-sm font-medium">No bookings found matching criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="font-bold text-lg text-slate-900 leading-snug">
                      {booking.title || "Untitled Booking"}
                    </h2>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize shrink-0 ${badgeColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                    {booking.description || "No description provided."}
                  </p>

                  <div className="space-y-2.5 mt-5 text-xs text-gray-600 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2">
                      <User size={15} className="text-gray-400 shrink-0" />
                      <span className="font-medium text-slate-800">
                        {booking.customer_name || "Customer"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-gray-400 shrink-0" />
                      <span>{booking.location || "Location pending"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-gray-400 shrink-0" />
                      <span>{booking.preferred_date || "--"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-gray-400 shrink-0" />
                      <span>{booking.preferred_time || "--"}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-medium block">
                      Agreed Budget
                    </span>
                    <p
                      className="font-black text-2xl mt-0.5"
                      style={{ color: Colors.primary }}
                    >
                      KES {Number(booking.budget || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/booking-details/${booking.id}`)}
                      className="bg-gray-50 hover:bg-gray-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2"
                    >
                      <Eye size={15} />
                      View Details
                    </button>

                    {booking.status === "accepted" && (
                      <button
                        onClick={() => navigate(`/assign-worker/${booking.id}`)}
                        className="text-white py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90 flex justify-center items-center gap-2"
                        style={{ backgroundColor: Colors.primary }}
                      >
                        <UserPlus size={15} />
                        Assign Staff
                      </button>
                    )}
                  </div>

                  {booking.status === "pending" && (
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        onClick={() => acceptBooking(booking.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2"
                      >
                        <CheckCircle size={15} />
                        Accept
                      </button>

                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2"
                      >
                        <XCircle size={15} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}