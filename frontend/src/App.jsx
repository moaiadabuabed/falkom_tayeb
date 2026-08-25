import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout.jsx";
import { WizardLayout } from "./components/StepIndicator.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireAdminAuth from "./components/RequireAdminAuth.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Gallery from "./pages/Gallery.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Account from "./pages/Account.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import EventType from "./pages/EventType.jsx";
import PackageSelection from "./pages/PackageSelection.jsx";
import Requirements from "./pages/Requirements.jsx";
import ReviewSubmit from "./pages/ReviewSubmit.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminRequestDetail from "./pages/AdminRequestDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* User Protected Routes */}
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
          <Route path="/event-details" element={<RequireAuth><WizardLayout currentStep={1}><EventDetails /></WizardLayout></RequireAuth>} />
          <Route path="/event-type" element={<WizardLayout currentStep={2}><EventType /></WizardLayout>} />
          
          {/* Package Selection Routes */}
          <Route path="/packages" element={<WizardLayout currentStep={3}><PackageSelection /></WizardLayout>} />
          <Route path="/package-selection" element={<Navigate to="/packages" replace />} />
          
          <Route path="/requirements" element={<WizardLayout currentStep={4}><Requirements /></WizardLayout>} />
          <Route path="/review" element={<WizardLayout currentStep={5}><ReviewSubmit /></WizardLayout>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdminAuth><AdminPanel /></RequireAdminAuth>} />
          <Route path="/admin/requests/:id" element={<RequireAdminAuth><AdminRequestDetail /></RequireAdminAuth>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}