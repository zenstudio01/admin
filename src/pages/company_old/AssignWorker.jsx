import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Briefcase,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  Check,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/api";
import Layout from "../../layouts/Layout";
import Colors from "../../constants/colors"; // Make sure this path matches your project structure

export default function AssignWorker() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [bookingRes, workersRes] = await Promise.all([
        api.get(`/company/booking_details/${bookingId}/`),
        api.get("/company/get_company_professionals/"),
      ]);

      setBooking(bookingRes.data?.booking || null);
      setWorkers(workersRes.data?.professionals || []);
    } catch (e) {
      console.error("Error loading booking details:", e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load booking details or professionals list.",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignWorker = async () => {
    if (!selectedWorker) {
      Swal.fire({
        icon: "warning",
        title: "Select Professional",
        text: "Please select a professional from the list before proceeding.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/company/assign_worker/${bookingId}/`, {
        worker_id: selectedWorker,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Professional assigned to booking successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/company-bookings");
    } catch (e) {
      console.error("Error assigning worker:", e.response?.data);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: e.response?.data?.message || "Unable to assign worker.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${Colors.primary || "#0A4429"} transparent transparent transparent`,
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
        <div className="max-w-6xl mx-auto">
          {/* Back Button & Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-slate-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Assign Professional
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Select a skilled team member to handle this service booking.
              </p>
            </div>
          </div>

          {/* Booking Summary Card */}
          {booking && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-6 md:p-8 mb-10">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Booking Title
                  </span>
                  <h2 className="font-bold text-xl md:text-2xl text-slate-900 mt-1">
                    {booking.title || "Service Request"}
                  </h2>
                </div>
                {booking.status && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1 rounded-full text-xs font-bold capitalize">
                    {booking.status}
                  </span>
                )}
              </div>

              {booking.description && (
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {booking.description}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-gray-50 p-5 rounded-2xl">
                <div>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <User size={14} /> Customer
                  </p>
                  <p className="font-bold text-slate-800 text-sm mt-1">
                    {booking.customer?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <DollarSign size={14} /> Budget
                  </p>
                  <p
                    className="font-extrabold text-sm mt-1"
                    style={{ color: Colors.primary }}
                  >
                    KES {Number(booking.budget || 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <Calendar size={14} /> Preferred Date
                  </p>
                  <p className="font-bold text-slate-800 text-sm mt-1">
                    {booking.preferred_date || "Flexible"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <Clock size={14} /> Preferred Time
                  </p>
                  <p className="font-bold text-slate-800 text-sm mt-1">
                    {booking.preferred_time || "Flexible"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Professionals List Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Company Professionals
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Click on a professional card to mark them for assignment.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-200/60 px-3 py-1 rounded-full">
              {workers.length} Available
            </span>
          </div>

          {/* Professionals Grid */}
          {workers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center my-6 flex flex-col items-center justify-center shadow-2xs">
              <div className="p-4 bg-amber-50 rounded-full mb-3 text-amber-500">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No Professionals Found
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                You haven't registered any company professionals yet. Add team members to assign them to client bookings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => {
                const isSelected = selectedWorker === worker.id;

                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker.id)}
                    className={`relative cursor-pointer rounded-3xl border p-6 transition-all duration-200 flex flex-col items-center text-center ${
                      isSelected
                        ? "bg-emerald-50/50 shadow-md ring-2"
                        : "bg-white hover:shadow-md border-gray-100"
                    }`}
                    style={{
                      borderColor: isSelected
                        ? Colors.primary
                        : undefined,
                      ringColor: isSelected ? Colors.primary : undefined,
                    }}
                  >
                    {/* Top Selected Indicator Badge */}
                    {isSelected && (
                      <div
                        className="absolute top-4 right-4 w-7 h-7 rounded-full text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: Colors.primary }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}

                    {/* Avatar */}
                    <div className="relative mb-4">
                      <img
                        src={
                          worker.image ||
                          worker.profile_picture ||
                          "https://via.placeholder.com/150?text=Worker"
                        }
                        alt={worker.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-100 shadow-2xs"
                      />
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg">
                      {worker.name || "Unnamed Professional"}
                    </h3>

                    <span className="bg-emerald-100/70 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs mt-2 capitalize">
                      {worker.profession || "General Specialist"}
                    </span>

                    <div className="mt-6 w-full pt-4 border-t border-gray-100/80 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span>{worker.phone || worker.phone_number || "--"}</span>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Briefcase size={14} className="text-gray-400" />
                        <span>
                          {worker.experience
                            ? `${worker.experience} Years Experience`
                            : "Experience not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirm Action Bar */}
          <div className="mt-10">
            <button
              onClick={assignWorker}
              disabled={submitting || !selectedWorker}
              className="w-full text-white py-4 rounded-2xl font-bold text-base shadow-2xs hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: Colors.primary }}
            >
              {submitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} />
                  Assign Selected Professional
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}