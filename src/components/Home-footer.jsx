
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
export default function HomeFooter(){
    return(
        <footer id="contact" className="bg-[#111827] text-slate-400 text-sm pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Brand Info Block */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 group cursor-pointer w-max">
              <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center font-black text-white text-base transition-transform duration-300 group-hover:rotate-12">U</div>
              <span className="text-xl font-black text-white tracking-tight group-hover:text-[#22C55E] transition-colors duration-200">UNIT</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Connecting local verification nodes with corporate companies and skilled experts instantly across a single secure dashboard layer.
            </p>
            <div className="flex items-center gap-4 text-slate-500 pt-2">
              <a href="#" className="hover:text-white transition-all duration-200 transform hover:scale-110 hover:translate-y-[-2px] p-1"><FaFacebookF size={18} /></a>
              <a href="#" className="hover:text-white transition-all duration-200 transform hover:scale-110 hover:translate-y-[-2px] p-1"><FaInstagram size={18} /></a>
              <a href="#" className="hover:text-white transition-all duration-200 transform hover:scale-110 hover:translate-y-[-2px] p-1"><FaLinkedinIn size={18} /></a>
            </div>
          </div>

          {/* Column 2: Core Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#home" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">About Structure</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Services Guide</a></li>
              <li><a href="#how-it-works" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Fulfillment Plan</a></li>
            </ul>
          </div>

          {/* Column 3: Resource Entity Types */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Directories</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#professionals" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Professionals Log</a></li>
              <li><a href="#companies" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Companies Directory</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Skill Categorization</a></li>
            </ul>
          </div>

          {/* Column 4: Compliance Elements */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Contact Gateway</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Absolute Attributions Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <p>© 2026 UNIT Ecosystem Technology. All Rights Reserved.</p>
          <p className="tracking-tight">Designed for modern verified workflows.</p>
        </div>
      </footer>

    )
}