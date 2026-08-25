import React from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Package as PackageIcon, Tag } from "lucide-react";
import { goldButton, outlineButton } from "../data/constants.js";

export function Field({ label, icon, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        {React.cloneElement(icon, { size: 16 })}
        <input {...props} />
      </div>
    </label>
  );
}

export function Actions({ previous, next, onNext }) {
  return (
    <div className="actions" style={!previous ? { justifyContent: "flex-end" } : undefined}>
      {previous && (
        <button type="button" className={outlineButton} onClick={previous}>
          <ArrowLeft size={14} /> PREVIOUS STEP
        </button>
      )}
      <button type={onNext ? "button" : "submit"} className={goldButton} onClick={onNext}>
        {next} <ArrowRight size={14} />
      </button>
    </div>
  );
}

export function InfoCard({ icon, title, children }) {
  return (
    <div className="info-card">
      <h3>
        {React.cloneElement(icon, { size: 16 })}
        {title}
      </h3>
      {children}
    </div>
  );
}

export function EventCard({ event, past }) {
  return (
    <div className={`card event-card ${past ? "is-past" : ""}`}>
      <div className="event-card-top">
        <span className="event-date">
          <Calendar size={13} /> {event.eventDate || "Date TBD"}
        </span>
        <span className={`event-status ${past ? "done" : "active"}`}>
          {past ? "COMPLETED" : (event.status || "PENDING")}
        </span>
      </div>
      <h4>{event.eventName || "Untitled Event"}</h4>
      <p><Tag size={12} /> {event.eventType || "Event"}</p>
      <p><PackageIcon size={12} /> {event.package || "GOLD"} Package</p>
      <p><MapPin size={12} /> {event.location || "Location TBD"}</p>
    </div>
  );
}