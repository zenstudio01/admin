import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import Layout from "../../layouts/Layout";
import api from "../../api/api";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [service, setService] = useState({
    title: "",
    description: "",
    category: "other",
    minimum_price: "",
    maximum_price: "",
    duration: "",
    image: "",
    is_active: true,
  });

  const categories = [
    "plumbing",
    "electrical",
    "cleaning",
    "painting",
    "roofing",
    "carpentry",
    "moving",
    "security",
    "internet",
    "other",
  ];

  useEffect(() => {
    loadService();
  }, []);

  const loadService = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/get_company_service/${id}/`
      );

      setService(response.data.service);
    } catch (error) {
      Swal.fire(
        "Error",
        "Unable to load service.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);

      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      setService((prev) => ({
        ...prev,
        image: data.secure_url,
      }));
    } catch (e) {
      Swal.fire(
        "Upload Failed",
        "Could not upload image.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !service.title ||
      !service.minimum_price ||
      !service.maximum_price
    ) {
      Swal.fire(
        "Missing Information",
        "Please fill all required fields.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/update_company_service/${id}/`,
        service
      );

      Swal.fire(
        "Updated!",
        "Service updated successfully.",
        "success"
      );

      navigate("/company/services");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Unable to update service.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0A4429] mb-6 font-semibold"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow border border-gray-100">

          <div className="border-b px-8 py-6">
            <h1 className="text-3xl font-bold text-[#0A4429]">
              Edit Service
            </h1>

            <p className="text-gray-500 mt-2">
              Update your service details.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >

            <div>
              <label className="font-semibold">
                Service Title
              </label>

              <input
                value={service.title}
                onChange={(e) =>
                  setService({
                    ...service,
                    title: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Description
              </label>

              <textarea
                rows={5}
                value={service.description}
                onChange={(e) =>
                  setService({
                    ...service,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="font-semibold">
                  Category
                </label>

                <select
                  value={service.category}
                  onChange={(e) =>
                    setService({
                      ...service,
                      category: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 mt-2"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                    >
                      {cat.charAt(0).toUpperCase() +
                        cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold">
                  Duration
                </label>

                <input
                  value={service.duration}
                  onChange={(e) =>
                    setService({
                      ...service,
                      duration: e.target.value,
                    })
                  }
                  placeholder="2 Hours"
                  className="w-full border rounded-xl p-3 mt-2"
                />
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="font-semibold">
                  Minimum Price
                </label>

                <input
                  type="number"
                  value={service.minimum_price}
                  onChange={(e) =>
                    setService({
                      ...service,
                      minimum_price: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 mt-2"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Maximum Price
                </label>

                <input
                  type="number"
                  value={service.maximum_price}
                  onChange={(e) =>
                    setService({
                      ...service,
                      maximum_price: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 mt-2"
                />
              </div>

            </div>

            <div>

              <label className="font-semibold">
                Service Image
              </label>

              {service.image && (
                <img
                  src={service.image}
                  alt=""
                  className="w-44 h-44 object-cover rounded-xl mt-3 border"
                />
              )}

              <label className="mt-4 flex items-center justify-center gap-3 border-2 border-dashed rounded-xl py-6 cursor-pointer hover:border-[#0A4429]">

                <Upload size={20} />

                <span>
                  {uploading
                    ? "Uploading..."
                    : "Choose New Image"}
                </span>

                <input
                  hidden
                  type="file"
                  onChange={(e) =>
                    uploadImage(e.target.files[0])
                  }
                />

              </label>

            </div>

            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={service.is_active}
                onChange={(e) =>
                  setService({
                    ...service,
                    is_active: e.target.checked,
                  })
                }
              />

              <span>
                Service is Active
              </span>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0A4429] hover:bg-[#2E9D47] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3"
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              Save Changes
            </button>

          </form>

        </div>
      </div>
    </Layout>
  );
}