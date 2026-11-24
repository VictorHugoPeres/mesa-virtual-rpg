"use client";

import { Check } from "lucide-react";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const STEP_LABELS = [
  "1. Origem",
  "2. Especialização",
  "3. Atributos",
  "4. Perícias",
  "5. Técnica",
  "6. Equipamentos",
  "7. Revisão Final",
];

export function WizardProgressBar({
  currentStep,
  totalSteps,
  onStepClick,
}: WizardProgressBarProps) {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full space-y-2 border-b border-[#23272F] pb-4 px-6 pt-2 bg-[#0B0C0E]/40">
      {/* Barra de Progresso Superior */}
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-1">
        <span>Etapa {currentStep} de {totalSteps} — {STEP_LABELS[currentStep - 1]}</span>
        <span className="text-rose-400 font-bold">{progressPercent}%</span>
      </div>

      <div className="w-full h-1.5 bg-[#14161A] rounded-full overflow-hidden border border-[#23272F]">
        <div
          className="h-full bg-rose-600 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Breadcrumb / Chips clicáveis */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs scrollbar-none">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={label}
              type="button"
              disabled={stepNum > currentStep}
              onClick={() => onStepClick(stepNum)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed ${
                isCurrent
                  ? "bg-rose-600 text-white shadow-sm font-semibold"
                  : isDone
                  ? "bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20"
                  : "bg-[#14161A] text-zinc-500 border border-[#23272F] opacity-60"
              }`}
            >
              {isDone ? <Check className="w-3 h-3 text-rose-400" /> : null}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
