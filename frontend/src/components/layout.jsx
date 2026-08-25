import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { useAuth, useAdminAuth, clearAuth, startBooking } from "../services/store.js";
import { SOCIAL_LINKS, outlineButton } from "../data/constants.js";

export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="30" cy="21" r="11" />
      <circle cx="16" cy="13" r="4" />
      <circle cx="9" cy="21" r="3.3" />
      <circle cx="11" cy="30" r="2.9" />
      <circle cx="19" cy="36" r="3.4" />
      <circle cx="29" cy="38" r="3" />
      <circle cx="40" cy="34" r="3.8" />
      <circle cx="46" cy="25" r="3.4" />
      <circle cx="43" cy="14" r="3" />
      <circle cx="34" cy="7" r="2.8" />
      <circle cx="23" cy="7" r="2.4" />
    </svg>
  );
}

export function Logo({ compact = false }) {
  return (
    <Link to="/" className={`brand ${compact ? "compact" : ""}`}>
      <LogoMark />
      <span className="brand-text">
        <strong>FALKOM TAYYEB</strong>
        <small>EVENTS · EXHIBITION · CONFERENCE</small>
      </span>
    </Link>
  );
}

export function SocialLink({ href, label, badge }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      <b>{badge}</b>
      <span>{label}</span>
    </a>
  );
}

export function FooterItem({ icon, label, value }) {
  return (
    <div className="footer-item">
      <span>{React.cloneElement(icon, { size: 16 })}</span>
      <div>
        <small>{label}</small>
        <p>{value}</p>
      </div>
    </div>
  );
}

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return <Link className="header-login" to="/login">LOG IN</Link>;

  const name = user.username || (user.email ? user.email.split("@")[0] : "Guest");
  const initials = name.trim().charAt(0).toUpperCase() || "?";
  
  const doLogout = () => {
    clearAuth();
    setOpen(false);
    navigate("/");
  };

  return (
    <div 
      className="user-menu" 
      tabIndex={-1} 
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button type="button" className="user-chip" onClick={() => setOpen((o) => !o)}>
        <span className="user-avatar">{initials}</span>
        <span className="user-chip-text">
          <small>Signed in as</small>
          <b>{name}</b>
        </span>
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-head">
            <span className="user-avatar large">{initials}</span>
            <div>
              <strong>{name}</strong>
              <small>{user.email || "No email on file"}</small>
            </div>
          </div>
          <Link to="/account" onClick={() => setOpen(false)}><User size={14} /> My Account</Link>
          <button type="button" onClick={doLogout}><Lock size={14} /> Log Out</button>
        </div>
      )}
    </div>
  );
}

export function Layout({ children }) {
  const navigate = useNavigate();
  const isAdmin = useAdminAuth();

  return (
    <div className="app-shell">
      <header className="navbar">
        <Logo />
        <nav>
          <Link to="/">HOME</Link>
          <Link to="/services">SERVICES</Link>
          {isAdmin && <Link to="/admin">ADMIN PANEL</Link>}
          <Link to="/gallery">GALLERY</Link>
          <Link to="/about-us">ABOUT US</Link>
          <Link to="/contact-us">CONTACT US</Link>
        </nav>
        <div className="header-actions">
          <UserMenu />
          <button type="button" className={outlineButton} onClick={() => startBooking(navigate)}>
            PLAN YOUR EVENT <ArrowRight size={14} />
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-art">
          <section className="footer-map">
            <div className="map-decoration" />
            <MapPin className="footer-pin" size={38} />
            <h2>ABU DHABI, UAE</h2>
            <p>We proudly serve clients across the UAE<br />and beyond.</p>
            <div className="follow-title">FOLLOW US</div>
            <div className="footer-socials">
              <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram" badge="IG" />
              <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook" badge="FB" />
              <SocialLink href={SOCIAL_LINKS.linkedin} label="LinkedIn" badge="IN" />
            </div>
          </section>
          <section className="footer-quote">
            <div className="quote-mark">“</div>
            <p>We don't just plan events,<br />we create memories<br />that last a lifetime.</p>
            <div className="quote-divider">◆</div>
            <Logo compact />
          </section>
        </div>
        <div className="footer-contact">
          <a href="tel:+971506642554"><Phone size={14} /> +971 50 664 2554</a>
          <a href="mailto:falkomtayyeb2024@gmail.com"><Mail size={14} /> falkomtayyeb2024@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}