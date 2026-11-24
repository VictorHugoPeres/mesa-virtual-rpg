"use client";

import {
  FMCharacterData,
  AttributeKey,
  Specialization,
  getModifier,
  calcDefense,
  calcSuggestedHP,
  calcSuggestedPE,
  getSoulState,
} from "@/systems/feiticeiros-e-maldicoes";
import { ResourceBarCard } from "./ResourceBarCard";
import { Heart, Zap, Shield, Activity, Sparkles } from "lucide-react";

interface ResourceBarsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function ResourceBars({ data, onChange }: ResourceBarsProps) {
  function updateHp(delta: number) {
    onChange((prev) => ({
      ...prev,
      hp: {
        ...prev.hp,
        current: Math.max(0, Math.min(prev.hp.max + prev.hp.temp, prev.hp.current + delta)),
      },
    }));
  }

  function updatePe(delta: number) {
    onChange((prev) => ({
      ...prev,
      energy: {
        ...prev.energy,
        current: Math.max(0, Math.min(prev.energy.max + prev.energy.temp, prev.energy.current + delta)),
      },
    }));
  }

  function updateIntegrity(delta: number) {
    onChange((prev) => ({
      ...prev,
      integrity: {
        ...prev.integrity,
        current: Math.max(0, Math.min(prev.integrity.max + prev.integrity.temp, prev.integrity.current + delta)),
      },
    }));
  }

  function applySuggestedHpPe() {
    const conMod = getModifier(data.attributes["CON"] ?? 10);
    const keyAttr = data.keyAttribute as AttributeKey;
    const keyMod = getModifier(data.attributes[keyAttr] ?? 10);

    const sugHp = calcSuggestedHP(data.specialization as Specialization, data.level, conMod, data.clan);
    const sugPe = calcSuggestedPE(data.specialization as Specialization, data.level, keyMod, {
      origin: data.origin,
      clan: data.clan,
    });

    onChange((prev) => ({
      ...prev,
      hp: { ...prev.hp, max: sugHp, current: Math.min(prev.hp.current, sugHp) },
      energy: { ...prev.energy, max: sugPe, current: Math.min(prev.energy.current, sugPe) },
      integrity: { ...prev.integrity, max: sugHp, current: Math.min(prev.integrity.current, sugHp) },
    }));
  }

  const dexMod = getModifier(data.attributes["DEX"] ?? 10);
  const halfLevel = Math.floor(data.level / 2);
  const isRestringido = data.origin === "Restringido" || data.specialization === "Restringido";
  const soul = getSoulState(data.integrity.current, data.integrity.max);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Pontos de Vida (PV) */}
      <ResourceBarCard
        label="Pontos de Vida (PV)"
        icon={<Heart className="w-4 h-4" />}
        colorClass="text-rose-400"
        barColor="bg-rose-500"
        hoverBg="hover:bg-rose-950/40"
        current={data.hp.current}
        max={data.hp.max}
        temp={data.hp.temp}
        headerAction={
          <button
            type="button"
            onClick={applySuggestedHpPe}
            title="Calcular PV e PE máximos v2.5 pelas regras de nível, especialização e clã"
            className="text-[10px] flex items-center gap-1 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-rose-400" /> Auto v2.5
          </button>
        }
        onUpdateCurrent={updateHp}
        onChangeCurrent={(val) =>
          onChange((prev) => ({ ...prev, hp: { ...prev.hp, current: val } }))
        }
        onChangeMax={(val) =>
          onChange((prev) => ({ ...prev, hp: { ...prev.hp, max: val } }))
        }
        onChangeTemp={(val) =>
          onChange((prev) => ({ ...prev, hp: { ...prev.hp, temp: val } }))
        }
      />

      {/* 2. Energia Amaldiçoada (PE) ou Estamina */}
      <ResourceBarCard
        label={isRestringido ? "Estamina / Vigor" : "Energia Amaldiçoada (PE)"}
        icon={<Zap className="w-4 h-4" />}
        colorClass={isRestringido ? "text-amber-400" : "text-sky-400"}
        barColor={isRestringido ? "bg-amber-400" : "bg-sky-400"}
        hoverBg={isRestringido ? "hover:bg-amber-950/40" : "hover:bg-sky-950/40"}
        current={data.energy.current}
        max={data.energy.max}
        temp={data.energy.temp}
        onUpdateCurrent={updatePe}
        onChangeCurrent={(val) =>
          onChange((prev) => ({ ...prev, energy: { ...prev.energy, current: val } }))
        }
        onChangeMax={(val) =>
          onChange((prev) => ({ ...prev, energy: { ...prev.energy, max: val } }))
        }
        onChangeTemp={(val) =>
          onChange((prev) => ({ ...prev, energy: { ...prev.energy, temp: val } }))
        }
      />

      {/* 3. Integridade da Alma com Badge de Estado da Alma v2.5 */}
      <ResourceBarCard
        label="Integridade da Alma"
        icon={<Activity className="w-4 h-4" />}
        colorClass="text-purple-400"
        barColor="bg-purple-500"
        hoverBg="hover:bg-purple-950/40"
        current={data.integrity.current}
        max={data.integrity.max}
        temp={data.integrity.temp}
        tempLabel="Temporária:"
        headerAction={
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              soul.state === "Estável"
                ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300"
                : soul.state === "Danificado"
                ? "bg-amber-950/50 border-amber-800/60 text-amber-300"
                : soul.state === "Instável"
                ? "bg-orange-950/50 border-orange-800/60 text-orange-300"
                : soul.state === "Crítico"
                ? "bg-rose-950/60 border-rose-800/80 text-rose-300 animate-pulse"
                : "bg-red-950/80 border-red-800 text-red-400"
            }`}
            title={soul.description}
          >
            {soul.state} {soul.state === "Danificado" ? "(-3 / +2 PE)" : soul.state === "Instável" ? "(-6 / +3 PE)" : soul.state === "Crítico" ? "(-8 / +5 PE)" : ""}
          </span>
        }
        onUpdateCurrent={updateIntegrity}
        onChangeCurrent={(val) =>
          onChange((prev) => ({ ...prev, integrity: { ...prev.integrity, current: val } }))
        }
        onChangeMax={(val) =>
          onChange((prev) => ({ ...prev, integrity: { ...prev.integrity, max: val } }))
        }
        onChangeTemp={(val) =>
          onChange((prev) => ({ ...prev, integrity: { ...prev.integrity, temp: val } }))
        }
      />

      {/* 4. Defesa / Classe de Armadura (CA) v2.5 */}
      <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
            <Shield className="w-4 h-4 text-zinc-400" /> Defesa (CA)
          </span>
          <span className="text-2xl font-bold text-zinc-100">
            {calcDefense(data)}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 mb-3 font-mono leading-relaxed">
          10 + DES ({dexMod >= 0 ? `+${dexMod}` : dexMod}) + ⌊N/2⌋ (+{halfLevel}) + Unif + Esc + Outros
        </p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[10px] text-zinc-400 mb-0.5">Uniforme</label>
            <input
              type="number"
              value={data.defense.uniform}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onChange((prev) => {
                  const next = { ...prev, defense: { ...prev.defense, uniform: val } };
                  next.defense.total = calcDefense(next);
                  return next;
                });
              }}
              className="w-full text-center py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 mb-0.5">Escudo</label>
            <input
              type="number"
              value={data.defense.shield}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onChange((prev) => {
                  const next = { ...prev, defense: { ...prev.defense, shield: val } };
                  next.defense.total = calcDefense(next);
                  return next;
                });
              }}
              className="w-full text-center py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 mb-0.5">Outros</label>
            <input
              type="number"
              value={data.defense.other}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onChange((prev) => {
                  const next = { ...prev, defense: { ...prev.defense, other: val } };
                  next.defense.total = calcDefense(next);
                  return next;
                });
              }}
              className="w-full text-center py-1 rounded bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
