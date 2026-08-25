import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { setAdminAuth } from "../services/store.js";
import { DEMO_ADMIN, goldButton } from "../data/constants.js";
import { Logo } from "../components/layout.jsx";
import { Field } from "../components/eventwizard.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
      setAdminAuth();
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid admin email or password.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <Logo compact />
          <h2>ADMIN <em>ACCESS</em></h2>
          <p>Restricted area. Sign in with your administrator credentials to manage requests, gallery, packages and users.</p>
          <div className="auth-benefits">
            <span>✦ Requests &amp; Approvals</span>
            <span>◷ Gallery Management</span>
            <span>✧ Packages &amp; Users</span>
          </div>
        </div>
        <div className="auth-form">
          <h3>ADMIN LOG IN</h3>
          <p>Enter your admin credentials to continue</p>
          <form onSubmit={submit}>
            <Field 
              label="Admin Email" 
              icon={<Mail />} 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter admin email" 
              required 
            />
            <Field 
              label="Admin Password" 
              icon={<Lock />} 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter admin password" 
              required 
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className={goldButton}>
              LOG IN <ArrowRight size={14} />
            </button>
          </form>
          <p className="auth-switch">Not an admin? <Link to="/">Back to site</Link></p>
        </div>
      </div>
    </section>
  );
}