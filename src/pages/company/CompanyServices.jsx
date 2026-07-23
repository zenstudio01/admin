import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Clock,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/api";
import Layout from "../../layouts/Layout";
import { useNavigate } from "react-router-dom";

export default function CompanyServices() {
    const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    setFiltered(
      services.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, services]);

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/get_company_services/");

      setServices(response.data.services);
      setFiltered(response.data.services);

    } catch (e) {
      console.log(e);

      Swal.fire(
        "Error",
        "Unable to load services.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {

    const result = await Swal.fire({
      title: "Delete Service?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {

      await api.delete(`/delete_company_service/${id}/`);

      Swal.fire(
        "Deleted",
        "Service removed.",
        "success"
      );

      loadServices();

    } catch (e) {

      Swal.fire(
        "Error",
        "Unable to delete service.",
        "error"
      );

    }
  };

  return (
    <Layout>

      <div className="p-8 bg-gray-50 min-h-screen">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-black text-[#0A4429]">
              Company Services
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all services offered by your company.
            </p>

          </div>

          <button
            onClick={() => navigate("/add-service")}
            className="bg-[#0A4429] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#2E9D47]"
          >
            <Plus size={18}/>
            Add Service
          </button>

        </div>

        {/* Search */}

        <div className="bg-white rounded-xl mt-8 p-4 flex items-center">

          <Search className="text-gray-400"/>

          <input
            className="ml-3 outline-none flex-1"
            placeholder="Search service..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

        </div>

        {/* Services */}

        {loading ? (

          <div className="flex justify-center py-24">

            <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"/>

          </div>

        ) : filtered.length===0 ? (

          <div className="bg-white rounded-xl p-20 text-center mt-10">

            <Tag
              size={60}
              className="mx-auto text-gray-300"
            />

            <h2 className="font-bold text-xl mt-4">
              No Services
            </h2>

            <p className="text-gray-500">
              Start by adding your first service.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

            {filtered.map(service=>(

              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border"
              >

                <img
                  src={service.image}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">

                  <div className="flex justify-between">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold capitalize">
                      {service.category}
                    </span>

                    {service.is_active ? (

                      <span className="text-green-600 flex items-center gap-1">

                        <ToggleRight/>

                        Active

                      </span>

                    ) : (

                      <span className="text-red-600 flex items-center gap-1">

                        <ToggleLeft/>

                        Inactive

                      </span>

                    )}

                  </div>

                  <h2 className="font-black text-xl mt-4">
                    {service.title}
                  </h2>

                  <p className="text-gray-500 mt-2 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center mt-5 text-sm text-gray-600">

                    <Clock
                      size={16}
                      className="mr-2"
                    />

                    {service.duration}

                  </div>

                  <div className="mt-5">

                    <p className="text-green-700 font-black text-xl">

                      KES {service.minimum_price} - {service.maximum_price}

                    </p>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        window.location.href=`/company/edit-service/${service.id}`
                      }
                      className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl flex justify-center items-center gap-2"
                    >

                      <Pencil size={17}/>

                      Edit

                    </button>

                    <button
                      onClick={()=>deleteService(service.id)}
                      className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl flex justify-center items-center gap-2"
                    >

                      <Trash2 size={17}/>

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </Layout>
  );
}