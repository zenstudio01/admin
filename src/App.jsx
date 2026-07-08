import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Layout from './Components/Layout';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Properties from './pages/propert-manager/Properties';
import Tenants from './pages/propert-manager/Tenants';
import Index from './pages/Index';
import Signup from './pages/Signup';
import Landlords from './pages/propert-manager/Landlord';
import Maintenance from './pages/propert-manager/Maintenance';
import Finances from './pages/Finances';
import ProfessionalServices from './pages/ProfessionalServices';
import Compliance from './pages/Compliance';
import MaintenanceStore from './pages/admin/MaintenanceStore';
import AdminSettings from './pages/admin/AdminSettings';
import SubscriptionPackages from './pages/admin/SubscriptionPackages';
import ForgotPassword from './pages/ForgotPassword';
import UsersManagement from './pages/admin/Users';
import AdminDashboard from './pages/admin/AdminDashboard';

import StoreOwnerDashboard from './pages/store-owner/StoreOwnerDashboard';
import Products from './pages/store-owner/Products';
import OrderManagement from './pages/store-owner/Orders';
import StoreProfile from './pages/store-owner/StoreProfile';
  

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
        <Route path="/user-management" element={<UsersManagement />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* store owner routes */}
        <Route path="/store-owner-dashboard" element={<StoreOwnerDashboard />} />
        <Route path="/store-owner-products" element={<Products />} />
        <Route path="/store-owner-orders" element={<OrderManagement />} />
        <Route path="/store-owner-profile" element={<StoreProfile />} />
      </Routes>
      {/* </Layout> */}
    </Router>
    
  );
}

export default App;