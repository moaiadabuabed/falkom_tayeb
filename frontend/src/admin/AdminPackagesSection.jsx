import React, { useEffect, useState } from "react";
import { Package as PackageIcon, Plus, Star, Trash2, X } from "lucide-react";
import { getRequirementsFor, addRequirement, removeRequirement, ALL_EVENT_TYPES } from "../services/store.js";
import { eventTypes, packages, goldButton, outlineButton } from "../data/constants.js";

function AdminAddRequirementsPanel() {
  const [eventType, setEventType] = useState(ALL_EVENT_TYPES);
  const [packageType, setPackageType] = useState("SILVER");
  const [newItem, setNewItem] = useState("");
  const [current, setCurrent] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await getRequirementsFor(eventType, packageType);
      setCurrent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading requirements:", err);
      setCurrent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [eventType, packageType]);

  const add = async () => {
    const clean = newItem.trim();
    if (!clean) return;
    try {
      await addRequirement(eventType, packageType, clean);
      setNewItem("");
      await fetchRequirements();
    } catch (err) {
      console.error("Error adding requirement:", err);
    }
  };

  const remove = async (item) => {
    try {
      await removeRequirement(item);
      await fetchRequirements();
    } catch (err) {
      console.error("Error removing requirement:", err);
    }
  };

  return (
    <div className="card form-card admin-block">
      <p className="eyebrow">① CHOOSE EVENT TYPE &amp; PACKAGE</p>
      <div className="admin-two">
        <select className="admin-select" value={eventType} onChange={e => setEventType(e.target.value)}>
          <option value={ALL_EVENT_TYPES}>{ALL_EVENT_TYPES}</option>
          {eventTypes.map(([name]) => <option key={name} value={name}>{name}</option>)}
        </select>
        <select className="admin-select" value={packageType} onChange={e => setPackageType(e.target.value)}>
          {packages.map(([id]) => <option key={id} value={id}>{id}</option>)}
        </select>
      </div>
      <p className="eyebrow">② SERVICES</p>
      <div className="req-list">
        {loading ? (
          <p className="admin-empty">Loading requirements...</p>
        ) : current.length === 0 ? (
          <p className="admin-empty">No requirements yet for this selection.</p>
        ) : (
          current.map(item => (
            <div className="req-item" key={item}>
              <Star size={13} />
              <span style={{ flex: 1 }}>{item}</span>
              <button type="button" onClick={() => remove(item)} aria-label={`Remove ${item}`}>
                <X size={13} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="add-item">
        <input 
          value={newItem} 
          onChange={e => setNewItem(e.target.value)} 
          onKeyDown={e => e.key === "Enter" && add()} 
          placeholder="Add a new service or requirement..." 
        />
        <button type="button" className={outlineButton} onClick={add}>
          <Plus size={14} /> ADD ITEM
        </button>
      </div>
    </div>
  );
}

function AdminDeleteRequirementsPanel() {
  const [eventType, setEventType] = useState(ALL_EVENT_TYPES);
  const [packageType, setPackageType] = useState("SILVER");
  const [checked, setChecked] = useState([]);
  const [current, setCurrent] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await getRequirementsFor(eventType, packageType);
      setCurrent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading requirements for delete:", err);
      setCurrent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [eventType, packageType]);

  const toggle = item => setChecked(c => c.includes(item) ? c.filter(i => i !== item) : [...c, item]);

  const submit = async () => {
    if (checked.length === 0) return;
    try {
      for (const item of checked) {
        await removeRequirement(item);
      }
      setChecked([]);
      await fetchRequirements();
    } catch (err) {
      console.error("Error deleting requirements:", err);
    }
  };

  return (
    <div className="card form-card admin-block">
      <p className="eyebrow">SELECT EVENT TYPE &amp; PACKAGE</p>
      <div className="admin-two">
        <select className="admin-select" value={eventType} onChange={e => { setEventType(e.target.value); setChecked([]); }}>
          <option value={ALL_EVENT_TYPES}>{ALL_EVENT_TYPES}</option>
          {eventTypes.map(([name]) => <option key={name} value={name}>{name}</option>)}
        </select>
        <select className="admin-select" value={packageType} onChange={e => { setPackageType(e.target.value); setChecked([]); }}>
          {packages.map(([id]) => <option key={id} value={id}>{id}</option>)}
        </select>
      </div>
      <div className="req-list">
        {loading ? (
          <p className="admin-empty">Loading requirements...</p>
        ) : current.length === 0 ? (
          <p className="admin-empty">Nothing to delete here.</p>
        ) : (
          current.map(item => (
            <label className={`req-item ${checked.includes(item) ? "checked" : ""}`} key={item} style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} />
              <span>{item}</span>
            </label>
          ))
        )}
      </div>
      <button 
        type="button" 
        className={goldButton} 
        disabled={checked.length === 0} 
        onClick={submit} 
        style={{ marginTop: 16, opacity: checked.length === 0 ? 0.5 : 1 }}
      >
        <Trash2 size={14} /> DELETE SELECTED
      </button>
    </div>
  );
}

export default function AdminPackagesSection() {
  return (
    <>
      <h3 className="section-title">
        <PackageIcon size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
        ADD REQUIREMENTS
      </h3>
      <AdminAddRequirementsPanel />
      <h3 className="section-title" style={{ marginTop: 34 }}>
        <Trash2 size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
        DELETE REQUIREMENT
      </h3>
      <AdminDeleteRequirementsPanel />
    </>
  );
}