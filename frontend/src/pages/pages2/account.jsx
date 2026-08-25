import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, clearAuth } from '../context/AuthContext';
import { outlineButton, goldButton } from '../utils/styles';
import { Calendar, Tag, Package as PackageIcon, MapPin, Mail, Lock } from 'lucide-react';
function EventCard({ event, past }) {
  return <div className={`card event-card ${past ? "is-past" : ""}`}>
    <div className="event-card-top"><span className="event-date"><Calendar size={13} /> {event.eventDate || "Date TBD"}</span><span className={`event-status ${past ? "done" : "active"}`}>{past ? "COMPLETED" : (event.status || "PENDING")}</span></div>
    <h4>{event.eventName || "Untitled Event"}</h4>
    <p><Tag size={12} /> {event.eventType || "Event"}</p>
    <p><PackageIcon size={12} /> {event.package || "GOLD"} Package</p>
    <p><MapPin size={12} /> {event.location || "Location TBD"}</p>
  </div>;
}

function Account() {
  const navigate = useNavigate();
  const user = useAuth() || {};
  const name = user.username || (user.email ? user.email.split("@")[0] : "Guest");
  const initials = name.trim().charAt(0).toUpperCase() || "?";
  const events = JSON.parse(localStorage.getItem("myEvents") || "[]");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = events.filter(ev => !ev.eventDate || new Date(ev.eventDate) >= today);
  const past = events.filter(ev => ev.eventDate && new Date(ev.eventDate) < today);
  const doLogout = () => { clearAuth(); navigate("/"); };
  return <section className="page">
    <p className="eyebrow">MY ACCOUNT</p><h1 className="page-title">YOUR <b>PROFILE</b></h1>
    <div className="card profile-card">
      <span className="user-avatar xlarge">{initials}</span>
      <div className="profile-info"><h2>{name}</h2><p><Mail size={14} /> {user.email || "No email on file"}</p></div>
      <button className={outlineButton} onClick={doLogout}><Lock size={14} /> LOG OUT</button>
    </div>

    <h3 className="section-title">CURRENT & UPCOMING EVENTS</h3>
    {upcoming.length === 0
      ? <p className="intro">No upcoming events yet. <Link to="/event-details">Plan one now →</Link></p>
      : <div className="events-grid">{upcoming.map(ev => <EventCard key={ev.id} event={ev} />)}</div>}

    <h3 className="section-title">PAST EVENTS</h3>
    {past.length === 0
      ? <p className="intro">No past events yet.</p>
      : <div className="events-grid">{past.map(ev => <EventCard key={ev.id} event={ev} past />)}</div>}
  </section>;
}