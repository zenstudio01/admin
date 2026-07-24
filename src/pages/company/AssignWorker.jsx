import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/api";
import Layout from "../../layouts/Layout";

export default function AssignWorker() {
  const { bookingId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(null);

  const [workers, setWorkers] = useState([]);

  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [bookingRes, workersRes] = await Promise.all([
        api.get(`/company/booking_details/${bookingId}/`),
        api.get("/company/get_company_professionals/"),
      ]);

      setBooking(bookingRes.data.booking);

      setWorkers(workersRes.data.professionals);
    } catch (e) {
      console.log(e);

      Swal.fire(
        "Error",
        "Unable to load booking.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const assignWorker = async () => {
    if (!selectedWorker) {
      Swal.fire(
        "Select Worker",
        "Please select a professional.",
        "warning"
      );
      return;
    }

    try {
      await api.post(`/company/assign_worker/${bookingId}/`, {
        worker_id: selectedWorker,
      });

      Swal.fire(
        "Success",
        "Worker assigned successfully.",
        "success"
      );

      navigate("/company-bookings");
    } catch (e) {
      console.log(e.response?.data);

      Swal.fire(
        "Error",
        e.response?.data?.message ||
          "Unable to assign worker.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-32">
          <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-3xl font-black text-[#0A4429]">
          Assign Professional
        </h1>

        <p className="text-gray-500 mt-2">
          Choose the professional who will handle this booking.
        </p>

        {/* Booking */}

        <div className="bg-white rounded-2xl border p-6 mt-8">

          <h2 className="font-bold text-xl">
            {booking.title}
          </h2>

          <p className="text-gray-500 mt-2">
            {booking.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mt-6">

            <div>

              <p className="text-sm text-gray-500">
                Customer
              </p>

              <p className="font-bold">
                {booking.customer.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Budget
              </p>

              <p className="font-bold">
                KES {booking.budget}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Preferred Date
              </p>

              <p>{booking.preferred_date}</p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Preferred Time
              </p>

              <p>{booking.preferred_time}</p>

            </div>

          </div>

        </div>

        <h2 className="font-black text-2xl mt-10">
          Company Professionals
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

          {workers.map((worker) => (

            <div
              key={worker.id}
              onClick={() => setSelectedWorker(worker.id)}
              className={`cursor-pointer rounded-2xl border transition p-6 ${
                selectedWorker === worker.id
                  ? "border-green-600 bg-green-50"
                  : "bg-white hover:border-green-300"
              }`}
            >

              <div className="flex justify-center">

                <img
                  src={worker.image}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover"
                />

              </div>

              <h3 className="text-center font-black text-lg mt-4">

                {worker.name}

              </h3>

              <div className="flex justify-center mt-2">

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">

                  {worker.profession}

                </span>

              </div>

              <div className="mt-6 space-y-2 text-sm">

                <div className="flex items-center gap-2">

                  <Phone size={16} />

                  {worker.phone}

                </div>

                <div className="flex items-center gap-2">

                  <Briefcase size={16} />

                  {worker.experience} Years Experience

                </div>

              </div>

              {selectedWorker === worker.id && (

                <div className="mt-6 flex justify-center text-green-600">

                  <CheckCircle size={28} />

                </div>

              )}

            </div>

          ))}

        </div>

        <div className="mt-10">

          <button
            onClick={assignWorker}
            className="w-full bg-[#0A4429] hover:bg-[#2E9D47] text-white py-4 rounded-xl font-bold text-lg"
          >
            Assign Selected Professional
          </button>

        </div>

      </div>
    </Layout>
  );
}