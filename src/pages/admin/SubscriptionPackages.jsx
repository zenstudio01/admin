import React, { useState, useEffect } from "react";
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Crown, 
  Smartphone, 
  CreditCard,
  ArrowRight
} from "lucide-react";
import Layout from "../../layouts/Layout";
import Swal from "sweetalert2";
import api from "../../api/api";
import PaystackPop from "@paystack/inline-js";

export default function SubscriptionPackages() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/packages/`);
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error("Failed to load global administrative infrastructure telemetry:", error);
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
    setLoading(true);

    setIsCheckoutOpen(false);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const response = await api.post("/property_manager_subscribe_plan/", {
      email: user.user_email,
      package_id: selectedPlan.id,
      billing_cycle: billingCycle,
    });

    window.location.href = response.data.authorization_url;
  } catch (error) {
    console.log(error.response?.data);

    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text:
        error.response?.data?.message ||
        "Unable to initialize payment.",
    });
  } finally {
    setLoading(false);
  }
};

  // Safe mapping configuration for visual indicators based on plan items
  const getPlanVisuals = (index) => {
    const icons = [Zap, Building2, Crown];
    const colors = [
      "border-gray-200", 
      "border-[#2E9D47] ring-1 ring-[#2E9D47]/30 bg-green-50/5", 
      "border-[#0A4429] bg-[#0A4429]/5"
    ];
    return {
      Icon: icons[index % icons.length],
      color: colors[index % colors.length]
    };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/30 p-4 md:p-8 font-sans">
        
        {/* Module Header Elements */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs bg-[#0A4429]/10 text-[#0A4429] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Platform Provision Tiers
          </span>
          <h1 className="text-4xl font-extrabold text-[#0A4429] tracking-tight mt-3">
            Predictable Scalable Pricing
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Unlock programmatic title verification tools, safe-escrow mechanics, and automated M-Pesa payment ledger routers.
          </p>

          {/* Core Cycle Toggler */}
          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl mt-6 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly" ? "bg-[#0A4429] text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                billingCycle === "yearly" ? "bg-[#0A4429] text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Yearly Matrix <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-black">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Structural Rendering Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {packages.map((plan, index) => {
              const { Icon, color } = getPlanVisuals(index);
              const currentPrice = billingCycle === "monthly" ? plan.monthly_price : plan.yearly_price;
              
              // Map API parameters directly into a clean features list representation
              const dynamicFeatures = [
                `${plan.number_of_units} System Operation Units`,
                plan.mpesa_daraja ? "M-Pesa Daraja Integration Node" : "Standard Payments Only",
                plan.email_notifications ? "Instant Email Notifications Trigger" : "No Automated Email Logs",
                `Historical Logs Duration: ${plan.logs_duration}`,
                `Valid for ${billingCycle === "monthly" ? plan.month_days : plan.year_days} absolute days`
              ];

              return (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${color}`}
                >
                  {index === 1 && (
                    <span className="absolute -top-3 right-6 bg-[#2E9D47] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                      Popular Tier
                    </span>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#0A4429]/5 text-[#0A4429] rounded-xl">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-800 text-lg">{plan.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{plan.description}</p>
                      </div>
                    </div>

                    {/* Operational Pricing Outputs */}
                    <div className="py-2 border-y border-gray-50 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#0A4429]">Ksh {currentPrice.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 font-semibold">/ {billingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>

                    {/* Feature Lists Arrays */}
                    <ul className="space-y-3">
                      {dynamicFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                          <span className="p-0.5 bg-green-50 text-green-600 rounded-md shrink-0 mt-0.5">
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
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                        index === 1
                          ? "bg-[#2E9D47] hover:bg-[#0A4429] text-white"
                          : "bg-[#0A4429] hover:bg-[#2E9D47] text-white"
                      }`}
                    >
                      <span>Activate Plan</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic M-Pesa STK Push Integration Modal */}
        {isCheckoutOpen && selectedPlan && (
          <div className="p-5">

  <div className="bg-gray-50 rounded-xl p-5">

    <h3 className="text-xl font-bold text-[#0A4429]">
      {selectedPlan.name}
    </h3>

    <p className="text-gray-500 mt-2">
      {billingCycle === "monthly"
        ? "Monthly Subscription"
        : "Yearly Subscription"}
    </p>

    <div className="border-t mt-5 pt-5 space-y-3">

      <div className="flex justify-between">
        <span className="text-gray-500">
          Billing Cycle
        </span>

        <span className="font-semibold capitalize">
          {billingCycle}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">
          Amount
        </span>

        <span className="font-bold text-2xl text-[#0A4429]">
          KES{" "}
          {billingCycle === "monthly"
            ? selectedPlan.monthly_price.toLocaleString()
            : selectedPlan.yearly_price.toLocaleString()}
        </span>
      </div>

    </div>

  </div>

  <button
    onClick={payWithPaystack}
    disabled={loading}
    className="mt-6 w-full bg-[#0A4429] hover:bg-[#2E9D47] text-white rounded-xl py-4 font-bold transition"
  >
    {loading ? "Redirecting..." : "Continue to Paystack"}
  </button>

</div>
        )}

      </div>
    </Layout>
  );
}