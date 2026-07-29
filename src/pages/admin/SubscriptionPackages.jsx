import React, { useState, useEffect } from "react";
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Crown, 
  CreditCard,
  ArrowRight,
  X
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Colors from "../../constants/colors";
import Swal from "sweetalert2";
import api from "../../api/api";

export default function SubscriptionPackages() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [packages, setPackages] = useState([]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/packages/`);
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error("Failed to load subscription packages:", error);
      Swal.fire({
        icon: "error",
        title: "Sync Error",
        text: "Unable to retrieve package pricing options.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const payWithPaystack = async () => {
    try {
      setSubmittingPayment(true);

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : {};
      const userEmail = user?.user_email || user?.email;

      if (!userEmail) {
        Swal.fire({
          icon: "warning",
          title: "Session Expiry",
          text: "User session details missing. Please re-authenticate.",
        });
        return;
      }

      const response = await api.post("/property_manager_subscribe_plan/", {
        email: userEmail,
        package_id: selectedPlan.id,
        billing_cycle: billingCycle,
      });

      if (response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("Invalid authorization URL received.");
      }
    } catch (error) {
      console.error("Payment initialization error:", error?.response?.data || error);

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text:
          error.response?.data?.message ||
          "Unable to initialize Paystack gateway session.",
      });
    } finally {
      setSubmittingPayment(false);
    }
  };

  const getPlanVisuals = (index) => {
    const icons = [Zap, Building2, Crown];
    return {
      Icon: icons[index % icons.length],
    };
  };

  if (loading) {
    return (
      <Layout>
        <div 
          className="flex justify-center items-center min-h-screen"
          style={{ backgroundColor: Colors.background || "#FFFFFF" }}
        >
          <div
            className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${Colors.primary} transparent transparent transparent` }}
          ></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div 
        className="min-h-screen p-4 md:p-8 font-sans"
        style={{ backgroundColor: Colors.background || "#FFFFFF" }}
      >
        {/* Module Header Elements */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span 
            className="text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider"
            style={{ 
              backgroundColor: `${Colors.primary}15`, 
              color: Colors.primary 
            }}
          >
            Platform Provision Tiers
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Predictable Scalable Pricing
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Unlock programmatic title verification tools, safe-escrow mechanics, and automated M-Pesa payment ledger routers.
          </p>

          {/* Cycle Toggle Control */}
          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl mt-6 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly" 
                  ? "text-white shadow-2xs" 
                  : "text-gray-500 hover:text-gray-800"
              }`}
              style={{
                backgroundColor: billingCycle === "monthly" ? Colors.primary : "transparent"
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" 
                  ? "text-white shadow-2xs" 
                  : "text-gray-500 hover:text-gray-800"
              }`}
              style={{
                backgroundColor: billingCycle === "yearly" ? Colors.primary : "transparent"
              }}
            >
              <span>Yearly Matrix</span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Structural Rendering Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {packages.map((plan, index) => {
            const { Icon } = getPlanVisuals(index);
            const currentPrice = billingCycle === "monthly" ? plan.monthly_price : plan.yearly_price;
            const isPopular = index === 1;

            const dynamicFeatures = [
              `${plan.number_of_units || 0} System Operation Units`,
              plan.mpesa_daraja ? "M-Pesa Daraja Integration Node" : "Standard Payments Only",
              plan.email_notifications ? "Instant Email Notifications Trigger" : "No Automated Email Logs",
              `Historical Logs Duration: ${plan.logs_duration || "Unlimited"}`,
              `Valid for ${billingCycle === "monthly" ? plan.month_days || 30 : plan.year_days || 365} absolute days`
            ];

            return (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                  isPopular 
                    ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/20" 
                    : "border-gray-100 shadow-xs"
                }`}
              >
                {isPopular && (
                  <span 
                    className="absolute -top-3 right-6 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    Popular Tier
                  </span>
                )}

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2.5 rounded-xl"
                      style={{ 
                        backgroundColor: `${Colors.primary}10`,
                        color: Colors.primary
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">{plan.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing Output */}
                  <div className="py-2 border-y border-gray-50 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900" style={{ color: Colors.primary }}>
                      KES {Number(currentPrice || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      / {billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {dynamicFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <span className="p-0.5 bg-emerald-50 text-emerald-600 rounded-md shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-2xs hover:opacity-90"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    <span>Activate Plan</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Paystack Checkout Initiation */}
        {isCheckoutOpen && selectedPlan && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} style={{ color: Colors.primary }} />
                  <h2 className="text-lg font-bold text-slate-900">Checkout Overview</h2>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {billingCycle} Subscription Cycle
                  </p>

                  <div className="border-t border-gray-200/60 mt-5 pt-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Billing Cycle</span>
                      <span className="font-semibold capitalize text-slate-800">{billingCycle}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200/40 pt-3">
                      <span className="text-gray-500 font-medium">Total Amount</span>
                      <span className="font-extrabold text-xl" style={{ color: Colors.primary }}>
                        KES{" "}
                        {billingCycle === "monthly"
                          ? Number(selectedPlan.monthly_price || 0).toLocaleString()
                          : Number(selectedPlan.yearly_price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={payWithPaystack}
                  disabled={submittingPayment}
                  className="mt-6 w-full text-white rounded-xl py-3.5 font-bold text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs"
                  style={{ backgroundColor: Colors.primary }}
                >
                  {submittingPayment ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Continue to Paystack"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}