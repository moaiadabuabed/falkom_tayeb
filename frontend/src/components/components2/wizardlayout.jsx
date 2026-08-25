import React from 'react';
import { Calendar, Tag, Package as PackageIcon, MapPin, AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
function WizardLayout({ currentStep, children }) {
  return <><StepIndicator currentStep={currentStep} />{children}</>;
}
const steps = ["Event Details", "Event Type", "Packages", "Requirements", "Review & Submit"];
function StepIndicator({ currentStep }) {
  return <div className="steps">
    <div className="step-line" />
    {steps.map((name, index) => {
      const id = index + 1;
      return <div className="step" key={name}>
        <div className={`step-number ${id < currentStep ? "done" : id === currentStep ? "current" : ""}`}>
          {id < currentStep ? <Check size={16} /> : id}
        </div>
        <span className={id === currentStep ? "active" : ""}>{name}</span>
      </div>;
    })}
  </div>;
}