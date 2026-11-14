"use client";

import {
  FMCharacterData,
  SPECIALIZATIONS,
  ORIGINS,
  getProficiencyBonus,
  getGradeForLevel,
  calcAttention,
} from "@/systems/feiticeiros-e-maldicoes";

interface PersonalHeaderProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function PersonalHeader({ data, onChange }: PersonalHeaderProps) {
  const profBonus = getProficiencyBonus(data.level);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      {/* Nível */}
      <div className="col-span-1">
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Nível
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={data.level}
          onChange={(e) => {
            const lvl = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
            onChange((prev) => ({
              ...prev,
              level: lvl,
              grade: getGradeForLevel(lvl),
              attention: calcAttention({ ...prev, level: lvl }),
            }));
          }}
          className="w-full text-center font-bold text-lg py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>

      {/* Maestria (Auto) */}
      <div className="col-span-1 text-center">
        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Maestria
        </p>
        <div className="py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] font-bold text-lg text-green-400">
          +{profBonus}
        </div>
      </div>

      {/* Grau */}
      <div className="col-span-2">
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Grau Jujutsu
        </label>
        <input
          type="text"
          value={data.grade}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, grade: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>

      {/* Especialização */}
      <div className="col-span-2">
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Especialização
        </label>
        <select
          value={data.specialization}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, specialization: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Origem */}
      <div className="col-span-2">
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Origem
        </label>
        <select
          value={data.origin}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, origin: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        >
          {ORIGINS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Técnica Inata */}
      <div className="col-span-2 md:col-span-4">
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Técnica Inata
        </label>
        <input
          type="text"
          placeholder="Ex: Proporções, Dez Sombras, Sem Técnica..."
          value={data.technique}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, technique: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>

      {/* Jogador */}
      <div className="col-span-2 md:col-span-4">
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Jogador / Campanha
        </label>
        <input
          type="text"
          placeholder="Nome do Jogador"
          value={data.player}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, player: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
        />
      </div>
    </div>
  );
}
