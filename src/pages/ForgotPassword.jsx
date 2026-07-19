import React, { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../config/env";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/request_reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if(response.status === 200) {
        setIsSubmitted(true);
        Swal.fire({
        icon: "success",
        title: "Reset Link Sent",
        text: "Please check your inbox for reset instructions.",
        timer: 3000,
        showConfirmButton: false,
      });
      setEmail("");
      } else {
        Swal.fire({
        icon: "error",
        title: "Email Not Found",
        text: "Could not find an account associated with this email address.",
      });
      }

    } catch (error) {
      console.error("Password reset dispatch failure:", error);
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: error.response?.data?.detail || "Could not find an account associated with this email address.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E6]/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md">
        {/* Core Platform Logo Brand Frame */}
        <div className="flex justify-center mb-6">
  <div className="bg-white p-3 rounded-full shadow-lg border border-gray-200">
    <img
      src="/unit_logo.png" // Update with your logo path
      alt="UNIT Logo"
      className="w-16 h-16 object-contain rounded-full"
    />
  </div>
</div>
        <h2 className="mt-6 text-center text-3xl font-bold text-[#0A4429] tracking-tight">
          Reset Your Password
        </h2>
        
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10">
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Provide your registered email address below. We will send you a reset link.
                </p>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. johndoe@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-medium text-white bg-[#2E9D47] hover:bg-[#0A4429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E9D47] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Post-Submission Success Layout Engine Block View */
            <div className="text-center py-4 animate-in fade-in duration-300">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#2E9D47]/10 text-[#2E9D47] mb-4">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-lg font-bold text-[#0A4429]">Email Sent</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed px-2">
                An email has been sent to <span className="font-semibold text-gray-700">{email}</span>. Please check your inbox.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E9D47] hover:text-[#0A4429] transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Modify email</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation Recovery Action Row Context Panel */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs">
            <a 
              href="/signin" 
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#0A4429] transition-colors font-medium"
            >
              <ArrowLeft size={14} />
              Back to login
            </a>
            <span className="text-gray-400 cursor-default font-light">
              Secured by Zenstudio
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}