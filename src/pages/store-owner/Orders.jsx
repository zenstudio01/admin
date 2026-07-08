import React, { useState, useEffect } from "react";
import { 
  Search, Filter, ShoppingCart, Eye, FileText, 
  CheckCircle2, XCircle, Clock, CreditCard, RefreshCw, ChevronRight 
} from "lucide-react";
import Layout from "../../layouts/Layout";
import axios from "axios";
import api from "../../api/api";
import Swal from "sweetalert2";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  
  // Modal / Detail States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/store/orders/`);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed fetching store orders ledger:", error);
      Swal.fire("Error", "Could not synchronize transactional history items.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/store/orders/${orderId}/status/`, 
        { status: newStatus },
      );
      
      Swal.fire("Success", `Order state updated to ${newStatus}.`, "success");
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Could not mutate fulfillment status configuration.", "error");
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Processing Local Search & Filter pipelines
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (order.customer_name && order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" ? true : order.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" ? true : order.payment_method === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case "COMPLETED":
        return <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> Success</span>;
      case "PENDING":
        return <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1 w-fit"><Clock size={12}/> Processing</span>;
      case "CANCELLED":
        return <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1 w-fit"><XCircle size={12}/> Cancelled</span>;
      default:
        return <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-100">{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Upper Header Meta Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Sales Orders Ledger</h1>
            <p className="text-sm text-gray-500 mt-1">Audit cross-channel register records, track M-Pesa STK payouts, and manage product handovers.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-500 self-start sm:self-center"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Master Control Filter Ribbon Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col xl:flex-row items-center gap-4 mb-6">
          <div className="relative w-full xl:flex-1">
            <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by order ID reference number or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2E9D47] transition-all text-gray-700"
            />
          </div>
          
          <div className="w-full xl:w-auto flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="w-1/2 sm:w-auto flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Fulfillment:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All States</option>
                <option value="PENDING">Processing</option>
                <option value="COMPLETED">Success</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="w-1/2 sm:w-auto flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Payment:</span>
              <select 
                value={paymentFilter} 
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Methods</option>
                <option value="MPESA">M-Pesa</option>
                <option value="CASH">Cash Payment</option>
                <option value="CREDIT">Debt Book Ledger</option>
              </select>
            </div>
          </div>
        </div>

        {/* Core Orders Table List Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-base font-bold text-[#0A4429]">No transaction receipts discovered</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">No sales checkout records match your active query filtration setups.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Timestamp Date</th>
                    <th className="py-4 px-6">Customer Segment</th>
                    <th className="py-4 px-6">Financial Total</th>
                    <th className="py-4 px-6">Payment Mode</th>
                    <th className="py-4 px-6">Fulfillment State</th>
                    <th className="py-4 px-6 text-right">Actions Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-mono font-bold text-gray-900">{order.order_number}</td>
                      <td className="py-4 px-6 text-xs text-gray-500">{order.created_at}</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-800">{order.customer_name || "Counter Customer"}</p>
                          {order.phone && <p className="text-[10px] text-gray-400 font-medium font-mono">{order.phone}</p>}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-[#0A4429]">KES {parseFloat(order.total_amount).toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase tracking-wide">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openOrderDetails(order)}
                          className="flex items-center gap-1.5 ml-auto text-xs font-bold border border-gray-200 hover:border-[#2E9D47] hover:text-[#2E9D47] px-3 py-1.5 rounded-xl transition bg-white"
                        >
                          <Eye size={14} />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Itemized Receipt Modal Overlay Dialog */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 animate-scale-up">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-black text-[#0A4429]">Receipt Summary</h3>
                  <p className="text-xs text-mono text-gray-400 mt-0.5">Reference: {selectedOrder.order_number}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">Close</button>
              </div>

              {/* Order Metadata Parameters */}
              <div className="grid grid-cols-2 gap-4 py-4 bg-gray-50/60 my-4 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-gray-400 block font-medium uppercase">Customer Profile:</span>
                  <span className="font-bold text-gray-800">{selectedOrder.customer_name || "Direct Walk-in Counter"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium uppercase">Settlement System:</span>
                  <span className="font-bold text-emerald-700 uppercase tracking-wide">{selectedOrder.payment_method}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium uppercase">Logged Timestamp:</span>
                  <span className="font-bold text-gray-600">{selectedOrder.created_at}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium uppercase">Fulfillment Status:</span>
                  <div className="mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              {/* Itemized Line Items Grid */}
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Basket Breakdowns</h4>
              <div className="divide-y border rounded-xl overflow-hidden mb-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-800">{item.product_name}</p>
                      <p className="text-xs text-gray-400">KES {parseFloat(item.unit_price).toLocaleString()} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">KES {parseFloat(item.subtotal).toLocaleString()}</span>
                  </div>
                ))}
                <div className="p-3 bg-emerald-50/40 flex justify-between items-center font-black text-base text-[#0A4429]">
                  <span>Total Amount Paid:</span>
                  <span>KES {parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* State Transition Operation Matrix Buttons */}
              {selectedOrder.status === "PENDING" && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")}
                    className="w-1/2 border border-rose-200 text-rose-600 hover:bg-rose-50 py-3 rounded-xl font-bold text-xs transition"
                  >
                    Void Transaction
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, "COMPLETED")}
                    className="w-1/2 bg-[#2E9D47] hover:bg-[#0A4429] text-white py-3 rounded-xl font-bold text-xs shadow-md transition"
                  >
                    Mark as Dispatched
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}