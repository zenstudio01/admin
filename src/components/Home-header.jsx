import React, { useState } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Briefcase,
  Building2,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Hammer,
  Droplets,
  Paintbrush,
  Truck,
  Scissors,
  Wrench,
  Wifi,
  Lock,
  UserCheck,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";


export default function HomeHeader(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    return(
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 backdrop-blur-md bg-white/95 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-20 items-center">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-2 group cursor-pointer">
                      <div className="w-10 h-10 bg-[#0A4429] rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:rotate-6 transition-all duration-300">
                        <span className="text-white font-black text-xl tracking-tighter">U</span>
                      </div>
                      <span className="text-2xl font-black text-[#0A4429] tracking-tight group-hover:text-[#22C55E] transition-colors duration-300">UNIT</span>
                    </div>
        
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                      <a href="#home" className="text-[#0A4429] hover:text-[#22C55E] relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[#22C55E] transition-all duration-300">Home</a>
                      <a href="#professionals" className="hover:text-[#0A4429] hover:translate-y-[-1px] transition-all duration-200">Professionals</a>
                      <a href="#companies" className="hover:text-[#0A4429] hover:translate-y-[-1px] transition-all duration-200">Companies</a>
                      <a href="#how-it-works" className="hover:text-[#0A4429] hover:translate-y-[-1px] transition-all duration-200">How It Works</a>
                      <a href="#contact" className="hover:text-[#0A4429] hover:translate-y-[-1px] transition-all duration-200">Contact</a>
                    </div>
        
                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                      <button onClick={() => navigate("/index")} className="text-sm font-bold text-slate-700 hover:text-[#0A4429] transition-colors duration-200 px-4 py-2 hover:scale-105 active:scale-95 transform">
                        Sign in
                      </button>
                      <button onClick={() => navigate("/signup")} className="text-sm font-bold bg-[#0A4429] hover:bg-[#062c1a] text-white px-5 py-2.5 rounded-xl shadow-xs transition transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-emerald-900/10">
                        Sign Up
                      </button>
                    </div>
        
                    {/* Mobile Hamburger Trigger */}
                    <div className="md:hidden flex items-center">
                      <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-600 hover:text-[#0A4429] focus:outline-none transition-transform active:rotate-90 duration-200"
                      >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                      </button>
                    </div>
                  </div>
                </div>
        
                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                  <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-fadeIn">
                    <a href="#home" className="block py-2 text-base font-medium text-[#0A4429]" onClick={() => setMobileMenuOpen(false)}>Home</a>
                    <a href="#professionals" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Professionals</a>
                    <a href="#companies" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Companies</a>
                    <a href="#how-it-works" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                    <a href="#contact" className="block py-2 text-base font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                    <div className="pt-4 flex flex-col gap-3 border-t border-slate-100">
                      <button onClick={() => navigate("/index")} className="w-full text-center py-2.5 font-bold text-slate-700 border rounded-xl active:bg-slate-50">Login</button>
                      <button onClick={() => navigate("/signup")} className="w-full text-center py-2.5 font-bold bg-[#0A4429] text-white rounded-xl active:bg-[#062c1a]">Sign Up</button>
                    </div>
                  </div>
                )}
              </nav>
    )
}