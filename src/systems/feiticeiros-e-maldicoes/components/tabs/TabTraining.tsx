"use client";

import { FMCharacterData, TRAININGS_LIST } from "@/systems/feiticeiros-e-maldicoes";
import { Dumbbell, CheckCircle2 } from "lucide-react";

interface TabTrainingProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function TabTraining({ data, onChange }: TabTrainingProps) {
  const trainings = data.trainings || {};

  function toggleStage(
    trainingId: string,
    stage: "stage1" | "stage2" | "stage3" | "stage4"
  ) {
    onChange((prev) => {
      const cur = prev.trainings[trainingId] || {
        stage1: false,
        stage2: false,
        stage3: false,
        stage4: false,
        completed: false,
      };

      const updated = { ...cur, [stage]: !cur[stage] };
      // Se as 4 etapas forem completadas, auto-marca como completed
      if (updated.stage1 && updated.stage2 && updated.stage3 && updated.stage4) {
        updated.completed = true;
      } else {
        updated.completed = false;
      }

      return {
        ...prev,
        trainings: {
          ...prev.trainings,
          [trainingId]: updated,
        },
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
        <h3 className="text-base font-semibold flex items-center gap-2 mb-1">
          <Dumbbell className="w-5 h-5 text-emerald-400" />
          Treinamentos Jujutsu (Interlúdios & Desenvolvimento)
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Realizados durante períodos de descanso ou interlúdios entre missões. Cada treinamento é composto por 4 etapas cumulativas que culminam no Treinamento Completo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRAININGS_LIST.map((t) => {
          const progress = trainings[t.id] || {
            stage1: false,
            stage2: false,
            stage3: false,
            stage4: false,
            completed: false,
          };

          const completedCount = [
            progress.stage1,
            progress.stage2,
            progress.stage3,
            progress.stage4,
          ].filter(Boolean).length;

          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                progress.completed
                  ? "bg-emerald-950/20 border-emerald-800/60 shadow-xs"
                  : "bg-[var(--bg-card)] border-[var(--border-default)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5 text-[var(--text-primary)]">
                    {t.name}
                    {progress.completed && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Progresso: {completedCount} de 4 etapas concluídas
                  </p>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    progress.completed
                      ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-default)]"
                  }`}
                >
                  {progress.completed ? "Completo" : "Em Progresso"}
                </span>
              </div>

              {/* Caixas das 4 etapas */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { key: "stage1", label: "1ª Etapa" },
                  { key: "stage2", label: "2ª Etapa" },
                  { key: "stage3", label: "3ª Etapa" },
                  { key: "stage4", label: "4ª Etapa" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() =>
                      toggleStage(
                        t.id,
                        s.key as "stage1" | "stage2" | "stage3" | "stage4"
                      )
                    }
                    className={`py-1.5 px-1 rounded text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      progress[s.key as "stage1" | "stage2" | "stage3" | "stage4"]
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                        : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-accent)]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Descrição do benefício */}
              <div className="p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-0.5">
                  Benefício do Treinamento Completo:
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {t.benefit}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
