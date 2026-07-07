import React, { useState, useEffect } from "react";
import { 
  Store as StoreIcon, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";

export default function StoresRegistry() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/get_stores/`);
      setStores(response.data.stores || []);
    } catch (error) {
      console.error("Error connecting to administrative ecosystem store matrices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filters stores by store name, description, or owner full name
  const filteredStores = stores.filter(store => {
    const targetQuery = searchQuery.toLowerCase();
    return (
      store.name?.toLowerCase().includes(targetQuery) || 
      store.description?.toLowerCase().includes(targetQuery) ||
      store.owner?.name?.toLowerCase().includes(targetQuery)
    );
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Registered Stores</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and monitor active partner stores, site allocations, and administrative entity verification details.
          </p>
        </div>

        {/* Operational Query Filtering Array */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search stores by title, description, or operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium hidden sm:block">
            Total Entities Tracked: <span className="text-[#0A4429] font-bold">{filteredStores.length}</span>
          </div>
        </div>

        {/* Structural Stores Catalog Rendering Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <StoreIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Registered Stores Found</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">Modify matching criteria or expand searching indices terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div 
                key={store.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Top Store Identity Row */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#0A4429]/5 text-[#0A4429] rounded-xl shrink-0">
                      <StoreIcon size={22} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-base tracking-tight truncate">
                        {store.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        Joined {new Date(store.created_at).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                      </p>
                    </div>
                  </div>

                  {/* Operational Summary Description */}
                  <div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      {store.description || "No operational parameters or description criteria provided for this location structure asset tier."}
                    </p>
                  </div>
                </div>

                {/* Account Owner Nested Identity block */}
                {store.owner && (
                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Store Representative
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      {store.owner.profile_image ? (
                        <img 
                          src={store.owner.profile_image} 
                          alt={store.owner.name} 
                          className="w-6 h-6 rounded-full object-cover border border-gray-200" 
                        />
                      ) : (
                        <span className="p-1 bg-gray-100 rounded-full text-gray-500">
                          <User size={12} />
                        </span>
                      )}
                      <span className="font-semibold truncate">{store.owner.name}</span>
                    </div>

                    <div className="space-y-1 pl-1">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 truncate">
                        <Mail size={12} className="text-gray-400 shrink-0" />
                        <span>{store.owner.email}</span>
                      </div>
                      {store.owner.phone_number && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <Phone size={12} className="text-gray-400 shrink-0" />
                          <span className="font-mono">{store.owner.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}