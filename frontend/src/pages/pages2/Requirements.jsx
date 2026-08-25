import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Requirements() {
  const navigate = useNavigate(); 
  const [notes, setNotes] = useState(""); 
  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    localStorage.setItem("requirements", JSON.stringify({ 
      notes, 
      files: Array.from(files).map(f => f.name) 
    })); 
    navigate("/review");
  };

  return (
    <section className="page max-w-xl mx-auto p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold text-amber-400">REQUIREMENTS</h1>
      <p className="text-xs text-gray-300">Share any additional requirements, ideas, or reference files.</p>
      
      <div className="bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 space-y-4">
        <p className="text-xs font-bold text-amber-300">③ ADDITIONAL REQUIREMENTS</p>
        
        <div>
          <label className="block text-xs text-gray-400 mb-1">Special Notes</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            placeholder="Tell us anything else we should know..." 
            className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs text-white h-24"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Reference files (optional)</label>
          <input 
            type="file" 
            multiple 
            onChange={e => setFiles(e.target.files)} 
            className="w-full text-xs text-gray-400 bg-black p-2 rounded border border-amber-900/40"
          />
          {files.length > 0 && <small className="text-amber-400 text-[10px] mt-1 block">{files.length} file(s) selected</small>}
        </div>

        <div className="flex justify-between pt-4">
          <button onClick={() => navigate("/packages")} className="border border-amber-900/60 text-gray-300 px-4 py-2 rounded text-xs">PREVIOUS STEP</button>
          <button onClick={handleSubmit} className="bg-amber-500 text-black px-6 py-2 rounded text-xs font-bold">NEXT STEP →</button>
        </div>
      </div>
    </section>
  );
}