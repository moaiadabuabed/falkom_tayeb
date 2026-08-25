import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventTypes } from "../data/constants.js";
import { Actions } from "../components/eventwizard.jsx";

export default function EventType() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("CORPORATE EVENTS");

  const handleNext = () => {
    localStorage.setItem("eventType", selected);
    navigate("/packages");
  };

  return (
    <section className="page">
      <p className="eyebrow">STEP 2 OF 5</p>
      <h1 className="page-title">EVENT TYPE</h1>
      <p className="intro">Select the type of event you are planning.</p>
      
      <div className="event-type-grid">
        {eventTypes.map(([title, desc, Icon]) => (
          <button 
            type="button" 
            className={`card type-card ${selected === title ? "selected" : ""}`} 
            key={title} 
            onClick={() => setSelected(title)}
          >
            <Icon size={32} />
            <h3>{title}</h3>
            <p>{desc}</p>
            <span className="radio">{selected === title && "•"}</span>
          </button>
        ))}
      </div>
      
      <Actions 
        previous={() => navigate("/event-details")} 
        next="NEXT STEP →" 
        onNext={handleNext} 
      />
    </section>
  );
}