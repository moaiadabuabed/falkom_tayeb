import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import { getAllEvents, deleteEvent } from "../services/store.js";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminRequestsSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAllEvents();
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const q = query.trim().toLowerCase();
  const eventList = Array.isArray(events) ? events : [];
  const filtered = !q ? eventList : eventList.filter(ev => 
    [ev.fullName, ev.eventType, ev.package, ev.eventName].join(" ").toLowerCase().includes(q)
  );

  const confirmDelete = async () => {
    if (confirmTarget) {
      await deleteEvent(confirmTarget.id || confirmTarget._id);
      await loadData();
    }
    setConfirmTarget(null);
  };

  if (loading) {
    return (
      <div className="card form-card admin-block">
        <p className="admin-empty">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="card form-card admin-block">
      <div className="admin-block-head">
        <p className="eyebrow" style={{ margin: 0 }}>
          {filtered.length} REQUEST{filtered.length === 1 ? "" : "S"}
        </p>
        <div className="admin-search">
          <Search size={14} />
          <input 
            placeholder="Search requests..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="admin-table">
        <div className="admin-table-head">
          <span>Full name</span>
          <span>Event type</span>
          <span>Package type</span>
          <span />
        </div>
        
        {filtered.length === 0 ? (
          <p className="admin-empty">No requests yet. They'll show up here as soon as clients submit them.</p>
        ) : (
          filtered.map(ev => (
            <div 
              className="admin-row admin-row-clickable" 
              key={ev.id || ev._id} 
              onClick={() => navigate(`/admin/requests/${ev.id || ev._id}`)}
            >
              <span>{ev.fullName || "Guest"}</span>
              <span>{ev.eventType || "—"}</span>
              <span>
                {ev.package || "—"}{" "}
                <span className={`status-pill ${(ev.status || "pending").toLowerCase()}`}>
                  {ev.status || "Pending"}
                </span>
              </span>
              <button 
                type="button" 
                className="icon-btn" 
                onClick={e => { e.stopPropagation(); setConfirmTarget(ev); }} 
                aria-label="Delete request"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {confirmTarget && (
        <ConfirmModal 
          title="Delete this request?" 
          message={`Are you sure you want to delete the request from ${confirmTarget.fullName || "this guest"}? This action cannot be undone.`} 
          confirmLabel="DELETE REQUEST" 
          onConfirm={confirmDelete} 
          onCancel={() => setConfirmTarget(null)} 
        />
      )}
    </div>
  );
}