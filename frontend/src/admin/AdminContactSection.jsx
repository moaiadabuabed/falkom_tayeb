import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { api } from "../services/api.js";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminContactSection() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchMessages = async () => {
    try {
      const data = await api.adminGetContactMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = !q ? messages : messages.filter(m => [m.name, m.email, m.phone, m.eventType].join(" ").toLowerCase().includes(q));

  const confirmDelete = async () => {
    if (confirmTarget) {
      try {
        await api.adminDeleteContactMessage(confirmTarget.id);
        setMessages(messages.filter(m => m.id !== confirmTarget.id));
      } catch (err) {
        alert(err.message || "Failed to delete message");
      }
    }
    setConfirmTarget(null);
  };

  return (
    <div className="card form-card admin-block">
      <div className="admin-block-head">
        <p className="eyebrow" style={{ margin: 0 }}>{filtered.length} MESSAGE{filtered.length === 1 ? "" : "S"}</p>
        <div className="admin-search">
          <Search size={14} />
          <input placeholder="Search messages..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="admin-userlist">
        {loading ? (
          <p className="admin-empty">Loading messages...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-empty">No contact requests yet. They'll show up here as soon as someone submits the Contact Us form.</p>
        ) : (
          filtered.map(m => (
            <div className="admin-user-row" key={m.id} style={{ alignItems: "flex-start" }}>
              <span className="user-avatar">{(m.name || "?").trim().charAt(0).toUpperCase()}</span>
              <div className="admin-user-info">
                <strong>{m.name || "Guest"}</strong>
                <small>{m.email || "No email"} {m.phone ? `· ${m.phone}` : ""}</small>
                {m.eventType && <small>Event type: {m.eventType}</small>}
                {m.message && <p style={{ fontSize: 11, color: "#ccc", margin: "6px 0 0" }}>{m.message}</p>}
              </div>
              <button type="button" className="icon-btn" onClick={() => setConfirmTarget(m)} aria-label={`Delete message from ${m.name}`}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      {confirmTarget && (
        <ConfirmModal 
          title="Delete this message?" 
          message={`Are you sure you want to delete the message from ${confirmTarget.name || "this guest"}? This action cannot be undone.`} 
          confirmLabel="DELETE MESSAGE" 
          onConfirm={confirmDelete} 
          onCancel={() => setConfirmTarget(null)} 
        />
      )}
    </div>
  );
}