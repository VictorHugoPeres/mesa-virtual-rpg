"use client";

import { useMemo } from "react";
import { Specialization, Origin, SKILLS_LIST, SkillDef } from "@/systems/feiticeiros-e-maldicoes";
import { Check, Award } from "lucide-react";

interface StepSkillsProps {
  specialization: Specialization;
  origin: Origin;
  trainedSkills: string[];
  setTrainedSkills: (skills: string[]) => void;
}

export function StepSkills({
  specialization,
  origin,
  trainedSkills,
  setTrainedSkills,
}: StepSkillsProps) {
  const maxSkillsCount = useMemo(() => {
    let base = 5;
    if (specialization === "Especialista em Combate") base = 7;
    if (specialization === "Suporte" || specialization === "Restringido") base = 6;
    if (origin === "Sem Técnica") base += 2;
    return base;
  }, [specialization, origin]);

  const defaultSpecSkills = useMemo(() => {
    switch (specialization) {
      case "Lutador":
        return ["Fortitude", "Atletismo", "Luta"];
      case "Especialista em Combate":
        return ["Reflexos", "Atletismo", "Luta", "Pontaria"];
      case "Especialista em Técnica":
        return ["Astúcia", "Feitiçaria", "Ocultismo"];
      case "Controlador":
        return ["Vontade", "Percepção", "Persuasão"];
      case "Suporte":
        return ["Vontade", "Medicina", "Prestidigitação"];
      case "Restringido":
        return ["Fortitude", "Reflexos", "Atletismo", "Percepção"];
      default:
        return ["Fortitude", "Atletismo"];
    }
  }, [specialization]);

  const remainingPicks = maxSkillsCount - trainedSkills.length;

  function toggleSkill(skillName: string) {
    if (specialization === "Restringido" && skillName === "Feitiçaria") return;

    if (trainedSkills.includes(skillName)) {
      setTrainedSkills(trainedSkills.filter((s) => s !== skillName));
    } else {
      if (remainingPicks > 0) {
        setTrainedSkills([...trainedSkills, skillName]);
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Passo 4: Perícias Treinadas</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Selecione as perícias em que seu personagem é treinado (recebe +2 de Maestria).
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] block">Escolhas Restantes</span>
          <span
            className={`text-sm font-bold px-2.5 py-0.5 rounded-full inline-block ${
              remainingPicks === 0
                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                : remainingPicks < 0
                ? "bg-red-950 text-red-300 border border-red-800"
                : "bg-blue-950 text-blue-300 border border-blue-800"
            }`}
          >
            {trainedSkills.length} / {maxSkillsCount} selecionadas
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-blue-200">
            Sugeridas para <strong>{specialization}</strong>: {defaultSpecSkills.join(", ")}.
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const combined = Array.from(new Set([...defaultSpecSkills])).slice(0, maxSkillsCount);
            setTrainedSkills(combined);
          }}
          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
        >
          Aplicar Sugeridas
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {SKILLS_LIST.map((skill: SkillDef) => {
          const isTrained = trainedSkills.includes(skill.name);
          const isSuggested = defaultSpecSkills.includes(skill.name);
          const isRestringidoDisabled = specialization === "Restringido" && skill.name === "Feitiçaria";

          return (
            <button
              key={skill.name}
              type="button"
              disabled={isRestringidoDisabled || (!isTrained && remainingPicks <= 0)}
              onClick={() => toggleSkill(skill.name)}
              className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isTrained
                  ? "bg-blue-950/60 border-blue-500 text-white font-semibold shadow-xs"
                  : isSuggested
                  ? "bg-[var(--bg-secondary)] border-blue-800/50 text-[var(--text-primary)] hover:border-blue-400"
                  : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-gray-500"
              }`}
            >
              <div className="truncate mr-1">
                <span className="block truncate">{skill.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal">{skill.attribute}</span>
              </div>

              {isTrained ? (
                <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded border border-[var(--border-default)] shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
