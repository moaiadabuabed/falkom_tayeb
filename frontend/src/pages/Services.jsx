import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { getServicesBySection, SERVICES_EVENT, startBooking } from "../services/store.js";
import { SERVICE_ICON_OPTIONS, outlineButton } from "../data/constants.js";

export default function Services() {
  const navigate = useNavigate();
  
  const [cards, setCards] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  const loadServices = async () => {
    const fetchedCards = await getServicesBySection("cards");
    const fetchedEventTypes = await getServicesBySection("eventTypes");
    setCards(Array.isArray(fetchedCards) ? fetchedCards : []);
    setEventTypes(Array.isArray(fetchedEventTypes) ? fetchedEventTypes : []);
  };

  useEffect(() => {
    loadServices();

    const sync = () => { 
      loadServices(); 
    };

    window.addEventListener(SERVICES_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => { 
      window.removeEventListener(SERVICES_EVENT, sync); 
      window.removeEventListener("storage", sync); 
    };
  }, []);

  return (
    <section className="page">
      <p className="eyebrow">WHAT WE DO</p>
      <h1 className="page-title">OUR <b>SERVICES</b></h1>
      <p className="intro">
        We design, plan and manage all types of events across the UAE. From concept to execution, we handle every detail to create extraordinary experiences.
      </p>
      <div className="services-layout">
        <div className="service-grid">
          {cards.map((s) => {
            const Icon = SERVICE_ICON_OPTIONS[s.iconName || s.icon] || Sparkles;
            return (
              <div className="card service" key={s.id}>
                {s.appearance === "photo" && s.imageUrl ? (
                  <div className="service-photo">
                    <img src={s.imageUrl} alt={s.title} />
                  </div>
                ) : s.appearance === "customIcon" && s.imageUrl ? (
                  <div className="service-icon">
                    <img src={s.imageUrl} alt={s.title} style={{ width: 40, height: 40, objectFit: "contain" }} />
                  </div>
                ) : s.appearance !== "none" && (
                  <div className="service-icon">
                    <Icon size={40} />
                  </div>
                )}
                <h3>
                  {s.appearance === "icon" && <Icon size={16} />}
                  {s.title}
                </h3>
                <p>{s.description || s.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="card side-card">
          <h2>ALL TYPES OF EVENTS</h2>
          {eventTypes.map((t) => {
            const Icon = SERVICE_ICON_OPTIONS[t.iconName || t.icon] || Sparkles;
            return (
              <p key={t.id}>
                {t.appearance === "customIcon" && t.imageUrl ? (
                  <img src={t.imageUrl} alt="" style={{ width: 16, height: 16, objectFit: "contain", display: "inline-block", verticalAlign: "middle" }} />
                ) : t.appearance !== "none" && (
                  <Icon size={16} />
                )}
                {t.title}
              </p>
            );
          })}
          <button type="button" className={outlineButton} onClick={() => startBooking(navigate)}>
            REQUEST AN EVENT <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}