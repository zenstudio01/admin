import { useState } from "react";
import { FaBuilding, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../config/env";

export default function Signin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const signin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Hit your Django authentication endpoint
      const response = await fetch(
        `${API_URL}/signin/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if(response.status === 403){
        Swal.fire({
          icon: "info",
          title: "Email Verification Required",
          text: "Please verify your email before logging in. Check your inbox for a verification link.",
        });
        return;
      }



      if(response.status == 200){

      const data = await response.json();
      // console.log("Data" + data.user.user_name);

      // Store auth tokens and user data securely
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false,
      });
      alert("Role: " + data.user.role);

      if(data.user.role === "property_manager"){
        navigate("/dashboard");
      }else if(data.user.role === "store owner"){
        navigate("/store-owner-dashboard");
      }else{
        navigate("/dashboard");
      }

    }else{
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
      });

    }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.detail || 
          error.response?.data?.message ||
          "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/unit_uniform_background.png')` }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-[#0A4429]/10">
          <div className="flex justify-center mb-6">
            {/* Styled using the primary logo green */}
            <div className="bg-[#2E9D47] p-4 rounded-full shadow-md shadow-[#2E9D47]/20">
              <FaBuilding className="text-white text-3xl" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-[#0A4429]">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500 mt-2 text-sm">
            Sign in to your UNIT account
          </p>

          <form onSubmit={signin} className="mt-8 space-y-5">
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[#2E9D47]"
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-[#2E9D47] hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

            {/* Main Action Button utilizing brand greens */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E9D47] hover:bg-[#0A4429] text-white py-3 rounded-lg font-semibold shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                      <div className="flex justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     </div>
                     ) : "Sign In"
              }
            </button>

            <div className="text-center mt-6 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Don't have an account?{" "}
                <a href="/signup" className="text-[#2E9D47] hover:text-[#0A4429] font-semibold transition-colors">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}