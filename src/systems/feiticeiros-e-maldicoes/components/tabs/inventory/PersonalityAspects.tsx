"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { ShieldCheck } from "lucide-react";

interface PersonalityAspectsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function PersonalityAspects({ data, onChange }: PersonalityAspectsProps) {
  const p = data.personal;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
        Personalidade, Filosofia & Narrativa
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Traços de Personalidade
          </label>
          <textarea
            rows={2}
            placeholder="Como seu personagem pensa, reage e se comporta..."
            value={p.personality}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, personality: val },
              }));
            }}
            className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Ideais
          </label>
          <textarea
            rows={2}
            placeholder="Princípios éticos, dever e metas..."
            value={p.ideals}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, ideals: val },
              }));
            }}
            className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Ligações
          </label>
          <textarea
            rows={2}
            placeholder="Pessoas queridas, laços do passado, objetos importantes..."
            value={p.bonds}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, bonds: val },
              }));
            }}
            className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Complicações & Defeitos
          </label>
          <textarea
            rows={2}
            placeholder="Fraquezas, traumas, hábitos ruins ou obstáculos..."
            value={p.flaws}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, flaws: val },
              }));
            }}
            className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1 flex items-center gap-1.5 text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Domínio Inato (Espaço da Alma)
          </label>
          <textarea
            rows={2}
            placeholder="O espaço metafísico interior que reflete a mente e a alma do feiticeiro..."
            value={p.innateDomain}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, innateDomain: val },
              }));
            }}
            className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            História do Personagem
          </label>
          <textarea
            rows={4}
            placeholder="Origens, despertar da energia, primeiras missões no Colégio Jujutsu..."
            value={p.backstory}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, backstory: val },
              }));
            }}
            className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
