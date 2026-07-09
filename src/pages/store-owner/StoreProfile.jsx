import { useEffect, useState } from "react";
import axios from "axios";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  FileText,
  Save,
} from "lucide-react";
import api from "../../api/api";
import Layout from "../../layouts/Layout";

export default function StoreProfile() {
  const token = localStorage.getItem("access");

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    store_name: "",
    location: "",
    phone_number: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    setLoading(true); 
    try {
      const res = await api.get(`/store/profile/`);

      setForm(res.data);

    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);

      await api.put(`/store/profile_update/`,form);

      alert("Store profile updated successfully!");

    } catch (err) {
      alert("Failed to update store.");

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

        <div className="p-8 border-b">

          <div className="flex items-center gap-3">

            <div className="bg-[#0A4429]/10 p-3 rounded-xl">
              <Store className="text-[#0A4429]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Store Profile
              </h2>

              <p className="text-gray-500">
                Manage your business information.
              </p>

            </div>

          </div>

        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={saveProfile}>

          <div>

            <label className="block mb-2 font-medium">
              Store Name
            </label>

            <div className="relative">

              <Store
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                name="store_name"
                required
                placeholder="Enter your store name"
                value={form.store_name}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-xl"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Location
            </label>

            <div className="relative">

              <MapPin
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                name="location"
                required
                placeholder="Enter location of your store"
                value={form.location}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-xl"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <div className="relative">

              <Phone
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                name="phone_number"
                required
                placeholder="Enter phone number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-xl"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                name="email"
                required
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-xl"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <div className="relative">

              <FileText
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <textarea
                rows={4}
                name="description"
                required
                placeholder="Enter store description"
                value={form.description}
                onChange={handleChange}
                className="w-full pl-10 pt-3 border rounded-xl"
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0A4429] hover:bg-[#083821] text-white px-8 py-3 rounded-xl flex items-center gap-2"
          >
            <Save size={18} />

            {isSaving ? "Saving..." : "Save Changes"}

          </button>

          </form>

        </div>

      </div>

    </div>
    </Layout>
  );
}