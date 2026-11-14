"use client";

import {
  FMCharacterData,
  calcAttention,
  calcInitiative,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Eye, Activity, Footprints, Skull, Dices } from "lucide-react";

interface DerivedStatsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function DerivedStats({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: DerivedStatsProps) {
  const { openRoller } = useDice();
  const init = calcInitiative(data);

  function handleRollInitiative() {
    openRoller({
      label: "Iniciativa",
      modifier: init,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  function handleRollDeathSave() {
    openRoller({
      label: "Teste contra a Morte",
      modifier: 0,
      defaultDice: "1d20",
      roller: characterName || "Personagem",
      characterId,
      campaignId,
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Atenção */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center gap-3">
        <Eye className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
            Atenção (Passiva)
          </p>
          <p className="text-xl font-bold">{calcAttention(data)}</p>
        </div>
      </div>

      {/* Iniciativa (Clicável para Rolar) */}
      <button
        type="button"
        onClick={handleRollInitiative}
        className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center gap-3 text-left hover:border-amber-500/50 hover:bg-[var(--bg-secondary)]/60 transition-all cursor-pointer group"
        title="Clique para rolar Iniciativa (1d20 + bônus)"
      >
        <Activity className="w-6 h-6 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
              Iniciativa
            </p>
            <Dices className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100" />
          </div>
          <p className="text-xl font-bold text-amber-300">
            {init >= 0 ? `+${init}` : init}
          </p>
        </div>
      </button>

      {/* Movimento */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center gap-3">
        <Footprints className="w-6 h-6 text-cyan-400 shrink-0" />
        <div>
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
            Movimento
          </p>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={data.movement}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onChange((prev) => ({ ...prev, movement: val }));
              }}
              className="w-10 text-xl font-bold bg-transparent"
            />
            <span className="text-xs text-[var(--text-muted)]">metros</span>
          </div>
        </div>
      </div>

      {/* Testes de Morte */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
          <div className="flex items-center gap-1.5">
            <Skull className="w-3.5 h-3.5 text-red-400" /> Testes de Morte
          </div>
          <button
            type="button"
            onClick={handleRollDeathSave}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 cursor-pointer"
            title="Rolar d20 puro para teste contra a morte"
          >
            <Dices className="w-3 h-3" /> Rolar
          </button>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-medium text-[11px]">Sucessos</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    const cur = data.deathSaves.successes;
                    onChange((prev) => ({
                      ...prev,
                      deathSaves: {
                        ...prev.deathSaves,
                        successes: cur === num ? num - 1 : num,
                      },
                    }));
                  }}
                  className={`w-4 h-4 rounded-full border transition-colors cursor-pointer ${
                    data.deathSaves.successes >= num
                      ? "bg-green-500 border-green-400"
                      : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-medium text-[11px]">Fracassos</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    const cur = data.deathSaves.failures;
                    onChange((prev) => ({
                      ...prev,
                      deathSaves: {
                        ...prev.deathSaves,
                        failures: cur === num ? num - 1 : num,
                      },
                    }));
                  }}
                  className={`w-4 h-4 rounded-full border transition-colors cursor-pointer ${
                    data.deathSaves.failures >= num
                      ? "bg-red-500 border-red-400"
                      : "bg-[var(--bg-secondary)] border-[var(--border-default)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
