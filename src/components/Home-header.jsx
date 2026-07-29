import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Colors from "../constants/colors";

export default function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 border-b border-slate-100 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md p-1 group-hover:scale-105 transition-all duration-300">
            <img
              src="/logo.png"
              alt="UNIT Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a 
              href="#home" 
              className="relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] transition-all duration-300"
              style={{ color: Colors.primary, '--tw-after-bg': Colors.primary }}
            >
              Home
            </a>
            <a href="#professionals" className="hover:text-slate-900 hover:translate-y-[-1px] transition-all duration-200">Professionals</a>
            <a href="#companies" className="hover:text-slate-900 hover:translate-y-[-1px] transition-all duration-200">Companies</a>
            <a href="#how-it-works" className="hover:text-slate-900 hover:translate-y-[-1px] transition-all duration-200">How It Works</a>
            <a href="#contact" className="hover:text-slate-900 hover:translate-y-[-1px] transition-all duration-200">Contact</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate("/index")} 
              className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors duration-200 px-4 py-2 hover:scale-105 active:scale-95 transform"
            >
              Sign in
            </button>
            <button 
              onClick={() => navigate("/signup")} 
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-xs transition transform hover:scale-105 active:scale-95 hover:shadow-lg"
              style={{ backgroundColor: Colors.primary }}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none transition-transform active:rotate-90 duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <a 
            href="#home" 
            className="block py-2 text-base font-medium" 
            style={{ color: Colors.primary }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a href="#professionals" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Professionals</a>
          <a href="#companies" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Companies</a>
          <a href="#how-it-works" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#contact" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <div className="pt-4 flex flex-col gap-3 border-t border-slate-100">
            <button 
              onClick={() => navigate("/index")} 
              className="w-full text-center py-2.5 font-bold text-slate-700 border border-slate-200 rounded-xl active:bg-slate-50"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")} 
              className="w-full text-center py-2.5 font-bold text-white rounded-xl active:opacity-90"
              style={{ backgroundColor: Colors.primary }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}