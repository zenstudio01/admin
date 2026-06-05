import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  Briefcase, 
  Users, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';
import { API_URL } from '../config/env';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'PM', // Defaulting to Property Manager
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Extracted user roles from your Django model
  const roles = [
    { value: 'PM', label: 'Property Manager', icon: Building2 },
    { value: 'LANDLORD', label: 'Landlord', icon: Users },
    { value: 'TENANT', label: 'Tenant', icon: User },
    { value: 'PROVIDER', label: 'Service Provider / Fundi', icon: Briefcase },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Account created successfully! Redirecting to login...' });
        // Clear form or handle navigation here
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed. Please check your details.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to connect to the server. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 font-sans"
      style={{ backgroundImage: `url('/unit_uniform_background.png')` }}
    >
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[#0A4429]/10">
        
        {/* Left Branding Panel */}
        <div className="bg-[#0A4429] text-[#F4F1E6] p-8 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E9D47]/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
          
          <div className="z-10">
            {/* Minimalist representation of the logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 border-2 border-[#2E9D47] rounded-lg flex items-center justify-center font-bold text-xl text-[#2E9D47]">
                U
              </div>
              <span className="text-xl font-bold tracking-wider text-white">UNIT</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-2">The Operating System for Property Managers</h2>
            <p className="text-sm text-[#F4F1E6]/70">Streamline your portfolio, access verified service providers, and automate payouts in one place.</p>
          </div>

          <div className="mt-8 md:mt-0 z-10 border-t border-[#F4F1E6]/10 pt-4">
            <p className="text-xs text-[#F4F1E6]/50">© 2026 UNIT Proptech. All rights reserved.</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 md:w-7/12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#0A4429]">Create your account</h3>
            <p className="text-sm text-gray-500 mt-1">Get started by choosing your specific user role.</p>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-sm mb-4 border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Picker Segmented Control Grid */}
            <div>
              <label className="text-xs font-semibold text-[#0A4429] uppercase tracking-wider block mb-2">I am a:</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const IconComponent = r.icon;
                  const isSelected = formData.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: r.value }))}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#2E9D47] bg-[#2E9D47]/5 text-[#0A4429] font-semibold ring-1 ring-[#2E9D47]' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={16} className={isSelected ? 'text-[#2E9D47]' : 'text-gray-400'} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Phone Number (M-Pesa Linked)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="e.g. +254712345678"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9D47] focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#2E9D47] hover:bg-[#2E9D47]/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
            >
              {isLoading ? 'Creating Account...' : 'Register Account'}
              {!isLoading && <ArrowRight size={16} />}
            </button>

            <div className="text-center mt-4 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <a href="/login" className="text-[#2E9D47] hover:text-[#0A4429] font-semibold transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;