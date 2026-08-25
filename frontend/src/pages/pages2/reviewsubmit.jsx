import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Tag, Package as PackageIcon, ArrowLeft } from 'lucide-react';

export default function ReviewSubmit() {
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  const details = JSON.parse(localStorage.getItem("eventDetails") || "{}"); 
  const type = localStorage.getItem("eventType") || "Corporate Events"; 
  const pkg = JSON.parse(localStorage.getItem("package") || '{"selected":"GOLD"}'); 
  const requirements = JSON.parse(localStorage.getItem("requirements") || "{}"); 
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!details.eventName) navigate("/event-details", { replace: true });
  }, [details.eventName, navigate]);

  if (!details.eventName) return null;

  const submit = async () => {
    setStatus("Sending...");
    const payload = {
      user_id: user?.USER_ID || user?.id,
      event_name: details.eventName,
      event_date: details.eventDate,
      location_name: details.location,
      guest_count: details.guestCount,
      phone: details.phone,
      eventType: type,
      package: pkg.selected,
      special_requirements: [details.specialRequest, requirements.notes].filter(Boolean).join("\n\n"),
      full_name: details.fullName || user?.USERNAME || user?.username || "Guest",
      email: user?.EMAIL || user?.email || details.email,
    };

    try {
      await API.post("/events/request", payload);
      localStorage.removeItem("eventDetails");
      localStorage.removeItem("package");
      localStorage.removeItem("requirements");
      setStatus("Your request was submitted successfully.");
    } catch (err) {
      setStatus(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="page max-w-2xl mx-auto p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">REVIEW & SUBMIT</h1>
      <p className="text-xs text-gray-300">Please review all the details of your event request before submitting.</p>

      <div className="bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 space-y-6">
        <p className="text-xs font-bold text-amber-300">REVIEW YOUR EVENT REQUEST</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-black/40 p-4 rounded border border-amber-900/30">
            <h3 className="text-amber-400 font-bold flex items-center gap-1 mb-2"><Calendar size={14} /> EVENT DETAILS</h3>
            <p><span className="text-gray-400">Full Name:</span> {details.fullName || "Not provided"}</p>
            <p><span className="text-gray-400">Event Name:</span> {details.eventName || "Not provided"}</p>
            <p><span className="text-gray-400">Event Date:</span> {details.eventDate || "Not provided"}</p>
            <p><span className="text-gray-400">Location:</span> {details.location || "Not provided"}</p>
            <p><span className="text-gray-400">Phone:</span> {details.phone || "Not provided"}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded border border-amber-900/30">
              <h3 className="text-amber-400 font-bold flex items-center gap-1 mb-1"><Tag size={14} /> EVENT TYPE</h3>
              <p className="text-amber-200 font-bold">{type}</p>
            </div>
            <div className="bg-black/40 p-4 rounded border border-amber-900/30">
              <h3 className="text-amber-400 font-bold flex items-center gap-1 mb-1"><PackageIcon size={14} /> PACKAGE SELECTION</h3>
              <p className="text-amber-200 font-bold">{pkg.selected || "GOLD"}</p>
            </div>
          </div>
        </div>

        {status && <p className="text-xs text-amber-400 font-bold text-center bg-amber-500/10 p-2 rounded border border-amber-500/30">{status}</p>}

        <div className="flex justify-between items-center pt-4">
          <button className="border border-amber-900/60 text-gray-300 px-4 py-2 rounded text-xs flex items-center gap-1" onClick={() => navigate("/requirements")}>
            <ArrowLeft size={14} /> BACK & EDIT
          </button>
          <button className="bg-amber-500 text-black px-6 py-2 rounded text-xs font-bold" onClick={submit}>
            SUBMIT EVENT REQUEST
          </button>
        </div>
      </div>
    </section>
  );
}