import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Actions } from "../components/eventwizard.jsx";

export default function Requirements() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);

  const handleNext = () => {
    localStorage.setItem("requirements", JSON.stringify({ notes, files: files.map((f) => f.name) }));
    navigate("/review");
  };

  return (
    <section className="page">
      <h1 className="page-title">REQUIREMENTS</h1>
      <p className="intro">Share any additional requirements, ideas, or reference files.</p>
      <div className="card form-card">
        <p className="eyebrow">③ ADDITIONAL REQUIREMENTS</p>
        <label className="field">
          <span>Special Notes</span>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Tell us anything else we should know..." 
          />
        </label>
        <label className="upload">
          <span>Reference files (optional)</span>
          <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
          {files.length > 0 && <small>{files.length} file(s) selected</small>}
        </label>
        <Actions 
          previous={() => navigate("/packages")} 
          next="NEXT STEP →" 
          onNext={handleNext} 
        />
      </div>
    </section>
  );
}