import { useState } from "react";
import {
  Upload,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/api";
import Layout from "../../layouts/Layout";

export default function AddService() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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

  const pickImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveService = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !minimumPrice ||
      !maximumPrice
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

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("minimum_price", minimumPrice);
      formData.append("maximum_price", maximumPrice);
      formData.append("duration", duration);

      if (image) {
        formData.append("image", image);
      }

      await api.post(
        "/create_company_service/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Service added successfully.",
      });

      navigate("/company-services");

    } catch (e) {
      console.log(e.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          e.response?.data?.message ||
          "Unable to save service.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-8">

        {/* Header */}

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-xl border bg-white flex items-center justify-center hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <h1 className="text-3xl font-black text-[#0A4429]">
              Add New Service
            </h1>

            <p className="text-gray-500">
              Create a new service for customers.
            </p>

          </div>

        </div>

        <form
          onSubmit={saveService}
          className="bg-white rounded-3xl shadow-sm p-8 max-w-4xl mx-auto space-y-8"
        >

          {/* Image */}

          <div>

            <label className="block font-bold mb-3">
              Service Image
            </label>

            <label className="border-2 border-dashed border-gray-300 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-[#0A4429]">

              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <Upload
                    size={40}
                    className="text-gray-400"
                  />

                  <p className="mt-3 text-gray-500">
                    Click to upload image
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={pickImage}
              />

            </label>

          </div>

          {/* Title */}

          <div>

            <label className="block font-bold mb-2">
              Service Title *
            </label>

            <input
              className="w-full border rounded-xl p-4 outline-none focus:border-[#0A4429]"
              value={title}
              placeholder="Enter service title"
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>

          {/* Description */}

          <div>

            <label className="block font-bold mb-2">
              Description
            </label>

            <textarea
              rows={5}
              className="w-full border rounded-xl p-4 outline-none focus:border-[#0A4429]"
              value={description}
              placeholder="Enter your description here..."
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          {/* Category */}

          <div>

            <label className="block font-bold mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border rounded-xl p-4"
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

          {/* Prices */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block font-bold mb-2">
                Minimum Price (KES)
              </label>

              <input
                type="number"
                value={minimumPrice}
                placeholder="e.g 5000"
                onChange={(e) =>
                  setMinimumPrice(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              />

            </div>

            <div>

              <label className="block font-bold mb-2">
                Maximum Price (KES)
              </label>

              <input
                type="number"
                value={maximumPrice}
                placeholder="e.g 10000"
                onChange={(e) =>
                  setMaximumPrice(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              />

            </div>

          </div>

          {/* Duration */}

          <div>

            <label className="block font-bold mb-2">
              Duration
            </label>

            <input
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              placeholder="Example: 2 Hours"
              className="w-full border rounded-xl p-4"
            />

          </div>

          {/* Save */}

          <button
            disabled={loading}
            className="w-full bg-[#0A4429] hover:bg-[#2E9D47] text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition"
          >

            {loading ? (

              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>

            ) : (

              <>
                <Save size={18}/>
                Save Service
              </>

            )}

          </button>

        </form>

      </div>
    </Layout>
  );
}