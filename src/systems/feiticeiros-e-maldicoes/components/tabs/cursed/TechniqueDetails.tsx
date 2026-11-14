"use client";

import {
  FMCharacterData,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  AttributeKey,
  getModifier,
  getProficiencyBonus,
} from "@/systems/feiticeiros-e-maldicoes";
import { Sparkles } from "lucide-react";

interface TechniqueDetailsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function TechniqueDetails({ data, onChange }: TechniqueDetailsProps) {
  const prof = getProficiencyBonus(data.level);
  const cp = data.cursedProfile;

  const techAttr = (cp.techniqueAttribute || "INT") as AttributeKey;
  const techAttrMod = getModifier(data.attributes[techAttr] ?? 10);
  const calcDC = 8 + prof + techAttrMod;
  const calcAttack = prof + techAttrMod;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold">Técnica Amaldiçoada & Atributos Mágicos</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Nome da Técnica
          </label>
          <input
            type="text"
            placeholder="Ex: Proporções (7:3), Ilimitado, Manipulação de Maldições..."
            value={cp.techniqueName}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: { ...prev.cursedProfile, techniqueName: val },
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Atributo da Técnica
          </label>
          <select
            value={cp.techniqueAttribute}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: { ...prev.cursedProfile, techniqueAttribute: val },
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          >
            {ATTRIBUTE_KEYS.map((k) => (
              <option key={k} value={k}>
                {ATTRIBUTE_LABELS[k]} ({k})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Perícia da Técnica
          </label>
          <input
            type="text"
            placeholder="Ex: Feitiçaria, Ocultismo"
            value={cp.techniqueSkill}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: { ...prev.cursedProfile, techniqueSkill: val },
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
          />
        </div>
      </div>

      {/* Cards de CD e Ataque Mágico */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-4">
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
            CD de Resistência
          </p>
          <p className="text-2xl font-bold text-blue-400">{calcDC}</p>
          <p className="text-[10px] text-[var(--text-muted)]">
            8 + Maestria (+{prof}) + Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod})
          </p>
        </div>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
            Acerto de Feitiço
          </p>
          <p className="text-2xl font-bold text-green-400">
            {calcAttack >= 0 ? `+${calcAttack}` : calcAttack}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">
            1d20 + Maestria (+{prof}) + Mod ({techAttrMod >= 0 ? `+${techAttrMod}` : techAttrMod})
          </p>
        </div>

        <div className="text-center col-span-2">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Funcionamento Básico
          </p>
          <p className="text-xs text-[var(--text-secondary)] italic">
            Todo feiticeiro inicia com sua técnica e o funcionamento básico acordado com o Mestre.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Descrição e Regras da Técnica
        </label>
        <textarea
          rows={3}
          placeholder="Descreva as características inatas, condições e restrições da sua técnica..."
          value={cp.techniqueDesc}
          onChange={(e) => {
            const val = e.target.value;
            onChange((prev) => ({
              ...prev,
              cursedProfile: { ...prev.cursedProfile, techniqueDesc: val },
            }));
          }}
          className="w-full text-xs p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>
    </div>
  );
}
