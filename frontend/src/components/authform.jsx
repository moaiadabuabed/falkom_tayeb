import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { setAuth, setAdminAuth } from "../services/store.js";
import { api } from "../services/api.js";
import { DEMO_ADMIN, goldButton } from "../data/constants.js";
import { Logo } from "./layout.jsx";
import { Field } from "./eventwizard.jsx";

export default function AuthForm({ signup = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!signup && email.trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
      setAdminAuth();
      navigate("/admin", { replace: true });
      return;
    }

    if (signup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = signup 
        ? await api.register({ username: username.trim(), email: email.trim(), password })
        : await api.login(email.trim(), password);

      setAuth(data.token, data.user);

      const destination = location.state?.from || localStorage.getItem("afterLogin") || (data.user?.role === "admin" ? "/admin" : "/");
      localStorage.removeItem("afterLogin");
      navigate(destination, { replace: true });

    } catch (err) {
      setError(err.message || "Authentication failed.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <Logo compact />
          <h2>{signup ? <>CREATE YOUR <em>ACCOUNT</em></> : <>WELCOME <em>BACK</em></>}</h2>
          <p>{signup ? "Join Falkom Tayyeb and let's create extraordinary events together." : "Log in to your account to manage events, requests and quotations."}</p>
          <div className="auth-benefits">
            <span>✦ Secure and Reliable</span>
            <span>◷ Save Time</span>
            <span>✧ Personalized Experience</span>
          </div>
        </div>
        <div className="auth-form">
          <h3>{signup ? "SIGN UP" : "LOG IN"}</h3>
          <p>{signup ? "Create your account to get started" : "Enter your credentials to continue"}</p>
          <form onSubmit={submit}>
            {signup && (
              <Field 
                label="Username" 
                icon={<User />} 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username" 
                required 
              />
            )}
            <Field 
              label="Email Address" 
              icon={<Mail />} 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required 
            />
            <Field 
              label="Password" 
              icon={<Lock />} 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder={signup ? "Create a password" : "Enter your password"} 
              required 
            />
            {signup && (
              <Field 
                label="Confirm Password" 
                icon={<Lock />} 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your password" 
                required 
              />
            )}
            {error && <p className="error" style={{ color: "#e74c3c", marginTop: "10px", fontSize: "14px" }}>{error}</p>}
            <button type="submit" className={goldButton}>{signup ? "CREATE ACCOUNT" : "LOG IN"}</button>
          </form>
          <p className="auth-switch">
            {signup ? "Already have an account? " : "Don't have an account? "}
            <Link to={signup ? "/login" : "/signup"}>{signup ? "Log In" : "Sign Up"}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}