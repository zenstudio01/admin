import React, { useState } from "react";
import HomeHeader from "../components/Home-header";
import HomeFooter from "../components/Home-footer";
import Colors from "../constants/colors";

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

export default function Home() {
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const popularServices = ["Electrical", "Plumbing", "Cleaning", "Painting"];

  const categories = [
    { icon: <Zap size={22} className="text-amber-500 group-hover:scale-110 transition-transform duration-300" />, name: "Electrical" },
    { icon: <Droplets size={22} className="text-blue-500 group-hover:scale-110 transition-transform duration-300" />, name: "Plumbing" },
    { icon: <Sparkles size={22} className="text-teal-500 group-hover:scale-110 transition-transform duration-300" />, name: "Cleaning" },
    { icon: <Paintbrush size={22} className="text-orange-500 group-hover:scale-110 transition-transform duration-300" />, name: "Painting" },
    { icon: <Truck size={22} className="text-purple-500 group-hover:scale-110 transition-transform duration-300" />, name: "Moving" },
    { icon: <Hammer size={22} className="text-emerald-500 group-hover:scale-110 transition-transform duration-300" />, name: "Construction" },
    { icon: <Scissors size={22} className="text-pink-500 group-hover:scale-110 transition-transform duration-300" />, name: "Beauty" },
    { icon: <Wrench size={22} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />, name: "Mechanics" },
    { icon: <Wifi size={22} className="text-sky-500 group-hover:scale-110 transition-transform duration-300" />, name: "Internet" },
    { icon: <Lock size={22} className="text-rose-500 group-hover:scale-110 transition-transform duration-300" />, name: "Security" },
  ];

  return (
    <div 
      className="min-h-screen text-[#111827] font-sans antialiased overflow-x-hidden"
      style={{ backgroundColor: Colors.background || "#FFFFFF" }}
    >
      
      {/* NAVIGATION HEADER */}
      <HomeHeader />

      {/* 1. HERO SECTION & 2. PREMIUM SEARCH INTEGRATION */}
      <section id="home" className="relative pt-8 pb-16 lg:py-24 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Messaging & Active Search Input Console */}
            <div className="lg:col-span-7 space-y-6 transition-all duration-700 ease-out transform translate-x-0 opacity-100">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse"
                style={{ backgroundColor: `${Colors.primary}15`, color: Colors.primary }}
              >
                <UserCheck size={14} style={{ color: Colors.primary }} /> 100% Vetted Local Experts
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900">
                Find Trusted Professionals &amp; Businesses Near You
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover verified companies and skilled professionals for plumbing, electrical work, cleaning, construction, repairs, beauty services, moving, and much more—all in one place.
              </p>

              {/* Action Buttons Matrix */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="#search-block" 
                  className="text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 transform hover:translate-y-[-2px] hover:shadow-lg group"
                  style={{ backgroundColor: Colors.primary }}
                >
                  Find Services <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </a>
                <button className="border-2 border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 bg-white transform hover:translate-y-[-2px]">
                  Register Your Business
                </button>
              </div>

              {/* Interactive Multi-Field Premium Search Section Card */}
              <div id="search-block" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-200/50 mt-8 space-y-4 max-w-2xl transition-transform duration-300 hover:scale-[1.01]">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Start searching instantly</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative group">
                    <Search className="absolute left-3.5 top-3.5 text-slate-400 transition-colors duration-200" size={18} />
                    <input 
                      type="text"
                      placeholder="Search electricians, painters, cleaners..."
                      value={searchService}
                      onChange={(e) => setSearchService(e.target.value)}
                      className="w-full bg-slate-50 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:bg-white text-gray-800 transition-all duration-300 shadow-xs focus:shadow-md"
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-3.5 top-3.5" style={{ color: Colors.primary }} size={18} />
                    <input 
                      type="text"
                      placeholder="Your Location (e.g. Nairobi)"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-slate-50 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:bg-white text-gray-800 transition-all duration-300 shadow-xs focus:shadow-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium">Popular:</span>
                    {popularServices.map((service, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSearchService(service)}
                        className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md transition-all duration-200 active:scale-95 transform"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                  <button 
                    className="text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 w-full sm:w-auto shadow-sm transform hover:scale-[1.03] active:scale-95"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    Find Services
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Custom Trust Illustration Wrapper Grid */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center transition-all duration-1000 delay-200 transform translate-x-0 opacity-100">
              <div 
                className="absolute inset-0 rounded-full blur-3xl transform scale-110 -z-10 animate-pulse"
                style={{ backgroundColor: `${Colors.primary}1A` }}
              />
              <div className="w-full max-w-md bg-gradient-to-tr from-slate-50 to-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
                
                {/* Simulated App Node Interface Layout Mock */}
                <div className="border border-slate-100 rounded-2xl bg-white shadow-md p-4 mb-4 flex items-center gap-3 transform transition-transform duration-500 hover:translate-y-[-4px] hover:shadow-lg cursor-pointer">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${Colors.primary}15`, color: Colors.primary }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Customer Profile</p>
                    <p className="text-sm font-bold text-slate-900">Hiring Vetted Professionals</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl bg-white shadow-md p-4 mb-4 flex items-center gap-3 translate-x-6 transform transition-transform duration-500 hover:translate-y-[-4px] hover:translate-x-8 hover:shadow-lg cursor-pointer">
                  <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500"><Hammer size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Certified Professional</p>
                    <p className="text-sm font-bold text-slate-800">Electrician, Plumber &amp; Handyman</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl bg-white shadow-md p-4 mb-4 flex items-center gap-3 transform transition-transform duration-500 hover:translate-y-[-4px] hover:shadow-lg cursor-pointer">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500"><Building2 size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Company Teams</p>
                    <p className="text-sm font-bold text-slate-800">Verified Corporate Contractors</p>
                  </div>
                </div>

                {/* Central Focus Mobile App Unit */}
                <div className="mt-6 border-4 border-slate-900 rounded-2xl p-3 bg-slate-900 shadow-xl max-w-[200px] mx-auto text-center transform transition-all duration-500 hover:rotate-3 hover:scale-105">
                  <div className="bg-white rounded-xl py-4 px-2">
                    <div 
                      className="w-6 h-6 text-white rounded-md mx-auto flex items-center justify-center font-bold text-xs mb-1 animate-bounce"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      U
                    </div>
                    <p className="text-[10px] font-black tracking-tight" style={{ color: Colors.primary }}>UNIT APP</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full my-2 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 w-1/2 rounded-full animate-[loading_1.5s_infinite]"
                        style={{ backgroundColor: Colors.primary }}
                      />
                    </div>
                    <div className="w-3/4 h-1.5 bg-slate-100 rounded-full mx-auto" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CATEGORIES MODULE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Get custom solutions from top specialized work networks.</p>
          </div>
          <button className="text-sm font-bold flex items-center gap-1 group transform hover:translate-x-1 transition-all duration-300" style={{ color: Colors.primary }}>
            More Categories <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center group transform hover:translate-y-[-4px]"
            >
              <div className="p-3 bg-slate-50 transition-colors duration-300 rounded-xl mb-3">
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-slate-800 tracking-tight transition-colors duration-200">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE UNIT? */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mb-12 space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why Choose Unit?</h2>
          <p className="text-slate-500 text-sm">Building ecosystems anchored tightly around compliance, speed, and real metrics.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 1, title: "Verified Professionals", desc: "Every professional and company is verified before joining.", icon: <ShieldCheck size={24} className="transition-transform duration-300 group-hover:rotate-12" /> },
            { id: 2, title: "Easy Booking", desc: "Book services in just a few clicks without manual stress panels.", icon: <CheckCircle size={24} className="transition-transform duration-300 group-hover:scale-110" /> },
            { id: 3, title: "Trusted Reviews", desc: "Read genuine reviews before hiring to ensure maximum security.", icon: <Star size={24} className="transition-transform duration-300 group-hover:rotate-45" /> },
            { id: 4, title: "Fast Response", desc: "Receive responses from professionals nearby within minutes.", icon: <Zap size={24} className="transition-transform duration-300 group-hover:translate-y-[-2px]" /> }
          ].map(card => (
            <div key={card.id} className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-slate-200 group transform hover:translate-y-[-2px]">
              <div 
                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xs mb-4 transition-colors duration-300"
                style={{ color: Colors.primary }}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS TIMELINE */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-slate-500 text-sm mt-1">A transparent, seamless horizontal process flow to fulfill workflows instantly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { step: "Step 1", name: "Search a service", desc: "Specify skill requirements and location nodes using smart filters." },
            { step: "Step 2", name: "Compare professionals", desc: "Audit detailed digital verification parameters and past job histories." },
            { step: "Step 3", name: "Send a request", desc: "Deploy your request instantly to active specialists." },
            { step: "Step 4", name: "Get the job done", desc: "Fulfill project scopes safely with milestone transparency." }
          ].map((item, index) => (
            <div key={index} className="relative bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md group">
              <span 
                className="text-xs font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider transition-colors duration-300"
                style={{ backgroundColor: `${Colors.primary}15`, color: Colors.primary }}
              >
                {item.step}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-3 mb-1">{item.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-slate-300 group-hover:translate-x-1 transition-all duration-300">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED PROFESSIONALS */}
      <section id="professionals" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Professionals</h2>
            <p className="text-sm text-slate-500 mt-1">Independently verified individual specialists with exceptional response parameters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "John Kamau", role: "Electrician", rating: "4.9", jobs: "120", location: "Nairobi" },
              { name: "David Ochieng", role: "Plumber", rating: "4.8", jobs: "95", location: "Kisumu" },
              { name: "Mary Wambui", role: "Beauty Specialist", rating: "5.0", jobs: "140", location: "Kiambu" }
            ].map((pro, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl p-5 bg-[#F8FAFC] hover:bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-slate-200 group transform hover:translate-y-[-4px]">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 bg-slate-200 transition-colors duration-300 rounded-xl flex items-center justify-center font-bold text-lg"
                      style={{ color: Colors.primary }}
                    >
                      {pro.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{pro.name}</h4>
                      <p className="text-xs font-semibold" style={{ color: Colors.primary }}>{pro.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 py-2 border-y border-slate-200/60 my-3">
                    <span className="flex items-center gap-1 font-bold text-slate-800"><Star size={14} className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform duration-200" /> {pro.rating}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{pro.jobs} Jobs Done</span>
                    <span>•</span>
                    <span>{pro.location}</span>
                  </div>
                </div>
                <button 
                  className="w-full mt-2 py-2.5 bg-white border border-slate-200 font-bold text-xs rounded-xl transition-all duration-200 hover:shadow-xs active:scale-98 transform"
                  style={{ color: Colors.primary }}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED COMPANIES */}
      <section id="companies" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Companies</h2>
          <p className="text-sm text-slate-500 mt-1">Top-tier corporate firms and service agencies with full compliance credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "ABC Solutions Ltd", type: "Electrical Company", rating: "5.0", projects: "230", desc: "Turnkey electrical infrastructure layouts, standard operations maintenance, and heavy systems auditing." },
            { name: "Apex Moving &amp; Logistics", type: "Moving &amp; Haulage", rating: "4.9", projects: "410", desc: "Secure cross-county residential and commercial asset movements with full liability protections." }
          ].map((comp, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-slate-200 group transform hover:translate-y-[-4px]">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-black transition-colors duration-200" style={{ color: Colors.primary }}>{comp.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{comp.type}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    <Star size={13} className="fill-amber-500 text-amber-500" /> {comp.rating}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{comp.desc}</p>
                <p className="text-xs text-slate-400 font-semibold mb-4">Completed {comp.projects} Projects Successfully</p>
              </div>
              <button 
                className="w-full py-3 text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-sm transform active:scale-98"
                style={{ backgroundColor: Colors.primary }}
              >
                View Company
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">What Our Customers Say</h2>
          <div className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-3xl relative transition-transform duration-500 hover:scale-[1.01] hover:shadow-md">
            <div className="flex justify-center gap-1 mb-4 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current animate-[spin_4s_linear_infinite]" style={{animationDelay: `${i * 150}ms`}} />)}
            </div>
            <blockquote className="text-lg font-medium text-slate-800 leading-relaxed italic">
              "Unit helped me find a plumber in less than 20 minutes. The service layout was clean, payment parameters transparent, and the expert completely competent."
            </blockquote>
            <p className="text-xs font-bold uppercase tracking-widest mt-4" style={{ color: Colors.primary }}>— Verified Client, Kilimani</p>
          </div>
        </div>
      </section>

      {/* 9. STATISTICS LOG COUNTERS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { metric: "15,000+", label: "Customers", icon: <Users size={18} /> },
            { metric: "2,300+", label: "Professionals", icon: <Briefcase size={18} /> },
            { metric: "450+", label: "Companies", icon: <Building2 size={18} /> },
            { metric: "18,000+", label: "Completed Jobs", icon: <CheckCircle size={18} /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs transition-transform duration-300 hover:scale-105 group cursor-pointer">
              <div className="w-8 h-8 mx-auto bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-2 transition-colors duration-300">
                {stat.icon}
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-300" style={{ color: Colors.primary }}>{stat.metric}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CALL TO ACTION CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div 
          className="rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl group"
          style={{ backgroundColor: Colors.primary }}
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight transition-transform duration-300 group-hover:scale-[1.02]">Ready to Find the Right Professional?</h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-lg mx-auto">
              Join thousands of customers using Unit every day to handle corporate contracting and local property maintenance safely.
            </p>
            <div className="pt-4">
              <button className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER ARCHITECTURE */}
      <HomeFooter />

      {/* Keyframe Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}} />

    </div>
  );
}