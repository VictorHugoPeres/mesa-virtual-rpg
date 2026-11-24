"use client";

import {
  FMCharacterData,
  SPECIALIZATIONS,
  ORIGINS,
  getProficiencyBonus,
  getGradeForLevel,
  calcAttention,
} from "@/systems/feiticeiros-e-maldicoes";

const CLANS = ["Gojo", "Zenin", "Kamo", "Inumaki"] as const;

interface PersonalHeaderProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function PersonalHeader({ data, onChange }: PersonalHeaderProps) {
  const profBonus = getProficiencyBonus(data.level);
  const isHerdado = data.origin === "Herdado";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 p-4 rounded-xl bg-[#14161A] border border-[#23272F]">
      {/* Nível */}
      <div className="col-span-1">
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
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
          className="w-full text-center font-bold text-lg py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
        />
      </div>

      {/* Maestria (Auto) */}
      <div className="col-span-1 text-center">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Maestria (BT)
        </p>
        <div className="py-1 rounded bg-[#0B0C0E] border border-[#23272F] font-bold text-lg text-emerald-400">
          +{profBonus}
        </div>
      </div>

      {/* Grau */}
      <div className="col-span-2">
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Grau Jujutsu
        </label>
        <input
          type="text"
          value={data.grade}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, grade: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
        />
      </div>

      {/* Especialização */}
      <div className="col-span-2">
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Especialização
        </label>
        <select
          value={data.specialization}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, specialization: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Origem e Clã (se Herdado) */}
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Origem
          </label>
          {isHerdado && (
            <span className="text-[10px] font-bold text-rose-400 uppercase">
              Clã
            </span>
          )}
        </div>
        <div className={`grid ${isHerdado ? "grid-cols-2 gap-1.5" : "grid-cols-1"}`}>
          <select
            value={data.origin}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                origin: e.target.value,
                clan: e.target.value === "Herdado" ? (prev.clan || "Gojo") : "",
              }))
            }
            className="w-full px-2 py-1.5 text-sm rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
          >
            {ORIGINS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          {isHerdado && (
            <select
              value={data.clan || "Gojo"}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, clan: e.target.value }))
              }
              className="w-full px-2 py-1.5 text-sm rounded bg-[#0B0C0E] border border-rose-900/50 text-rose-300 font-semibold"
            >
              {CLANS.map((c) => (
                <option key={c} value={c}>
                  Clã {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Técnica Inata */}
      <div className="col-span-2 md:col-span-4">
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Técnica Inata
        </label>
        <input
          type="text"
          placeholder="Ex: Proporções, Dez Sombras, Sem Técnica..."
          value={data.technique}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, technique: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
        />
      </div>

      {/* Jogador */}
      <div className="col-span-2 md:col-span-4">
        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Jogador / Campanha
        </label>
        <input
          type="text"
          placeholder="Nome do Jogador"
          value={data.player}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, player: e.target.value }))
          }
          className="w-full px-2.5 py-1.5 text-sm rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
        />
      </div>
    </div>
  );
}
