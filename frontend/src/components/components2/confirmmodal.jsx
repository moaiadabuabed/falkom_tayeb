import React from 'react';
import { Calendar, Tag, Package as PackageIcon, MapPin, AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
function ConfirmModal({ title, message, confirmLabel = "CONFIRM", onConfirm, onCancel }) {
  return <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <AlertTriangle size={30} color="#e0b23f" />
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <button type="button" className={outlineButton} onClick={onCancel}>CANCEL</button>
        <button type="button" className={goldButton} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>;
}