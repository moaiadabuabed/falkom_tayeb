import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { startBooking } from "../services/store.js";
import { goldButton } from "../data/constants.js";

export default function Home() {
  const navigate = useNavigate();
  
  const features = [
    ["BESPOKE EXPERIENCES", "Custom designed events tailored to your vision.", Sparkles],
    ["FLAWLESS EXECUTION", "Every detail managed with precision.", CheckCircle2],
    ["PREMIUM QUALITY", "We work with the finest standards and partners.", ShieldCheck],
    ["DEDICATED TEAM", "Professionals dedicated to your satisfaction.", Users],
  ];

  return (
    <section className="page home">
      <div className="hero">
        <div>
          <h1>EXTRAORDINARY<br /><em>MOMENTS.</em><br />PERFECTLY PLANNED.</h1>
          <p>We turn your vision into unforgettable experiences crafted with elegance, precision and passion.</p>
          <div className="hero-actions">
            <button type="button" className={goldButton} onClick={() => startBooking(navigate)}>
              PLAN YOUR EVENT <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="feature-grid">
        {features.map(([title, desc, Icon]) => (
          <div className="card feature" key={title}>
            <Icon size={25} />
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}