import React from "react";
import { Check } from "lucide-react";
import { steps } from "../data/constants.js";

export default function StepIndicator({ currentStep }) {
  return (
    <div className="steps">
      <div className="step-line" />
      {steps.map((name, index) => {
        const id = index + 1;
        return (
          <div className="step" key={name}>
            <div className={`step-number ${id < currentStep ? "done" : id === currentStep ? "current" : ""}`}>
              {id < currentStep ? <Check size={16} /> : id}
            </div>
            <span className={id === currentStep ? "active" : ""}>{name}</span>
          </div>
        );
      })}
    </div>
  );
}

export function WizardLayout({ currentStep, children }) {
  return (
    <>
      <StepIndicator currentStep={currentStep} />
      {children}
    </>
  );
}