import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Users, AlertTriangle, TrendingUp, 
  Plus, Search, ArrowUpRight, DollarSign, 
  CheckCircle2, RefreshCw, Smartphone, ClipboardList 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../../api/api";

export default function StoreOwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStoreMetrics();
  }, []);

  const fetchStoreMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/store/dashboard_metrics/`);
      setData(response.data);
    } catch (error) {
      console.error("Failed to load store metrics ecosystem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordQuickSale = () => {
    Swal.fire({
      title: "Record Sale",
      html: `
        <input id="swal-item" class="swal2-input" placeholder="Item name or Scan barcode">
        <input id="swal-qty" type="number" class="swal2-input" placeholder="Quantity" value="1">
        <input id="swal-amount" type="number" class="swal2-input" placeholder="Total Cash Amount (KES)">
      `,
      showCancelButton: true,
      confirmButtonColor: "#2E9D47",
      confirmButtonText: "Log Sale",
      preConfirm: () => {
        return {
          item: document.getElementById("swal-item").value,
          qty: document.getElementById("swal-qty").value,
          amount: document.getElementById("swal-amount").value,
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value.amount) {
        try {
          const token = localStorage.getItem("token");
          await axios.post(`${API_URL}/store/sales/record/`, result.value, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire("Saved!", "Counter sale processed directly into inventory ledger.", "success");
          fetchStoreTelemetry();
        } catch (err) {
          Swal.fire("Error", "Could not synchronize transactional block.", "error");
        }
      }
    });
  };

  if (loading || !data) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F4F1E6]/30 flex justify-center items-center">
          <div className="h-10 w-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Header Grid Banner Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">{data.store_name} Terminal</h1>
            <p className="text-sm text-gray-500 mt-1">AI-Powered point-of-sale inventory audits, ledger pipelines, and debt tracking.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button 
              onClick={handleRecordQuickSale}
              className="flex items-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus size={16} />
              <span>Record Sale</span>
            </button>
            <button 
              onClick={fetchStoreMetrics}
              className="p-2.5 bg-white border rounded-xl hover:bg-gray-50 transition text-gray-500"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Metric Display Matrices */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Today's Gross Sales", value: data.cards.today_sales, sub: "+12.4% vs yesterday", icon: <ShoppingBag size={20} />, color: "bg-[#0A4429]" },
            { title: "Available Stock", value: data.cards.total_products, sub: "Fully Audited Skus", icon: <ClipboardList size={20} />, color: "bg-emerald-700" },
            { title: "Critical Stock Alerts", value: data.cards.low_stock_count, sub: "Action required instantly", icon: <AlertTriangle size={20} />, color: data.cards.low_stock_count > 0 ? "bg-rose-600 animate-pulse" : "bg-gray-400" }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.title}</span>
                <div className={`${card.color} text-white p-2.5 rounded-xl`}>{card.icon}</div>
              </div>
              <h3 className="text-2xl font-black text-[#0A4429] tracking-tight">{card.value}</h3>
              <p className="text-[11px] text-gray-400 font-medium mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Split Grid: Low Stock Warnings & Outstanding Debt Ledger */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* AI Critical Stock Replenishment Tracker */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-base font-bold text-[#0A4429]">Critical Stock Depletion Alerts</h4>
                <p className="text-xs text-gray-400">Items flagged beneath required threshold configuration layers.</p>
              </div>
              <AlertTriangle size={18} className="text-amber-500" />
            </div>

            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {data.low_stock_items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-gray-50/50 px-2 rounded-xl transition">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.product_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Only {item.current_stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}