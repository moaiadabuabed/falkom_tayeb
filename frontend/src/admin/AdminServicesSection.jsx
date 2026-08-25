import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Minus, Plus, Sparkles, Trash2 } from "lucide-react";
import { getServicesBySection, addCustomService, removeService, SERVICES_EVENT } from "../services/store.js";
import { SERVICE_ICON_OPTIONS, goldButton } from "../data/constants.js";
import { Field } from "../components/eventwizard.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminServicesSection() {
  // تهيئة الحالة بمصفوفات فارغة لمنع أخطاء .map أثناء التحميل الأول
  const [cards, setCards] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [section, setSection] = useState("cards");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [iconName, setIconName] = useState("Sparkles");
  const [appearance, setAppearance] = useState("icon");
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);

  // دالة جلب البيانات غير المتزامنة من store.js
  const loadServices = async () => {
    try {
      const cardsData = await getServicesBySection("cards");
      const eventTypesData = await getServicesBySection("eventTypes");
      setCards(Array.isArray(cardsData) ? cardsData : []);
      setEventTypes(Array.isArray(eventTypesData) ? eventTypesData : []);
    } catch (err) {
      console.error("Error loading services:", err);
      setCards([]);
      setEventTypes([]);
    }
  };

  useEffect(() => {
    loadServices();

    const sync = () => { loadServices(); };
    window.addEventListener(SERVICES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { 
      window.removeEventListener(SERVICES_EVENT, sync); 
      window.removeEventListener("storage", sync); 
    };
  }, []);

  const onFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!title.trim()) { setStatus("Enter a title first."); return; }
    if (section === "cards" && !desc.trim()) { setStatus("Enter a short description for the service card."); return; }
    if (section === "cards" && appearance === "photo" && !imagePreview) { setStatus("Choose a photo first, or switch to Icon / No image."); return; }
    if (appearance === "customIcon" && !imagePreview) { setStatus("Upload an icon image first, or switch to Icon / No image."); return; }
    
    await addCustomService({ title: title.trim(), desc: desc.trim(), iconName, imageUrl: imagePreview, appearance, section });
    setTitle(""); setDesc(""); setImagePreview("");
    setStatus(`"${title.trim()}" added to ${section === "eventTypes" ? "All Types of Events" : "the Services cards"}.`);
    loadServices();
  };

  const confirmDelete = async () => { 
    if (confirmTarget) {
      await removeService(confirmTarget); 
      loadServices();
    }
    setConfirmTarget(null); 
  };

  const renderRow = s => {
    const Icon = SERVICE_ICON_OPTIONS[s.iconName] || Sparkles;
    return <div className="admin-user-row" key={s.id}>
      <span className="user-avatar">{(s.appearance === "photo" || s.appearance === "customIcon") && s.imageUrl ? <img src={s.imageUrl} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : s.appearance === "none" ? <Minus size={14} /> : <Icon size={16} />}</span>
      <div className="admin-user-info"><strong>{s.title}</strong>{s.desc && <small>{s.desc}</small>}</div>
      {s.isDefault && <span className="pkg-tag">DEFAULT</span>}
      <button type="button" className="icon-btn" onClick={() => setConfirmTarget(s)} aria-label={`Delete ${s.title}`}><Trash2 size={14} /></button>
    </div>;
  };

  return <div className="card form-card admin-block">
    <p className="eyebrow">ADD A SERVICE</p>
    <label className="field"><span>Where should this be added?</span>
      <select className="admin-select" style={{ width: "100%" }} value={section} onChange={e => { setSection(e.target.value); if (e.target.value === "eventTypes" && appearance === "photo") { setAppearance("customIcon"); setImagePreview(""); } }}>
        <option value="cards">Service Cards (the main grid, with title + description)</option>
        <option value="eventTypes">"All Types of Events" list (the side card, name only)</option>
      </select>
    </label>
    <div className="two-col">
      <Field label="Title" icon={<Sparkles />} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Product Launches" />
      <label className="field"><span>Appearance</span>
        <select className="admin-select" style={{ width: "100%" }} value={appearance} onChange={e => { setAppearance(e.target.value); setImagePreview(""); }}>
          <option value="icon">Icon (choose from list)</option>
          <option value="customIcon">Custom Icon (upload your own)</option>
          {section === "cards" && <option value="photo">Photo (full image on the card)</option>}
          <option value="none">No icon</option>
        </select>
      </label>
    </div>
    {appearance === "icon" && <label className="field"><span>Icon</span>
      <select className="admin-select" style={{ width: "100%" }} value={iconName} onChange={e => setIconName(e.target.value)}>
        {Object.keys(SERVICE_ICON_OPTIONS).map(name => <option key={name} value={name}>{name}</option>)}
      </select>
    </label>}
    {appearance === "customIcon" && <div className="admin-two" style={{ alignItems: "flex-start", marginTop: 18 }}>
      <div className="admin-upload-box" style={{ width: 70, height: 70, minHeight: 0 }}>{imagePreview ? <img src={imagePreview} alt="Preview" /> : <ImageIcon size={20} />}</div>
      <label className="button outline" style={{ display: "inline-flex", cursor: "pointer" }}>
        <ImageIcon size={14} /> UPLOAD ICON
        <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
      </label>
    </div>}
    {section === "cards" && appearance === "photo" && <div className="admin-two" style={{ alignItems: "flex-start", marginTop: 18 }}>
      <div className="admin-upload-box" style={{ width: 140 }}>{imagePreview ? <img src={imagePreview} alt="Preview" /> : <ImageIcon size={22} />}</div>
      <label className="button outline" style={{ display: "inline-flex", cursor: "pointer" }}>
        <ImageIcon size={14} /> CHOOSE AN IMAGE
        <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
      </label>
    </div>}
    {section === "cards" && <label className="field"><span>Description</span><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description shown under the title..." /></label>}
    {status && <p className="status">{status}</p>}
    <div style={{ marginTop: 6 }}><button type="button" className={goldButton} onClick={submit}><Plus size={14} /> SUBMIT</button></div>

    <p className="eyebrow" style={{ marginTop: 30 }}>SERVICE CARDS ({Array.isArray(cards) ? cards.length : 0})</p>
    <div className="admin-userlist">{Array.isArray(cards) && cards.map(renderRow)}</div>

    <p className="eyebrow" style={{ marginTop: 30 }}>ALL TYPES OF EVENTS ({Array.isArray(eventTypes) ? eventTypes.length : 0})</p>
    <div className="admin-userlist">{Array.isArray(eventTypes) && eventTypes.map(renderRow)}</div>

    {confirmTarget && <ConfirmModal title="Remove this service?" message={`Are you sure you want to remove "${confirmTarget.title}"? This action cannot be undone.`} confirmLabel="REMOVE SERVICE" onConfirm={confirmDelete} onCancel={() => setConfirmTarget(null)} />}
  </div>;
}