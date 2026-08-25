import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth, clearAuth, getMyEvents } from "../services/store.js";
import { EventCard } from "../components/eventwizard.jsx";
import { outlineButton } from "../data/constants.js";

export default function Account() {
  const navigate = useNavigate();
  const user = useAuth() || {};
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const name = user.username || (user.email ? user.email.split("@")[0] : "Guest");
  const initials = name.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      setLoading(true);
      try {
        const data = await getMyEvents();
        if (isMounted) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error loading user events:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEvents();
    return () => { isMounted = false; };
  }, [user.email]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter((ev) => {
    if (!ev.eventDate) return true;
    const evDate = new Date(ev.eventDate);
    evDate.setHours(0, 0, 0, 0);
    return evDate >= today;
  });

  const past = events.filter((ev) => {
    if (!ev.eventDate) return false;
    const evDate = new Date(ev.eventDate);
    evDate.setHours(0, 0, 0, 0);
    return evDate < today;
  });

  const doLogout = () => { 
    clearAuth(); 
    navigate("/"); 
  };

  return (
    <section className="page">
      <p className="eyebrow">MY ACCOUNT</p>
      <h1 className="page-title">YOUR <b>PROFILE</b></h1>
      
      <div className="card profile-card">
        <span className="user-avatar xlarge">{initials}</span>
        <div className="profile-info">
          <h2>{name}</h2>
          <p><Mail size={14} /> {user.email || "No email on file"}</p>
        </div>
        <button type="button" className={outlineButton} onClick={doLogout}>
          <Lock size={14} /> LOG OUT
        </button>
      </div>

      <h3 className="section-title">CURRENT & UPCOMING EVENTS</h3>
      {loading ? (
        <p className="intro">Loading your events...</p>
      ) : upcoming.length === 0 ? (
        <p className="intro">No upcoming events yet. <Link to="/event-details">Plan one now →</Link></p>
      ) : (
        <div className="events-grid">
          {upcoming.map((ev, index) => (
            <EventCard key={ev.id || ev._id || index} event={ev} />
          ))}
        </div>
      )}

      <h3 className="section-title">PAST EVENTS</h3>
      {loading ? (
        <p className="intro">Loading past events...</p>
      ) : past.length === 0 ? (
        <p className="intro">No past events yet.</p>
      ) : (
        <div className="events-grid">
          {past.map((ev, index) => (
            <EventCard key={ev.id || ev._id || index} event={ev} past />
          ))}
        </div>
      )}
    </section>
  );
}