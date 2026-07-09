import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  CreditCard,
  Package,
  Calendar,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";
import api from "../../api/api";
import Layout from "../../layouts/Layout";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

 

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);

      const res = await axios.get(`/store/get_orders/`);

      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadPayments = async () => {
    try {
      setLoadingPayments(true);

      const res = await api.get(`/store/get_payments/`);

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadPayments();
  }, []);

  return (
    <Layout>
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Orders & Payments
          </h1>
          <p className="text-gray-500">
            View all customer purchases and payments.
          </p>
        </div>

        <button
          onClick={() => {
            loadOrders();
            loadPayments();
          }}
          className="flex items-center gap-2 bg-[#0A4429] text-white px-4 py-2 rounded-lg hover:bg-green-800"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-3 ${
            activeTab === "orders"
              ? "border-b-2 border-[#0A4429] text-[#0A4429] font-semibold"
              : "text-gray-500"
          }`}
        >
          <ShoppingCart className="inline mr-2" size={18} />
          Orders
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3 px-3 ${
            activeTab === "payments"
              ? "border-b-2 border-[#0A4429] text-[#0A4429] font-semibold"
              : "text-gray-500"
          }`}
        >
          <CreditCard className="inline mr-2" size={18} />
          Payments
        </button>

      </div>

      {/* ORDERS */}

      {activeTab === "orders" && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loadingOrders ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-[#0A4429]" size={40} />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={50} className="mx-auto text-gray-300" />
              <p className="text-gray-500 mt-4">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-4">Product</th>
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">
                        {order.product_name}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          {order.buyer_name}
                        </div>
                      </td>

                      <td className="p-4">
                        {order.quantity}
                      </td>

                      <td className="p-4">
                        KSh {Number(order.price).toLocaleString()}
                      </td>

                      <td className="p-4 font-semibold text-green-700">
                        KSh {Number(order.total).toLocaleString()}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} />
                          {new Date(order.sold_at).toLocaleString()}
                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}
        </div>
      )}

      {/* PAYMENTS */}

      {activeTab === "payments" && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loadingPayments ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-[#0A4429]" size={40} />
            </div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center">
              <CreditCard size={50} className="mx-auto text-gray-300" />
              <p className="text-gray-500 mt-4">No payments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-4">Product</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Receipt</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">
                        {payment.product_name}
                      </td>

                      <td className="p-4 font-semibold">
                        KSh {Number(payment.amount).toLocaleString()}
                      </td>

                      <td className="p-4 capitalize">
                        {payment.payment_method}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : payment.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.payment_status}
                        </span>
                      </td>

                      <td className="p-4">
                        {payment.receipt_number}
                      </td>

                      <td className="p-4">
                        {new Date(payment.paid_at).toLocaleString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}
        </div>
      )}
    </div>
    </Layout>
  );
}