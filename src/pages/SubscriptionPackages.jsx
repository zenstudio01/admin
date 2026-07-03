import React, { useState } from "react";
import { 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Crown, 
  Smartphone, 
  CreditCard,
  ArrowRight
} from "lucide-react";
import Layout from "../layouts/Layout";
import Swal from "sweetalert2";

export default function SubscriptionPackages() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Dynamic pricing structural matrices
  const plans = [
    {
      id: "tier_starter",
      name: "Starter Bundle",
      icon: Building2,
      description: "Perfect for independent property managers managing small local blocks.",
      monthlyPrice: 2500,
      yearlyPrice: 24000,
      features: [
        "Up to 20 Unit Segments Mapped",
        "Standard M-Pesa Daraja Integration",
        "Basic Tenant Statement Logs",
        "Next-Day Email Support Flow"
      ],
      color: "border-gray-200 hover:border-gray-400",
      badge: null
    },
    {
      id: "tier_growth",
      name: "Growth Engine",
      icon: Zap,
      description: "Optimized for expanding tech ventures and corporate management firms.",
      monthlyPrice: 6500,
      yearlyPrice: 62400,
      features: [
        "Up to 150 Unit Segments Mapped",
        "Instant M-Pesa STK Webhook Loops",
        "Automated Compliance Tracking",
        "Vendor Escrow Management Module",
        "Priority Chat Support (Under 1Hr)"
      ],
      color: "border-[#2E9D47] ring-2 ring-[#2E9D47]/20",
      badge: "Most Popular Choice"
    },
    {
      id: "tier_enterprise",
      name: "Enterprise Core",
      icon: Crown,
      description: "Full-scale white-label solution designed for unlimited multi-tenant networks.",
      monthlyPrice: 15000,
      yearlyPrice: 144000,
      features: [
        "Unlimited Property & Unit Vectors",
        "Dedicated Daraja Shortcode Pipeline",
        "Full RBAC Access Matrix Settings",
        "Raw Database Telemetry Feeds",
        "24/7 Dedicated Account Architect"
      ],
      color: "border-[#0A4429] shadow-md",
      badge: "Corporate Elite"
    }
  ];

  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleMpesaStkPush = (e) => {
    e.preventDefault();
    
    // Formatting validation rules for localized carriers
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Target Vector",
        text: "Please supply a valid Kenyan Safaricom phone number (e.g., 07XXXXXXXX or 254XXXXXXXX).",
        confirmButtonColor: "#d33"
      });
      return;
    }

    const billableAmount = billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;

    setIsCheckoutOpen(false);
    
    Swal.fire({
      title: "Triggering M-Pesa STK Push",
      text: `Sending instant KES ${billableAmount.toLocaleString()} payment request prompt to network line +${formattedPhone}...`,
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simulate Daraja Network Endpoint Gateway Latency Loop
    setTimeout(() => {
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Payment Verified",
        text: `Welcome to the ${selectedPlan.name}! Your system architecture capabilities have been instantly upgraded.`,
        confirmButtonColor: "#2E9D47"
      });
      setPhoneNumber("");
    }, 4000);
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            
            return (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${plan.color}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 bg-[#2E9D47] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                    {plan.badge}
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
                    <span className="text-2xl font-black text-[#0A4429]">KES {currentPrice.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 font-semibold">/ {billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>

                  {/* Feature Lists Arrays */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
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
                      plan.id === "tier_growth"
                        ? "bg-[#2E9D47] hover:bg-[#0A4429] text-white"
                        : "bg-[#0A4429] hover:bg-[#2E9D47] text-white"
                    }`}
                  >
                    <span>Activate Plan Configuration</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic M-Pesa STK Push Integration Modal */}
        {isCheckoutOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
              
              <div className="p-5 bg-[#0A4429] text-white flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold">Secure Gateway Checkout</h3>
                  <p className="text-[11px] text-[#F4F1E6]/70 mt-0.5">Direct Daraja API node verification protocols.</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(false)} 
                  className="p-1 hover:bg-white/10 rounded-lg text-white text-xs font-medium"
                >
                  Close
                </button>
              </div>

              <div className="p-4 bg-gray-50 border-b border-gray-100 text-xs flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700">{selectedPlan.name} Setup</p>
                  <p className="text-gray-400 mt-0.5">Billing Terms: Cycle variant ({billingCycle})</p>
                </div>
                <p className="text-base font-black text-[#0A4429]">
                  KES {(billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice).toLocaleString()}
                </p>
              </div>

              <form onSubmit={handleMpesaStkPush} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                    <Smartphone size={14} className="text-[#2E9D47]" /> Safaricom Payment Line
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0712345678 or 254712345678"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9D47] text-sm font-mono tracking-wide"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    An STK push popup verification check request framework will fire on this device path instantly.
                  </p>
                </div>

                <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl text-[10px] text-green-800 flex gap-2">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                  <p>Encrypted network loop channels verify transmission parameters. Subscriptions initialize exactly when webhooks settle successfully inside the ledger registries.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2E9D47] hover:bg-[#0A4429] text-white font-bold py-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 tracking-wide uppercase transition-colors"
                >
                  <CreditCard size={14} /> Request Authorization Pin Prompt
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}