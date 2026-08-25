import React from 'react';
import { Calendar, Tag, Package as PackageIcon, MapPin, AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
function Field({ label, icon, ...props }) {
  return <label className="field"><span>{label}</span><div className="input-wrap">{React.cloneElement(icon, { size: 16 })}<input {...props} /></div></label>;
}
function Actions({ previous, next, onNext }) {
  return <div className="actions" style={!previous ? { justifyContent: "flex-end" } : undefined}>
    {previous && <button type="button" className={outlineButton} onClick={previous}><ArrowLeft size={14} /> PREVIOUS STEP</button>}
    <button type={onNext ? "button" : "submit"} className={goldButton} onClick={onNext}>{next} <ArrowRight size={14} /></button>
  </div>;
}