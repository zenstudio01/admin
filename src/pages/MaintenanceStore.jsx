import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Wrench, 
  Zap, 
  Shield, 
  Sun, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CheckCircle 
} from "lucide-react";
import Layout from "../layouts/Layout";
import Swal from "sweetalert2";

export default function MaintenanceStore() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchStoreCatalog();
  }, []);

  const fetchStoreCatalog = async () => {
    try {
      setLoading(true);
      
      // Seed data representing structural materials, standard maintenance assets, and solar packages
      const catalog = [
        { id: 501, name: "Premium Commercial CCTV Package (8-Ch)", category: "Security & CCTV", price: 48000, stock: 12, rating: 4.8, description: "Full HD weather-resistant cameras with network digital logging hardware." },
        { id: 502, name: "Prepaid KPLC Smart Meter Unit", category: "Electrical & Power", price: 15500, stock: 25, rating: 4.7, description: "Sub-meter systems ideal for tracking individual tenant grid utilization." },
        { id: 503, name: "Industrial Solar Water Heating System (300L)", category: "Solar & Green Energy", price: 135000, stock: 5, rating: 4.9, description: "High-capacity heavy-duty solar thermal set for multi-unit apartment setups." },
        { id: 504, name: "Heavy Duty Submersible Water Pump (1.5HP)", category: "Plumbing & Drainage", price: 32000, stock: 8, rating: 4.6, description: "Reliable clean water borehole and sump tank evacuation mechanical pump." },
        { id: 505, name: "Antibacterial High-Traffic Floor Tiles (Box)", category: "Building Materials", price: 2400, stock: 150, rating: 4.5, description: "Durable ceramic layout finishes matching standard high-frequency public pathways." }
      ];

      setProducts(catalog);
    } catch (error) {
      console.error("Error connecting to inventory supply chain matrices", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: {
        ...product,
        quantity: (prevCart[product.id]?.quantity || 0) + 1
      }
    }));
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (!updatedCart[id]) return prevCart;
      
      const newQty = updatedCart[id].quantity + delta;
      if (newQty <= 0) {
        delete updatedCart[id];
      } else {
        updatedCart[id].quantity = newQty;
      }
      return updatedCart;
    });
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    
    Swal.fire({
      title: "Confirm Logistics Procurement",
      text: `Process bulk procurement order worth KES ${getCartTotal().toLocaleString()}? Billing will apply directly against pending collections pool.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0A4429",
      cancelButtonColor: "#d33",
      confirmButtonText: "Authorize Disbursal"
    }).then((result) => {
      if (result.isConfirmed) {
        setCart({});
        Swal.fire({
          title: "Order Processed Successfully!",
          text: "Supply chain fulfillment coordinates dispatched. Track route progress inside the system operations tab.",
          icon: "success",
          confirmButtonColor: "#2E9D47"
        });
      }
    });
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || prod.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Procurement Storefront</h1>
            <p className="text-sm text-gray-500 mt-1">Source verified electrical inventory, solar installations, security kits, and building appliances.</p>
          </div>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center gap-2 bg-[#0A4429] hover:bg-[#2E9D47] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm self-start sm:self-center"
          >
            <ShoppingCart size={18} />
            <span>View Requisition Order</span>
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-bounce">
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>

        {/* Categories Filtering Array */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search equipment catalog, materials, appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {["All", "Security & CCTV", "Electrical & Power", "Solar & Green Energy", "Plumbing & Drainage", "Building Materials"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#0A4429] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Cards Rendering Matrix */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Equipment Profiles Found</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">Modify matching terms or switch down target filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-gray-100 text-gray-600 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      In Stock: <b className="text-[#0A4429]">{product.stock}</b>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-base group-hover:text-[#2E9D47] transition-colors line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unit Value Cost</p>
                    <p className="text-lg font-extrabold text-[#0A4429]">KES {product.price.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 bg-[#0A4429] hover:bg-[#2E9D47] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <Plus size={14} /> Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slide-out Requisition Cart Summary Panel */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">Material Requisition Summary</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Approve site material items ready for dispatch logistics.</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 bg-white/10 rounded-lg text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {Object.values(cart).length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <ShoppingCart size={40} className="mx-auto opacity-30 mb-2" />
                    <p className="text-sm font-medium">Your procurement manifest sheet is empty.</p>
                  </div>
                ) : (
                  Object.values(cart).map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-800 text-sm truncate">{item.name}</h5>
                        <p className="text-xs text-gray-400 mt-0.5">KES {(item.price * item.quantity).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 shrink-0">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-gray-700">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {Object.values(cart).length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-600">Total Material Allocation Cost:</span>
                    <span className="text-xl font-black text-[#0A4429]">KES {getCartTotal().toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm bg-white"
                    >
                      Continue Sourcing
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 bg-[#2E9D47] hover:bg-[#0A4429] text-white font-medium py-2.5 rounded-xl text-sm shadow-sm"
                    >
                      Authorize Disbursal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}