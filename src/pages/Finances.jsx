import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight,
  X,
  Wallet
} from "lucide-react";
import Layout from "../layouts/Layout";
import Swal from "sweetalert2";
import api from "../api/api";

export default function Finances() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isFetchingPayments, setIsFetchingPayments] = useState(false);
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: "",
    property: "",
    amount: "",
    category: "Maintenance",
    landlord_allocated: "Dr. Kobia", // Simulating linkage to registered owners
  });

  useEffect(() => {
    fetchRentPayments();
    fetchSummary();
  }, []);


  const fetchRentPayments = async () => {
    setIsFetchingSummary(true);
    try{
      const response = await api.get("/prop/payment_summary/"); 
      if(response.status === 200 || response.status === 201){
        setSummary(response.data.summary);

      }else{
        alert("Failed to fetch payments");
      }

    }catch(error){
      console.error("Error fetching payments", error);
      alert("Error fetching payments")

    }finally{
      setIsFetchingSummary(false);

    }
  }


  const fetchSummary = async () => {
    setIsFetchingSummary(true);
    try{
      const response = await api.get("/prop/get_payments/"); 
      if(response.status === 200 || response.status === 201){
        setPayments(response.data.payments);

      }else{
        alert("Failed to fetch payments");
      }

    }catch(error){
      console.error("Error fetching payments", error);
      alert("Error fetching payments")

    }finally{
      setIsFetchingSummary(false);

    }
  }

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    
    const loggedExpense = {
      id: Date.now(),
      type: "Outflow",
      title: newExpense.title,
      property: newExpense.property,
      amount: parseFloat(newExpense.amount) || 0,
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0],
      status: "Disbursed",
      reference: "MANUAL_" + Math.floor(1000 + Math.random() * 9000)
    };

    setTransactions([loggedExpense, ...transactions]);
    setIsExpenseModalOpen(false);
    setNewExpense({ title: "", property: "", amount: "", category: "Maintenance", landlord_allocated: "Dr. Kobia" });

    Swal.fire({
      icon: "success",
      title: "Expense Logged",
      text: "The financial overhead debit entry has been injected into the portfolio ledger account.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Reconciled Totals Computations
  const totalInflows = transactions.filter(t => t.type === "Inflow").reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflows = transactions.filter(t => t.type === "Outflow").reduce((acc, curr) => acc + curr.amount, 0);
  
  // Platform commission tracking calculation rule setup
  const platformCommissionRate = 0.10; // 10% operational cut
  const estimatedCommission = totalInflows * platformCommissionRate;
  const netLandlordPayoutPool = totalInflows - totalOutflows - estimatedCommission;

  const filteredTransactions = payments.filter((t) => {
  const search = searchQuery.toLowerCase();

  const matchesSearch =
    (t.tenant_name || "").toLowerCase().includes(search) ||
    (t.property_name || "").toLowerCase().includes(search) ||
    (t.transaction_code || "").toLowerCase().includes(search);

  const matchesType =
    filterType === "All" || t.unit_name === filterType;

  return matchesSearch && matchesType;
});

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A4429] tracking-tight">Financial Reconciler</h1>
            <p className="text-sm text-gray-500 mt-1">Audit dynamic M-Pesa Daraja collection routes, operational outflows, and net asset splits.</p>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm self-start sm:self-center"
          >
            <Plus size={18} />
            <span>Record Overhead Debit</span>
          </button>
        </div>

        {/* Global Performance Balance Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Transactions</p>
              <h3 className="text-xl font-bold text-[#0A4429] mt-1">KES {summary.total_transactions}</h3>
            </div>
            <div className="p-3 bg-green-50 text-[#2E9D47] rounded-xl"><TrendingUp size={22} /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Collected</p>
              <h3 className="text-xl font-bold text-red-600 mt-1">KES {summary.total_collected}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown size={22} /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total pending</p>
              <h3 className="text-xl font-bold text-blue-600 mt-1">KES {summary.total_pending}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Receipt size={22} /></div>
          </div>

          <div className="bg-[#0A4429] p-5 rounded-2xl shadow-sm text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#F4F1E6]/70 uppercase tracking-wider">Paid Transactions</p>
              <h3 className="text-xl font-bold text-[#F4F1E6] mt-1">KES {summary.paid_transactions}</h3>
            </div>
            <div className="p-3 bg-white/10 text-[#F4F1E6] rounded-xl"><Wallet size={22} /></div>
          </div>
        </div>

        {/* Search Matrix Panel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search via descriptions, assets or MPESA references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {["All", "Inflow", "Outflow"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === type
                    ? "bg-[#0A4429] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type === "All" ? "All Entries" : type === "Inflow" ? "Rent Inflows" : "Expenses Outside"}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Transactions Ledger Pipeline View */}
        {isFetchingPayments ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No payments found</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">You do not have any payment transactions.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A4429]/5 text-[#0A4429] font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">Tenant</th>
                    <th className="p-4">Phone number</th>
                    <th className="p-4">Property</th>
                    <th className="p-4">Unit</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        
                        <div>
                          <div className="font-semibold text-gray-800">{tx.tenant_name}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{tx.payment_date}</div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{tx.phone_number}</td>
                      <td className="p-4 font-medium text-gray-700">{tx.property_name}</td>
                      <td className="p-4">
                        <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-medium">
                          {tx.unit_name}
                        </span>
                      </td>
                      <td className="p-4 text-left font-bold text-base text-green-600">
                        KES {tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 font-medium text-gray-700">{tx.transaction_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Debit Entry Modals Sheet */}
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0A4429] text-white">
                <div>
                  <h3 className="text-lg font-bold">Record Structural Outflow</h3>
                  <p className="text-xs text-[#F4F1E6]/70 mt-0.5">Deduct expenditure logs straight from rental collections.</p>
                </div>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-1.5 bg-white/10 rounded-lg text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="p-6 flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Expense Label</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={newExpense.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Council Water Refill Tankers"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Impacted Property Asset</label>
                  <input
                    type="text"
                    name="property"
                    required
                    value={newExpense.property}
                    onChange={handleInputChange}
                    placeholder="e.g. Kilimani Heights"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Amount Cost (KES)</label>
                    <input
                      type="number"
                      name="amount"
                      required
                      value={newExpense.amount}
                      onChange={handleInputChange}
                      placeholder="e.g. 15000"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Accounting Type</label>
                    <select
                      name="category"
                      value={newExpense.category}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm bg-white"
                    >
                      <option value="Maintenance">Maintenance Defect</option>
                      <option value="Utilities">Utilities (Power/Water)</option>
                      <option value="Legal">Legal & Regulatory Fees</option>
                      <option value="Taxes">Statutory Duties</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl text-sm shadow-sm"
                  >
                    Commit Outflow
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}