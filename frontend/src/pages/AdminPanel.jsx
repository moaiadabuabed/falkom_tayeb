import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Image as ImageIcon, Lock, Mail, Package as PackageIcon, Sparkles, Users } from "lucide-react";
import { clearAdminAuth } from "../services/store.js";
import { outlineButton } from "../data/constants.js";
import AdminRequestsSection from "../admin/AdminRequestsSection.jsx";
import AdminGallerySection from "../admin/AdminGallerySection.jsx";
import AdminServicesSection from "../admin/AdminServicesSection.jsx";
import AdminPackagesSection from "../admin/AdminPackagesSection.jsx";
import AdminContactSection from "../admin/AdminContactSection.jsx";
import AdminUsersSection from "../admin/AdminUsersSection.jsx";

const ADMIN_TABS = [
  ["requests", "REQUESTS", ClipboardList, AdminRequestsSection],
  ["gallery", "GALLERY", ImageIcon, AdminGallerySection],
  ["services", "SERVICES", Sparkles, AdminServicesSection],
  ["packages", "PACKAGES", PackageIcon, AdminPackagesSection],
  ["contact", "CONTACT US", Mail, AdminContactSection],
  ["users", "USERS", Users, AdminUsersSection],
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("requests");

  const logout = () => { 
    clearAdminAuth(); 
    navigate("/"); 
  };

  const ActiveSection = (ADMIN_TABS.find((t) => t[0] === tab) || ADMIN_TABS[0])[3];

  return (
    <section className="page admin-panel">
      <div className="admin-block-head" style={{ marginBottom: 6 }}>
        <div>
          <p className="eyebrow">ADMIN PANEL</p>
          <h1 className="page-title" style={{ margin: 0 }}>CONTROL <b>CENTER</b></h1>
        </div>
        <button type="button" className={outlineButton} onClick={logout}>
          <Lock size={14} /> LOG OUT
        </button>
      </div>
      <div className="admin-tabs">
        {ADMIN_TABS.map(([id, label, Icon]) => (
          <button 
            type="button" 
            key={id} 
            className={`admin-tab ${tab === id ? "active" : ""}`} 
            onClick={() => setTab(id)}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      <div className="admin-tab-panel">
        <ActiveSection />
      </div>
    </section>
  );
}