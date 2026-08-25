import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Star, X } from "lucide-react";
import { getAllEvents, updateEvent } from "../services/store.js";
import { goldButton, outlineButton } from "../data/constants.js";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const safeEvents = Array.isArray(events) ? events : [];
  const event = safeEvents.find((ev) => 
    String(ev.id || ev._id || ev.eventId) === String(id)
  );

  useEffect(() => { 
    if (event) setRemarks(event.adminRemarks || ""); 
  }, [event]);

  if (loading) {
    return (
      <section className="page flex-center" style={{ minHeight: "50vh" }}>
        <p className="intro">Loading request details...</p>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="page">
        <button type="button" className="back-btn" onClick={() => navigate("/admin")}>
          <ArrowLeft size={14} /> Back to admin panel
        </button>
        <p className="intro">This request could not be found. It may have already been removed.</p>
      </section>
    );
  }

  const applyDecision = async (status) => { 
    try {
      await updateEvent(event.id || event._id, { status, adminRemarks: remarks }); 
      await fetchEvents();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setConfirmAction(null); 
    }
  };

  const saveRemarks = async () => {
    try {
      await updateEvent(event.id || event._id, { status: event.status, adminRemarks: remarks });
      await fetchEvents();
    } catch (err) {
      console.error("Failed to save remarks:", err);
    }
  };

  return (
    <section className="page request-detail">
      <button type="button" className="back-btn" onClick={() => navigate("/admin")}>
        <ArrowLeft size={14} /> Back to requests
      </button>
      <div className="card form-card">
        <div className="admin-block-head">
          <p className="eyebrow" style={{ margin: 0 }}>REQUEST DETAILS</p>
          <span className={`status-pill ${(event.status || "pending").toLowerCase()}`}>
            {event.status || "Pending"}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item"><small>FULL NAME</small><span>{event.fullName || "Guest"}</span></div>
          <div className="detail-item"><small>EMAIL ADDRESS</small><span>{event.email || "Not provided"}</span></div>
          <div className="detail-item"><small>PHONE NUMBER</small><span>{event.phone || "Not provided"}</span></div>
          <div className="detail-item"><small>EVENT NAME</small><span>{event.eventName || "Not provided"}</span></div>
          <div className="detail-item"><small>EVENT TYPE</small><span>{event.eventType || "Not provided"}</span></div>
          <div className="detail-item"><small>PACKAGE TYPE</small><span>{event.package || "Not provided"}</span></div>
          <div className="detail-item"><small>EVENT DATE</small><span>{event.eventDate || "Not provided"}</span></div>
          <div className="detail-item"><small>VENUE / LOCATION</small><span>{event.location || "Not provided"}</span></div>
          <div className="detail-item"><small>EXPECTED GUESTS</small><span>{event.guestCount || "Not provided"}</span></div>
          <div className="detail-item"><small>SUBMITTED</small><span>{event.submittedAt ? new Date(event.submittedAt).toLocaleString() : "—"}</span></div>
        </div>

        {event.packageItems && typeof event.packageItems === "object" && Object.keys(event.packageItems).length > 0 && (
          <>
            <p className="eyebrow" style={{ marginTop: 24 }}>PACKAGE ITEMS</p>
            <div className="req-list">
              {Object.entries(event.packageItems).map(([k, v]) => (
                <div className="req-item" key={k}>
                  <Star size={13} />
                  <span style={{ flex: 1 }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {event.eventDescription && (
          <>
            <p className="eyebrow" style={{ marginTop: 24 }}>EVENT DETAILS</p>
            <p className="intro" style={{ marginBottom: 8 }}>{event.eventDescription}</p>
          </>
        )}

        <p className="eyebrow" style={{ marginTop: 24 }}>SPECIAL REQUEST</p>
        <p className="intro" style={{ marginBottom: 8 }}>{event.specialRequest || "No special requests submitted."}</p>

        {event.files && Array.isArray(event.files) && event.files.length > 0 && (
          <>
            <p className="eyebrow">FILES</p>
            <p className="intro" style={{ marginBottom: 8 }}>{event.files.join(", ")}</p>
          </>
        )}

        <label className="field">
          <span>Admin Remarks (internal only)</span>
          <textarea 
            value={remarks} 
            onChange={(e) => setRemarks(e.target.value)} 
            placeholder="Internal notes about this request..." 
          />
        </label>
        
        <div className="actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className={outlineButton} onClick={saveRemarks}>
            SAVE REMARKS
          </button>
        </div>

        <div className="detail-actions">
          <button type="button" className={outlineButton} onClick={() => setConfirmAction("Rejected")}>
            <X size={14} /> REJECT
          </button>
          <button type="button" className={goldButton} onClick={() => setConfirmAction("Accepted")}>
            <Check size={14} /> ACCEPT
          </button>
        </div>
      </div>

      {confirmAction && (
        <ConfirmModal
          title={confirmAction === "Accepted" ? "Accept this request?" : "Reject this request?"}
          message={
            confirmAction === "Accepted" 
              ? "This will mark the request as accepted so your team can start planning it." 
              : "This will mark the request as rejected. You can still reach out to the client separately."
          }
          confirmLabel={confirmAction === "Accepted" ? "YES, ACCEPT" : "YES, REJECT"}
          onConfirm={() => applyDecision(confirmAction)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </section>
  );
}