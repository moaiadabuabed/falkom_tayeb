import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Crown, Minus, Plus, Sliders } from "lucide-react";
import { getRequirementsFor } from "../services/store.js";
import { packages, outlineButton, goldButton } from "../data/constants.js";

export default function PackageSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("GOLD");
  const eventType = localStorage.getItem("eventType") || "";
  
  const initial = { 
    Stage: 1, 
    Chairs: 100, 
    Tables: 10, 
    "LED Screens": 1, 
    Lighting: 1, 
    "Sound System": 1, 
    Photography: 1, 
    Videography: 1, 
    Decorations: 1 
  };
  
  const [quantities, setQuantities] = useState(initial);
  const [newItem, setNewItem] = useState("");
  const [packageRequirements, setPackageRequirements] = useState({});

  const safePackages = Array.isArray(packages) ? packages : [];

  useEffect(() => {
    const fetchAllRequirements = async () => {
      const reqsMap = {};
      for (const [id] of safePackages) {
        try {
          const reqs = await getRequirementsFor(eventType, id);
          reqsMap[id] = Array.isArray(reqs) ? reqs : [];
        } catch {
          reqsMap[id] = [];
        }
      }
      setPackageRequirements(reqsMap);
    };

    fetchAllRequirements();
  }, [eventType]);

  const update = (key, amount) => setQuantities((q) => ({ ...q, [key]: Math.max(0, q[key] + amount) }));
  const setQuantity = (key, value) => setQuantities((q) => ({ ...q, [key]: Math.max(0, Number(value) || 0) }));

  const addItem = () => {
    const cleanName = newItem.trim();
    if (!cleanName || Object.prototype.hasOwnProperty.call(quantities, cleanName)) return;
    setQuantities((q) => ({ ...q, [cleanName]: 1 }));
    setNewItem("");
  };

  const handleNext = () => {
    localStorage.setItem("package", JSON.stringify({ selected, quantities }));
    navigate("/requirements");
  };

  return (
    <section className="page">
      <h1 className="page-title">PACKAGE SELECTION</h1>
      <p className="intro">Choose a package that suits your event or select Customize to build your own.</p>
      
      <div className="card package-box">
        <p className="eyebrow">① CHOOSE A PACKAGE OR CUSTOMIZE</p>
        <div className="package-grid">
          {safePackages.map(([id, desc]) => {
            const requirements = packageRequirements[id] || [];
            return (
              <button 
                type="button"
                className={`package-card ${selected === id ? "selected" : ""}`} 
                key={id} 
                onClick={() => setSelected(id)}
              >
                <Crown size={24} />
                <h3>{id}</h3>
                <p>{desc}</p>
                {requirements.map((f, idx) => (
                  <small key={typeof f === "object" ? f.id || idx : f + idx}>
                    <Check size={12} />
                    {typeof f === "object" ? f.requirementItem || f.title : f}
                  </small>
                ))}
              </button>
            );
          })}
          <button 
            type="button"
            className={`package-card ${selected === "CUSTOM" ? "selected" : ""}`} 
            onClick={() => setSelected("CUSTOM")}
          >
            <Sliders size={24} />
            <h3>CUSTOMIZE</h3>
            <p>Build your own custom setup tailored precisely to your requirements.</p>
            <small>Select to unlock table below</small>
          </button>
        </div>
      </div>

      <div className={`card customization ${selected !== "CUSTOM" ? "disabled" : ""}`}>
        <p className="eyebrow">② CUSTOMIZE YOUR EVENT ITEMS</p>
        {Object.entries(quantities).map(([key, value]) => (
          <div className="quantity" key={key}>
            <span>{key}</span>
            <div>
              <button type="button" disabled={selected !== "CUSTOM"} onClick={() => update(key, -1)}>
                <Minus size={13} />
              </button>
              <input 
                aria-label={`${key} quantity`} 
                type="number" 
                min="0" 
                value={value} 
                disabled={selected !== "CUSTOM"} 
                onChange={(e) => setQuantity(key, e.target.value)} 
              />
              <button type="button" disabled={selected !== "CUSTOM"} onClick={() => update(key, 1)}>
                <Plus size={13} />
              </button>
            </div>
          </div>
        ))}
        <div className="add-item">
          <input 
            value={newItem} 
            disabled={selected !== "CUSTOM"} 
            onChange={(e) => setNewItem(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && addItem()} 
            placeholder="Add another item, tool, or service..." 
          />
          <button type="button" className={outlineButton} disabled={selected !== "CUSTOM"} onClick={addItem}>
            <Plus size={14} /> ADD ITEM
          </button>
        </div>
      </div>

      <div className="actions">
        <button type="button" className={outlineButton} onClick={() => navigate("/event-type")}>
          <ArrowLeft size={14} /> PREVIOUS STEP
        </button>
        <button type="button" className={goldButton} onClick={handleNext}>
          NEXT STEP <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}