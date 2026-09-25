import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Date' },
  { id: 2, name: 'District' },
  { id: 3, name: 'Place' },
  { id: 4, name: 'Time' },
  { id: 5, name: 'Details' },
  { id: 6, name: 'Summary' },
  { id: 7, name: 'Payment' },
];

export default function StepProgress({ currentStep, setStep, isStepValid }) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-12 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2 z-0" />

        {/* Active Line Progress */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-[#5B49AD] -translate-y-1/2 z-0 transition-all duration-500 shadow-[0_0_12px_#5B49AD]"
          style={{
            width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const canClick = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <button
                type="button"
                disabled={!canClick && !isCurrent}
                onClick={() => canClick && setStep(step.id)}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-500 ${
                  isCompleted
                    ? 'bg-[#5B49AD] text-white shadow-[0_0_15px_rgba(91,73,173,0.6)] cursor-pointer hover:scale-110'
                    : isCurrent
                    ? 'bg-[#5B49AD] text-white border-2 border-white/40 shadow-[0_0_20px_rgba(91,73,173,0.8)] scale-110'
                    : 'bg-black/80 border border-white/20 text-[#A1A1AA]/50 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
              </button>

              <span
                className={`mt-2 text-[9px] md:text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 hidden sm:block ${
                  isCurrent ? 'text-white font-extrabold' : isCompleted ? 'text-[#5B49AD]' : 'text-[#A1A1AA]/40'
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
