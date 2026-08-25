import React from "react";
import { whyChooseUs, ourValues } from "../data/constants.js";

export default function AboutUs() {
  return (
    <section className="page">
      <p className="eyebrow">WHO WE ARE</p>
      <h1 className="page-title">ABOUT <b>US</b></h1>
      <p className="intro">
        Falkom Tayyeb is an Abu Dhabi based event planning and management company dedicated to turning ideas into unforgettable experiences. We work closely with our clients to plan, organize and manage every detail of their events, ensuring everything runs smoothly from start to finish.
      </p>
      <p className="intro">
        Our goal is simple: to create unique, well organized and memorable events that reflect our clients' vision, while delivering a professional and enjoyable experience for everyone involved - from the first conversation to the last guest leaving the room.
      </p>

      <h3 className="section-title">WHY CHOOSE US</h3>
      <div className="feature-grid" style={{ padding: "0 0 40px", margin: 0 }}>
        {whyChooseUs.map(([title, desc, Icon]) => (
          <div className="card feature" key={title}>
            <Icon size={25} />
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <h3 className="section-title">OUR VALUES</h3>
      <div className="feature-grid" style={{ padding: 0, margin: 0 }}>
        {ourValues.map(([title, desc, Icon]) => (
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