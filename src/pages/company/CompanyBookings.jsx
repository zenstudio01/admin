import { useEffect, useState } from "react";
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

    if (search !== "") {
      data = data.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.customer_name
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, status, bookings]);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_company_bookings/");

      setBookings(response.data.bookings);

      setFiltered(response.data.bookings);
    } catch (e) {
      Swal.fire(
        "Error",
        "Unable to load bookings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (id) => {
    try {
      await api.post(`/accept_booking/${id}/`);

      Swal.fire(
        "Success",
        "Booking accepted.",
        "success"
      );

      loadBookings();
    } catch (e) {
      Swal.fire(
        "Error",
        e.response?.data?.message,
        "error"
      );
    }
  };

  const rejectBooking = async (id) => {
    const result = await Swal.fire({
      title: "Reject Booking?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await api.post(`/reject_booking/${id}/`);

      Swal.fire(
        "Success",
        "Booking rejected.",
        "success"
      );

      loadBookings();
    } catch (e) {
      Swal.fire(
        "Error",
        e.response?.data?.message,
        "error"
      );
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "assigned":
        return "bg-purple-100 text-purple-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100";
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-black text-[#0A4429]">
              Booking Requests
            </h1>

            <p className="text-gray-500 mt-1">
              Manage customer bookings.
            </p>

          </div>

        </div>

        {/* Filters */}

        <div className="flex gap-4 mt-8">

          <div className="flex bg-white rounded-xl flex-1 px-4 items-center">

            <Search size={18} />

            <input
              className="flex-1 outline-none p-3"
              placeholder="Search booking..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="bg-white rounded-xl px-4"
          >
            <option value="all">All</option>
            <option value="pending">
              Pending
            </option>
            <option value="accepted">
              Accepted
            </option>
            <option value="assigned">
              Assigned
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="rejected">
              Rejected
            </option>
          </select>

        </div>

        {loading ? (

          <div className="flex justify-center py-24">

            <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            {filtered.map((booking) => (

              <div
                key={booking.id}
                className="bg-white rounded-2xl border p-6 shadow-sm"
              >

                <div className="flex justify-between">

                  <h2 className="font-black text-xl">
                    {booking.title}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${badgeColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <p className="text-gray-500 mt-3 line-clamp-3">
                  {booking.description}
                </p>

                <div className="space-y-3 mt-5 text-sm">

                  <div className="flex items-center gap-2">

                    <User size={16} />

                    {booking.customer_name}

                  </div>

                  <div className="flex items-center gap-2">

                    <MapPin size={16} />

                    {booking.location}

                  </div>

                  <div className="flex items-center gap-2">

                    <Calendar size={16} />

                    {booking.preferred_date}

                  </div>

                  <div className="flex items-center gap-2">

                    <Clock size={16} />

                    {booking.preferred_time}

                  </div>

                </div>

                <div className="mt-6">

                  <p className="text-green-700 font-black text-2xl">
                    KES {booking.budget}
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <button
                    onClick={() =>
                      navigate(
                        `/booking-details/${booking.id}`
                      )
                    }
                    className="bg-gray-100 py-3 rounded-xl flex justify-center items-center gap-2"
                  >
                    <Eye size={17} />
                    Details
                  </button>

                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          acceptBooking(
                            booking.id
                          )
                        }
                        className="bg-green-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
                      >
                        <CheckCircle size={17} />
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          rejectBooking(
                            booking.id
                          )
                        }
                        className="bg-red-600 text-white py-3 rounded-xl flex justify-center items-center gap-2 col-span-2"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === "accepted" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/assign-worker/${booking.id}`
                        )
                      }
                      className="bg-[#0A4429] text-white py-3 rounded-xl flex justify-center items-center gap-2 col-span-2"
                    >
                      <UserPlus size={17} />
                      Assign Worker
                    </button>
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