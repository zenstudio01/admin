import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Layout from './Components/Layout';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Index from './pages/Index';
import Signup from './pages/Signup';
import Landlords from './pages/Landlord';
import Maintenance from './pages/Maintenance';
import Finances from './pages/Finances';
import ProfessionalServices from './pages/ProfessionalServices';
import Compliance from './pages/Compliance';
import MaintenanceStore from './pages/MaintenanceStore';
import AdminSettings from './pages/AdminSettings';
import SubscriptionPackages from './pages/SubscriptionPackages';
import ForgotPassword from './pages/ForgotPassword';
  

function App() {
  return (
    // <AuthProvider>
    <Router>
      {/* <Layout> */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/landlords" element={<Landlords />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/professional-services" element={<ProfessionalServices />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/maintenance-store" element={<MaintenanceStore />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/subscription-packages" element={<SubscriptionPackages />} />
      </Routes>
      {/* </Layout> */}
    </Router>
    
  );
}

export default App;