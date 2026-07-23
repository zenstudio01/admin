import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import Swal from "sweetalert2";
import {
  Megaphone,
  Plus,
  Trash2,
  Pencil,
  Building2,
  Home,
  Globe,
  X
} from "lucide-react";

export default function Announcements() {

  const [loading, setLoading] = useState(false);

  const [announcements, setAnnouncements] = useState([]);

  const [properties, setProperties] = useState([]);

  const [units, setUnits] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    target: "all",
    property_id: "",
    unit_id: ""
  });

  useEffect(() => {
    loadAnnouncements();
    loadProperties();
  }, []);

  const loadAnnouncements = async () => {

    try {

      setLoading(true);

      const res = await api.get("/get_announcements/");

      setAnnouncements(res.data.announcements);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }

  };

  const loadProperties = async () => {

    try {

      const res = await api.get("/property_list/");

      setProperties(res.data);

    } catch (e) {
      console.log(e);
    }

  };

  const loadUnits = async (propertyId) => {

    try {

      const res = await api.get(`/property_units/${propertyId}/`);

      setUnits(res.data.units);

    } catch (e) {
      console.log(e);
    }

  };

  const createAnnouncement = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/create_announcement/",
        form
      );

      Swal.fire({
        icon: "success",
        title: "Announcement Created",
        timer: 2000,
        showConfirmButton: false
      });

      setModalOpen(false);

      setForm({
        title: "",
        message: "",
        target: "all",
        property_id: "",
        unit_id: ""
      });

      loadAnnouncements();

    } catch (e) {

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: e.response?.data?.message
      });

    }

  };

  const deleteAnnouncement = (id) => {

    Swal.fire({
      title: "Delete announcement?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626"
    }).then(async(result)=>{

      if(!result.isConfirmed) return;

      await api.delete(
        `/delete_announcement/${id}/`
      );

      loadAnnouncements();

    });

  };

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50 p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold text-[#0A4429]">
              Announcements
            </h1>

            <p className="text-gray-500">
              Notify tenants about important updates.
            </p>

          </div>

          <button
            onClick={()=>setModalOpen(true)}
            className="bg-[#2E9D47] text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus size={18}/>
            New Announcement
          </button>

        </div>

        {loading ? (

          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>

        ) : (

          <div className="grid gap-5">

            {announcements.map(item=>(

              <div
                key={item.id}
                className="bg-white rounded-2xl border p-6"
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {item.message}
                    </p>

                    <div className="flex gap-4 mt-4 text-sm">

                      {item.target==="all" && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Globe size={15}/>
                          All Tenants
                        </span>
                      )}

                      {item.target==="property" && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Building2 size={15}/>
                          {item.property}
                        </span>
                      )}

                      {item.target==="unit" && (
                        <span className="flex items-center gap-1 text-purple-600">
                          <Home size={15}/>
                          {item.unit}
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-gray-400 mt-4">
                      {item.created_at}
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      className="text-blue-600"
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      onClick={()=>deleteAnnouncement(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={18}/>
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {modalOpen && (

          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <div className="bg-white rounded-2xl w-full max-w-lg">

              <div className="flex justify-between items-center p-6 border-b">

                <h2 className="text-xl font-bold">
                  Create Announcement
                </h2>

                <button
                  onClick={()=>setModalOpen(false)}
                >
                  <X/>
                </button>

              </div>

              <form
                onSubmit={createAnnouncement}
                className="p-6 space-y-5"
              >

                <input
                  placeholder="Title"
                  className="w-full border rounded-xl p-3"
                  value={form.title}
                  onChange={(e)=>setForm({...form,title:e.target.value})}
                />

                <textarea
                  rows={5}
                  placeholder="Announcement message..."
                  className="w-full border rounded-xl p-3"
                  value={form.message}
                  onChange={(e)=>setForm({...form,message:e.target.value})}
                />

                <select
                  className="w-full border rounded-xl p-3"
                  value={form.target}
                  onChange={(e)=>setForm({...form,target:e.target.value})}
                >
                  <option value="all">All Tenants</option>
                  <option value="property">Specific Property</option>
                  <option value="unit">Specific Unit</option>
                </select>

                {form.target==="property" && (

                  <select
                    className="w-full border rounded-xl p-3"
                    value={form.property_id}
                    onChange={(e)=>{
                      setForm({...form,property_id:e.target.value});
                      loadUnits(e.target.value);
                    }}
                  >

                    <option>Select Property</option>

                    {properties.map(property=>(

                      <option
                        key={property.id}
                        value={property.id}
                      >
                        {property.name}
                      </option>

                    ))}

                  </select>

                )}

                {form.target==="unit" && (

                  <>
                    <select
                      className="w-full border rounded-xl p-3"
                      onChange={(e)=>{
                        setForm({...form,property_id:e.target.value});
                        loadUnits(e.target.value);
                      }}
                    >

                      <option>Select Property</option>

                      {properties.map(property=>(

                        <option
                          key={property.id}
                          value={property.id}
                        >
                          {property.name}
                        </option>

                      ))}

                    </select>

                    <select
                      className="w-full border rounded-xl p-3"
                      value={form.unit_id}
                      onChange={(e)=>setForm({...form,unit_id:e.target.value})}
                    >

                      <option>Select Unit</option>

                      {units.map(unit=>(

                        <option
                          key={unit.id}
                          value={unit.id}
                        >
                          {unit.unit_number}
                        </option>

                      ))}

                    </select>

                  </>

                )}

                <button
                  className="w-full bg-[#2E9D47] text-white py-3 rounded-xl font-semibold"
                >
                  Send Announcement
                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </Layout>
  );

}