import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Package as PackageIcon, Tag } from "lucide-react";
import { apiRequest, isOffline } from "../services/api.js";
import { saveMyEvent, upsertUser, clearWizardData, useAuth } from "../services/store.js";
import { InfoCard } from "../components/eventwizard.jsx";
import { goldButton, outlineButton } from "../data/constants.js";

export default function ReviewSubmit() {
  const navigate = useNavigate();
  const user = useAuth();
  
  const details = JSON.parse(localStorage.getItem("eventDetails") || "{}");
  const type = localStorage.getItem("eventType") || "Corporate Events";
  const pkg = JSON.parse(localStorage.getItem("package") || '{"selected":"GOLD"}');
  const requirements = JSON.parse(localStorage.getItem("requirements") || "{}");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!details.eventName) {
      navigate("/event-details", { replace: true });
    }
  }, [details.eventName, navigate]);

  if (!details.eventName) return null;

  const submit = async () => {
    setStatus("Sending...");
    const payload = {
      ...details,
      eventType: type,
      package: pkg.selected,
      packageItems: pkg.quantities || {},
      specialRequest: [details.specialRequest, requirements.notes].filter(Boolean).join("\n\n"),
      files: [...(details.attachments || []), ...(requirements.files || [])],
      fullName: details.fullName || (user && user.username) || "Guest",
      email: (user && user.email) || "",
    };

    try {
      await apiRequest("/events/request-event", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      saveMyEvent({ ...payload, status: "Pending" });
      upsertUser({ username: payload.fullName, email: payload.email, package: payload.package });
      clearWizardData();
      setStatus("Your request was submitted successfully.");
    } catch (err) {
      if (isOffline(err)) {
        saveMyEvent({ ...payload, status: "Pending" });
        upsertUser({ username: payload.fullName, email: payload.email, package: payload.package });
        clearWizardData();
        setStatus("The request was saved locally. Connect your backend to submit it online.");
      } else {
        setStatus(err.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="page">
      <h1 className="page-title">REVIEW & SUBMIT</h1>
      <p className="intro">Please review all the details of your event request before submitting.</p>
      <div className="card review">
        <p className="eyebrow">REVIEW YOUR EVENT REQUEST</p>
        <div className="review-grid">
          <InfoCard icon={<Calendar />} title="EVENT DETAILS">
            <p><i>Full Name:</i> {details.fullName || "Not provided"}</p>
            <p><i>Event Name:</i> {details.eventName || "Not provided"}</p>
            <p><i>Event Date:</i> {details.eventDate || "Not provided"}</p>
            <p><i>Location:</i> {details.location || "Not provided"}</p>
            <p><i>Guests:</i> {details.guestCount || "Not provided"}</p>
            <p><i>Phone:</i> {details.phone || "Not provided"}</p>
            {details.eventDescription && <p><i>Details:</i> {details.eventDescription}</p>}
            {(details.attachments || []).length > 0 && <p><i>Attachments:</i> {details.attachments.length} file(s)</p>}
          </InfoCard>
          <div>
            <InfoCard icon={<Tag />} title="EVENT TYPE">
              <strong>{type}</strong>
            </InfoCard>
            <InfoCard icon={<PackageIcon />} title="PACKAGE SELECTION">
              <strong>{pkg.selected || "GOLD"}</strong>
            </InfoCard>
          </div>
        </div>
        <div className="ready">
          <p className="eyebrow">READY TO SUBMIT?</p>
          {status && <p className="status">{status}</p>}
          <button type="button" className={outlineButton} onClick={() => navigate("/requirements")}>
            <ArrowLeft size={14} /> BACK & EDIT
          </button>
          <button type="button" className={goldButton} onClick={submit}>
            SUBMIT EVENT REQUEST
          </button>
        </div>
      </div>
    </section>
  );
}