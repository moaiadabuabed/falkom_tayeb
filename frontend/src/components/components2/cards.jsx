import React from 'react';
import { Calendar, Tag, Package as PackageIcon, MapPin, AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
function InfoCard({ icon, title, children }) { return <div className="info-card"><h3>{React.cloneElement(icon, { size: 16 })}{title}</h3>{children}</div>; }

function EventCard({ event, past }) {
  return <div className={`card event-card ${past ? "is-past" : ""}`}>
    <div className="event-card-top"><span className="event-date"><Calendar size={13} /> {event.eventDate || "Date TBD"}</span><span className={`event-status ${past ? "done" : "active"}`}>{past ? "COMPLETED" : (event.status || "PENDING")}</span></div>
    <h4>{event.eventName || "Untitled Event"}</h4>
    <p><Tag size={12} /> {event.eventType || "Event"}</p>
    <p><PackageIcon size={12} /> {event.package || "GOLD"} Package</p>
    <p><MapPin size={12} /> {event.location || "Location TBD"}</p>
  </div>;
}