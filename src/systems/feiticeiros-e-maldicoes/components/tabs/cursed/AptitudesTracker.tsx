"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";

interface AptitudesTrackerProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function AptitudesTracker({ data, onChange }: AptitudesTrackerProps) {
  const cp = data.cursedProfile;

  const aptitudesList = [
    { key: "aura", label: "Aura", desc: "Reforço físico e fluxo básico" },
    { key: "control", label: "Controle & Leitura", desc: "Ocultação e percepção de resíduos" },
    { key: "domain", label: "Domínio", desc: "Domínio simples e expansões" },
    { key: "barrier", label: "Barreiras", desc: "Cortinas e paredes defensivas" },
    { key: "rct", label: "Energia Reversa (RCT)", desc: "Cura corporal e regeneração" },
    { key: "special", label: "Especial", desc: "Técnicas de linhagem e rituais" },
  ] as const;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
        Níveis de Aptidão Amaldiçoada (0 a 5)
      </h3>
      <p className="text-xs text-[var(--text-muted)] mb-4">
        Conforme você sobe de nível, adquire aptidões em diferentes ramos do jujutsu.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {aptitudesList.map((apt) => {
          const currentLevel = cp.aptitudes[apt.key] || 0;
          return (
            <div
              key={apt.key}
              className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[var(--text-primary)]">
                  {apt.label}
                </span>
                <span className="text-xs font-bold text-blue-400">
                  Nível {currentLevel}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">{apt.desc}</p>
              <div className="flex gap-1.5 pt-1">
                {[0, 1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      onChange((prev) => ({
                        ...prev,
                        cursedProfile: {
                          ...prev.cursedProfile,
                          aptitudes: {
                            ...prev.cursedProfile.aptitudes,
                            [apt.key]: lvl,
                          },
                        },
                      }));
                    }}
                    className={`flex-1 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      currentLevel === lvl
                        ? "bg-blue-600 text-white shadow-xs"
                        : currentLevel > lvl
                        ? "bg-blue-950/70 text-blue-300 border border-blue-800"
                        : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
