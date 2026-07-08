import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Edit2, Package, RefreshCw, 
  Trash2, Filter, AlertTriangle, Layers, Save, X 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import axios from "axios";
import api from "../../api/api";
import Swal from "sweetalert2";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means "Add New Product"
  const [formData, setFormData] = useState({
    name: "",
    barcode_number: "",
    buying_price: "",
    selling_price: "",
    quantity: "",
    supplier_name: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/store/get_products/`);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed fetching store inventory data:", error);
      Swal.fire("Error", "Could not load current stock logs.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        barcode_number: product.barcode_number || "",
        buying_price: product.buying_price,
        selling_price: product.selling_price,
        quantity: product.quantity,
        supplier_name: product.supplier_name || ""
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        barcode_number: "",
        buying_price: "",
        selling_price: "",
        quantity: "0",
        min_threshold: "5",
        supplier_name: ""
      });
    }
    setIsDrawerOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/store/inventory/${editingProduct.id}/`, formData);
        Swal.fire("Success", "Product parameters modified safely.", "success");
      } else {
        await api.post(`/store/add_product/`, formData);
        Swal.fire("Produst added", "New product added successfully.", "success");
      }
      setIsDrawerOpen(false);
      fetchProducts();
    } catch (error) {
      Swal.fire("Error", "Failed to add product.", "error");
    }
  };

  const handleQuickStockUpdate = async (product, change) => {
    const newStock = Math.max(0, parseInt(product.quantity) + change);
    try {
      await api.patch(`/store/inventory/${product.id}/quick-stock/`, 
        { quantity: newStock },
      );
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, quantity: newStock } : p));
    } catch (error) {
      Swal.fire("Error", "Failed to sync inventory variance.", "error");
    }
  };

  // Processing Local UI Search & Threshold Filter Pipelines
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.barcode_number && product.barcode_number.includes(searchQuery));
    const matchesFilter = filterLowStock ? (parseInt(product.quantity) <= parseInt(product.min_threshold)) : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Top Operational Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Stock Book Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Audit active store goods profiles, execute rapid stock modifications, and manage buying-to-margin tiers.</p>
          </div>
          <button 
            onClick={() => openDrawer(null)}
            className="flex items-center justify-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-xs self-start md:self-center"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters Matrix Control Strip */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by product name or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2E9D47] transition-all text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                filterLowStock 
                  ? "bg-amber-50 border-amber-300 text-amber-700 shadow-xs" 
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <AlertTriangle size={15} />
              <span>Low Stock Alerts</span>
            </button>
            <button 
              onClick={fetchProducts}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Master Inventory Data Table Sheet */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-base font-bold text-[#0A4429]">No item records found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">No current inventory elements fit the matching filtration matrix parameters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Product name</th>
                    <th className="py-4 px-6">Barcode</th>
                    <th className="py-4 px-6">Buying Price</th>
                    <th className="py-4 px-6">Selling Price</th>
                    <th className="py-4 px-6">Current Stock</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredProducts.map((product) => {
                    const isLowStock = parseInt(product.quantity) <= parseInt(product.min_threshold);
                    const profitMargin = product.selling_price - product.buying_price;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">{product.product_name}</td>
                        <td className="py-4 px-6">{product.barcode_number}</td>
                        <td className="py-4 px-6 text-gray-600 font-medium">Ksh {parseFloat(product.buying_price).toLocaleString()}</td>
                        <td className="py-4 px-6 font-bold text-[#0A4429]">Ksh {parseFloat(product.selling_price).toLocaleString()}</td>
                        <td className="py-4 px-6">{product.quantity}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => openDrawer(product)}
                            className="p-2 border border-gray-100 rounded-lg hover:border-[#2E9D47] text-gray-400 hover:text-[#2E9D47] transition inline-flex items-center justify-center"
                          >
                            <Edit2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dynamic Contextual Action Sliding Side Drawer Overlays */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)} />
            
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-slide-in">
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-bold text-[#0A4429]">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Add New Product"}
                </h3>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="e.g., Broadways Bread 400g" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Barcode ID</label>
                  <input type="text" name="barcode_number" value={formData.barcode_number} onChange={handleInputChange} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="Scan barcode line node" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Buying Price (Ksh) *</label>
                    <input type="number" step="0.01" name="buying_price" required value={formData.buying_price} onChange={handleInputChange} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="55.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Selling Price (Ksh) *</label>
                    <input type="number" step="0.01" name="selling_price" required value={formData.selling_price} onChange={handleInputChange} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="65.00" />
                  </div>
                </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock *</label>
                    <input type="number" name="quantity" required disabled={!!editingProduct} value={formData.quantity} onChange={handleInputChange} className="w-full border rounded-xl p-3 text-sm disabled:text-gray-400 focus:outline-none" />
                  </div>
                

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Supplier Wholesaler Identity</label>
                  <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleInputChange} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E9D47]" placeholder="e.g., Al-Noor Distributors Ltd" />
                </div>

                <button type="submit" className="w-full bg-[#2E9D47] hover:bg-[#0A4429] text-white py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-6">
                  <Save size={16} />
                  <span>Add Product</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}