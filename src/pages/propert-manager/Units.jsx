import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  BedDouble,
  Bath,
  Users,
  Pencil,
  Building2,
  X,
  Save,
} from "lucide-react";
import api from "../../api/api";
import Layout from "../../layouts/Layout";
import ImageUploading from "react-images-uploading";

export default function Units() {

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [units, setUnits] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [amenity, setAmenity] = useState("");

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/units/get_my_units/`);

      setUnits(res.data.units);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {

      const searchMatch =
        unit.name.toLowerCase().includes(search.toLowerCase()) ||
        unit.property_name
          .toLowerCase()
          .includes(search.toLowerCase());

      const filterMatch =
        filter === "all" ||
        unit.status === filter;

      return searchMatch && filterMatch;

    });
  }, [units, search, filter]);

  const openEdit = (unit) => {
    setSelectedUnit({ ...unit });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setSelectedImages(files);
};

const addAmenity = () => {
  if (!amenity.trim()) return;

  setSelectedUnit({
    ...selectedUnit,
    amenities: [
      ...(selectedUnit.amenities || []),
      amenity.trim(),
    ],
  });

  setAmenity("");
};

const removeAmenity = (index) => {
  setSelectedUnit({
    ...selectedUnit,
    amenities: selectedUnit.amenities.filter(
      (_, i) => i !== index
    ),
  });
};

  const saveUnit = async () => {
    setIsSaving(true);
  try {
    const formData = new FormData();

    formData.append("name", selectedUnit.name);
    formData.append("description", selectedUnit.description);
    formData.append("price_per_month", selectedUnit.price_per_month);
    formData.append("bedrooms", selectedUnit.bedrooms);
    formData.append("bathrooms", selectedUnit.bathrooms);
    formData.append("max_guests", selectedUnit.max_guests);
    formData.append("status", selectedUnit.status);

    // Upload new images
    selectedImages.forEach((file) => {
  formData.append("images", file);
});

// Add amenities
formData.append(
  "amenities",
  JSON.stringify(selectedUnit.amenities)
);

    await api.put(
      `/units/update_unit/${selectedUnit.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setShowModal(false);
    fetchUnits();

  } catch (err) {
    console.log(err);
  }finally{
    setIsSaving(false);
  }
};

  if (loading) {
    return (
      <Layout>
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            My Units
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all rental units.
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl border p-4 flex items-center">

        <Search size={18} />

        <input
          placeholder="Search units..."
          className="flex-1 ml-3 outline-none"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Filters */}

      <div className="flex gap-3 mt-6">

        {[
          "all",
          "available",
          "occupied",
          "under_maintenance",
        ].map((status) => (

          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full capitalize transition ${
              filter === status
                ? "bg-[#0A4429] text-white"
                : "bg-white border"
            }`}
          >
            {status.replace("_", " ")}

          </button>

        ))}

      </div>

      {/* Cards */}

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-8">

        {filteredUnits.map((unit) => (

          <div
            key={unit.id}
            className="bg-white rounded-2xl shadow border overflow-hidden"
          >

            <img
              src={
                unit.images.length
                  ? unit.images[0]
                  : "https://placehold.co/600x400"
              }
              className="h-52 w-full object-cover"
            />

            <div className="p-5">

              <div className="flex justify-between">

                <div>

                  <h2 className="font-bold text-xl">
                    {unit.name}
                  </h2>

                  <p className="text-gray-500 mt-1 flex items-center">

                    <Building2
                      size={15}
                      className="mr-1"
                    />

                    {unit.property_name}

                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    unit.status === "available"
                      ? "text-green-700"
                      : unit.status ===
                        "occupied"
                      ? "text-blue-700"
                      : "text-orange-700"
                  }`}
                >
                  {unit.status.replace("_", " ")}

                </span>

              </div>

              <h3 className="text-[#0A4429] font-bold text-2xl mt-5">

                Ksh. {unit.price_per_month}

                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / month
                </span>

              </h3>

              <div className="flex justify-between mt-6 text-gray-600">

                <div className="flex items-center">
                  <BedDouble size={18} />
                  <span className="ml-1">
                    {unit.bedrooms}
                  </span>
                </div>

                <div className="flex items-center">
                  <Bath size={18} />
                  <span className="ml-1">
                    {unit.bathrooms}
                  </span>
                </div>

                <div className="flex items-center">
                  <Users size={18} />
                  <span className="ml-1">
                    {unit.max_guests}
                  </span>
                </div>

              </div>

              <button
                onClick={() =>
                  openEdit(unit)
                }
                className="mt-6 w-full bg-[#0A4429] text-white py-3 rounded-xl flex justify-center items-center"
              >

                <Pencil size={18} />

                <span className="ml-2">
                  Edit Unit
                </span>

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col">

            <div className="flex justify-between items-center p-6 border-b">

              <h2 className="text-2xl font-bold">
                Edit Unit
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X />
              </button>

            </div>
            <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">

              <input
                className="w-full border rounded-xl p-3"
                placeholder="Unit Name"
                value={selectedUnit.name}
                onChange={(e) =>
                  setSelectedUnit({
                    ...selectedUnit,
                    name: e.target.value,
                  })
                }
              />

              <textarea
                className="w-full border rounded-xl p-3"
                rows="4"
                placeholder="Description"
                value={selectedUnit.description}
                onChange={(e) =>
                  setSelectedUnit({
                    ...selectedUnit,
                    description:
                      e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="w-full border rounded-xl p-3"
                placeholder="Monthly Rent"
                value={selectedUnit.price_per_month}
                onChange={(e) =>
                  setSelectedUnit({
                    ...selectedUnit,
                    price_per_month:
                      e.target.value,
                  })
                }
              />

              <div className="grid grid-cols-3 gap-4">

                <input
                  type="number"
                  className="border rounded-xl p-3"
                  placeholder="bedrooms"
                  value={selectedUnit.bedrooms}
                  onChange={(e) =>
                    setSelectedUnit({
                      ...selectedUnit,
                      bedrooms:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  className="border rounded-xl p-3"
                  placeholder="bathrooms"
                  value={selectedUnit.bathrooms}
                  onChange={(e) =>
                    setSelectedUnit({
                      ...selectedUnit,
                      bathrooms:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  className="border rounded-xl p-3"
                  placeholder="max guests"
                  value={selectedUnit.max_guests}
                  onChange={(e) =>
                    setSelectedUnit({
                      ...selectedUnit,
                      max_guests:
                        e.target.value,
                    })
                  }
                />

              </div>

              <select
                className="w-full border rounded-xl p-3"
                value={selectedUnit.status}
                onChange={(e) =>
                  setSelectedUnit({
                    ...selectedUnit,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="available">
                  Available
                </option>

                <option value="occupied">
                  Occupied
                </option>

                <option value="under_maintenance">
                  Under Maintenance
                </option>

              </select>


              <div className="space-y-3">

  <label className="font-medium text-gray-700">
    Amenities
  </label>

  <div className="flex gap-2">

    <input
      type="text"
      value={amenity}
      onChange={(e) => setAmenity(e.target.value)}
      placeholder="e.g. WiFi"
      className="flex-1 border rounded-xl p-3"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addAmenity();
        }
      }}
    />

    <button
      type="button"
      onClick={addAmenity}
      className="px-5 rounded-xl bg-[#0A4429] text-white"
    >
      Add
    </button>

  </div>

  <div className="flex flex-wrap gap-2">

    {selectedUnit.amenities?.map((item, index) => (
      <div
        key={index}
        className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1"
      >
        <span>{item}</span>

        <button
          type="button"
          onClick={() => removeAmenity(index)}
          className="ml-2 text-red-600 font-bold"
        >
          ×
        </button>
      </div>
    ))}

  </div>

</div>

             <div className="space-y-4">

  <label className="block">
    <span className="sr-only">Choose Images</span>

    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      className="block w-full text-sm text-gray-700
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:bg-[#0A4429]
                 file:text-white
                 file:cursor-pointer
                 cursor-pointer"
    />
  </label>

  <div className="grid grid-cols-3 gap-3">

    {/* Show existing images if no new ones selected */}
    {selectedImages.length === 0 &&
      selectedUnit.images?.map((img, index) => (
        <img
          key={index}
          src={img}
          className="h-24 w-full rounded-lg object-cover"
          alt=""
        />
      ))}

    {/* Preview newly selected images */}
    {selectedImages.map((file, index) => (
      <div key={index} className="relative">

        <img
          src={URL.createObjectURL(file)}
          className="h-24 w-full rounded-lg object-cover"
          alt=""
        />

        <button
          type="button"
          onClick={() =>
            setSelectedImages(
              selectedImages.filter((_, i) => i !== index)
            )
          }
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white"
        >
          ×
        </button>

      </div>
    ))}

  </div>

</div>

              <div className="border-t p-6 flex justify-end gap-3">
  <button
    onClick={() => setShowModal(false)}
    className="px-5 py-2 rounded-lg border"
  >
    Cancel
  </button>

  <button
    onClick={saveUnit}
    className="px-5 py-2 rounded-lg bg-[#0A4429] text-white"
  >
   {isSaving ? "Saving..." : "Save Changes"}
  </button>
</div>

            </div>
            </div>

          </div>

        </div>

      )}

    </div>
    </Layout>
  );
}