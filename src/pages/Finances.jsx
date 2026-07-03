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

export default function Finances() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [newExpense, setNewExpense] = useState({
    title: "",
    property: "",
    amount: "",
    category: "Maintenance",
    landlord_allocated: "Dr. Kobia", // Simulating linkage to registered owners
  });

  useEffect(() => {
    fetchFinancialLedger();
  }, []);

  const fetchFinancialLedger = async () => {
    try {
      setLoading(true);
      
      // Reconciled operational financial data points matching portfolio metrics
      const fallbackTransactions = [
        { id: 1, type: "Inflow", title: "Rent Payment - Unit A12 (Alex Njuguna)", property: "Kilimani Heights", amount: 55000, category: "Rent", date: "2026-07-02", status: "Settled", reference: "MPESA_TX_MK821" },
        { id: 2, type: "Inflow", title: "Rent Payment - Suite 4B (Celestine Kilonzo)", property: "The Westlands Hub", amount: 120000, category: "Rent", date: "2026-07-01", status: "Settled", reference: "MPESA_TX_MK794" },
        { id: 3, type: "Outflow", title: "Burst Pipeline Fundi Settlement", property: "Kilimani Heights", amount: 15000, category: "Maintenance", date: "2026-06-28", status: "Disbursed", reference: "BWB_PAY_0911" },
        { id: 4, type: "Inflow", title: "Rent Payment - Unit B07 (Ian Kariuki)", property: "Kilimani Heights", amount: 45000, category: "Rent", date: "2026-06-25", status: "Settled", reference: "MPESA_TX_MK512" },
        { id: 5, type: "Outflow", title: "Common Area Electricity Tokens", property: "Ngong Road Arcade", amount: 8500, category: "Utilities", date: "2026-06-24", status: "Disbursed", reference: "KPLC_TX_8810" },
      ];

      setTransactions(fallbackTransactions);
    } catch (error) {
      console.error("Error reading platform financial data streams", error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || t.type === filterType;
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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gross Inflows</p>
              <h3 className="text-xl font-bold text-[#0A4429] mt-1">KES {totalInflows.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-50 text-[#2E9D47] rounded-xl"><TrendingUp size={22} /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Operating Losses</p>
              <h3 className="text-xl font-bold text-red-600 mt-1">KES {totalOutflows.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown size={22} /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform Split (10%)</p>
              <h3 className="text-xl font-bold text-blue-600 mt-1">KES {estimatedCommission.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Receipt size={22} /></div>
          </div>

          <div className="bg-[#0A4429] p-5 rounded-2xl shadow-sm text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#F4F1E6]/70 uppercase tracking-wider">Net Owner Payouts</p>
              <h3 className="text-xl font-bold text-[#F4F1E6] mt-1">KES {netLandlordPayoutPool.toLocaleString()}</h3>
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
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white text-center rounded-2xl p-12 border border-dashed border-gray-200 max-w-md mx-auto mt-10">
            <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0A4429]">No Ledger Logs</h3>
            <p className="text-sm text-gray-500 mt-1 px-4">There are no structural balance movements detected within the scope parameter bounds.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A4429]/5 text-[#0A4429] font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">Transaction Profile</th>
                    <th className="p-4">Asset Origin</th>
                    <th className="p-4">Gateway Reference</th>
                    <th className="p-4">Classification</th>
                    <th className="p-4 text-right">Value Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tx.type === "Inflow" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {tx.type === "Inflow" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{tx.title}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{tx.date}</div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{tx.property}</td>
                      <td className="p-4"><code className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">{tx.reference}</code></td>
                      <td className="p-4">
                        <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-bold text-base ${tx.type === "Inflow" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "Inflow" ? "+" : "-"} KES {tx.amount.toLocaleString()}
                      </td>
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