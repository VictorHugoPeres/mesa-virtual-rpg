"use client";

import {
  FMCharacterData,
  AttributeKey,
  Specialization,
  getModifier,
  calcDefense,
  calcSuggestedHP,
  calcSuggestedPE,
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

    const sugHp = calcSuggestedHP(data.specialization as Specialization, data.level, conMod);
    const sugPe = calcSuggestedPE(data.specialization as Specialization, data.level, keyMod);

    onChange((prev) => ({
      ...prev,
      hp: { ...prev.hp, max: sugHp, current: Math.min(prev.hp.current, sugHp) },
      energy: { ...prev.energy, max: sugPe, current: Math.min(prev.energy.current, sugPe) },
      integrity: { ...prev.integrity, max: sugHp, current: Math.min(prev.integrity.current, sugHp) },
    }));
  }

  const dexMod = getModifier(data.attributes["DEX"] ?? 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Pontos de Vida (PV) */}
      <ResourceBarCard
        label="Pontos de Vida (PV)"
        icon={<Heart className="w-4 h-4" />}
        colorClass="text-red-400"
        barColor="bg-red-600"
        hoverBg="hover:bg-red-950/50"
        current={data.hp.current}
        max={data.hp.max}
        temp={data.hp.temp}
        headerAction={
          <button
            type="button"
            onClick={applySuggestedHpPe}
            title="Calcular PV e PE máximos pelas regras de nível e constituição"
            className="text-[10px] flex items-center gap-1 text-[var(--text-muted)] hover:text-red-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> Auto
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

      {/* 2. Energia Amaldiçoada (PE) */}
      <ResourceBarCard
        label="Energia Amaldiçoada (PE)"
        icon={<Zap className="w-4 h-4" />}
        colorClass="text-blue-400"
        barColor="bg-blue-600"
        hoverBg="hover:bg-blue-950/50"
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

      {/* 3. Integridade da Alma */}
      <ResourceBarCard
        label="Integridade da Alma"
        icon={<Activity className="w-4 h-4" />}
        colorClass="text-purple-400"
        barColor="bg-purple-600"
        hoverBg="hover:bg-purple-950/50"
        current={data.integrity.current}
        max={data.integrity.max}
        temp={data.integrity.temp}
        tempLabel="Temporária:"
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

      {/* 4. Defesa / Classe de Armadura (CA) */}
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
            <Shield className="w-4 h-4" /> Defesa / CA
          </span>
          <span className="text-2xl font-bold text-amber-300">
            {calcDefense(data)}
          </span>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] mb-3">
          10 + DEX ({dexMod >= 0 ? `+${dexMod}` : dexMod}) + Uniforme + Escudo + Outros
        </p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Uniforme</label>
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
              className="w-full text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Escudo</label>
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
              className="w-full text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Outros</label>
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
              className="w-full text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
