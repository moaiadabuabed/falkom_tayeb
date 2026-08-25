import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sliders, Check, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react';

const packagesList = [
  ["SILVER", "Essential setup for memorable events", ["Basic Stage Setup", "Standard Seating", "Basic Lighting", "Sound System", "Event Coordination"]],
  ["GOLD", "Enhanced experience for your special event", ["Premium Stage Setup", "Comfort Seating", "Advanced Lighting", "Professional Sound", "Event Coordination", "Basic Decorations"]],
  ["DIAMOND", "Complete luxury experience for your event", ["Luxury Stage Setup", "Premium Seating", "Advanced Lighting", "High-End Sound System", "Event Coordination", "Premium Decorations", "VIP Services"]],
];

export default function PackageSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("GOLD");
  const initial = { Stage: 1, Chairs: 100, Tables: 10, "LED Screens": 1, Lighting: 1, "Sound System": 1, Photography: 1, Videography: 1, Decorations: 1 };
  const [quantities, setQuantities] = useState(initial);
  const [newItem, setNewItem] = useState("");

  const update = (key, amount) => setQuantities(q => ({ ...q, [key]: Math.max(0, q[key] + amount) }));
  const setQuantity = (key, value) => setQuantities(q => ({ ...q, [key]: Math.max(0, Number(value) || 0) }));
  
  const addItem = () => {
    const cleanName = newItem.trim();
    if (!cleanName || Object.prototype.hasOwnProperty.call(quantities, cleanName)) return;
    setQuantities(q => ({ ...q, [cleanName]: 1 }));
    setNewItem("");
  };

  return (
    <section className="page max-w-5xl mx-auto p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold text-amber-400">PACKAGE SELECTION</h1>
      <p className="text-xs text-gray-300">Choose a package that suits your event or select Customize to build your own.</p>
      
      <div className="bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40">
        <p className="text-xs font-bold text-amber-300 mb-4">① CHOOSE A PACKAGE OR CUSTOMIZE</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {packagesList.map(([id, desc, features]) => (
            <button 
              className={`p-4 rounded-xl border text-right transition flex flex-col justify-between ${selected === id ? "border-amber-400 bg-amber-500/10" : "border-amber-900/40 bg-black/40"}`} 
              key={id} 
              onClick={() => setSelected(id)}
            >
              <div>
                <Crown className="text-amber-400 w-6 h-6 mb-2" />
                <h3 className="text-amber-200 font-bold text-sm mb-1">{id}</h3>
                <p className="text-[11px] text-gray-400 mb-3">{desc}</p>
                <div className="space-y-1">
                  {features.map(f => (
                    <small key={f} className="flex items-center gap-1 text-[10px] text-gray-300">
                      <Check className="w-3 h-3 text-amber-400 shrink-0" /> {f}
                    </small>
                  ))}
                </div>
              </div>
            </button>
          ))}
          <button 
            className={`p-4 rounded-xl border text-right transition flex flex-col justify-between ${selected === "CUSTOM" ? "border-amber-400 bg-amber-500/10" : "border-amber-900/40 bg-black/40"}`} 
            onClick={() => setSelected("CUSTOM")}
          >
            <div>
              <Sliders className="text-amber-400 w-6 h-6 mb-2" />
              <h3 className="text-amber-200 font-bold text-sm mb-1">CUSTOMIZE</h3>
              <p className="text-[11px] text-gray-400 mb-2">Build your own custom setup tailored precisely to your requirements.</p>
            </div>
            <small className="text-[10px] text-amber-400/80">Select to unlock items below</small>
          </button>
        </div>
      </div>

      <div className={`bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 transition ${selected !== "CUSTOM" ? "opacity-50 pointer-events-none" : ""}`}>
        <p className="text-xs font-bold text-amber-300 mb-4">② CUSTOMIZE YOUR EVENT ITEMS</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(quantities).map(([key, value]) => (
            <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-amber-900/30" key={key}>
              <span className="text-xs text-gray-200">{key}</span>
              <div className="flex items-center gap-2">
                <button className="bg-amber-500/20 text-amber-300 p-1 rounded" disabled={selected !== "CUSTOM"} onClick={() => update(key, -1)}><Minus size={12} /></button>
                <input className="w-12 text-center bg-black border border-amber-900/40 rounded text-xs text-white" type="number" min="0" value={value} disabled={selected !== "CUSTOM"} onChange={e => setQuantity(key, e.target.value)} />
                <button className="bg-amber-500/20 text-amber-300 p-1 rounded" disabled={selected !== "CUSTOM"} onClick={() => update(key, 1)}><Plus size={12} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input className="flex-1 bg-black border border-amber-900/40 p-2 rounded text-xs text-white" value={newItem} disabled={selected !== "CUSTOM"} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} placeholder="Add another item, tool, or service..." />
          <button className="bg-amber-500 text-black px-4 py-2 rounded text-xs font-bold flex items-center gap-1" disabled={selected !== "CUSTOM"} onClick={addItem}><Plus size={14} /> ADD</button>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="border border-amber-900/60 text-gray-300 px-4 py-2 rounded text-xs flex items-center gap-1" onClick={() => navigate("/event-type")}><ArrowLeft size={14} /> PREVIOUS</button>
        <button className="bg-amber-500 text-black px-6 py-2 rounded text-xs font-bold flex items-center gap-1" onClick={() => { localStorage.setItem("package", JSON.stringify({ selected, quantities })); navigate("/requirements"); }}>NEXT STEP <ArrowRight size={14} /></button>
      </div>
    </section>
  );
}