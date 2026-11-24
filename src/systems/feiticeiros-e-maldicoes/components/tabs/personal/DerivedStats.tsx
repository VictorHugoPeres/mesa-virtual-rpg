"use client";

import {
  FMCharacterData,
  calcAttention,
  calcInitiative,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Eye, Activity, Footprints, Skull, Dices, Info } from "lucide-react";

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
      <div className="p-3.5 rounded-xl bg-[#14161A] border border-[#23272F] flex items-center gap-3">
        <Eye className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <p className="text-[10px] uppercase font-bold text-zinc-400">
            Atenção (Passiva)
          </p>
          <p className="text-xl font-bold text-zinc-100">{calcAttention(data)}</p>
        </div>
      </div>

      {/* Iniciativa (Clicável para Rolar) */}
      <button
        type="button"
        onClick={handleRollInitiative}
        className="p-3.5 rounded-xl bg-[#14161A] border border-[#23272F] flex items-center gap-3 text-left hover:border-amber-500/50 hover:bg-[#1A1D24] transition-all cursor-pointer group"
        title="Clique para rolar Iniciativa (1d20 + Modificador de Destreza)"
      >
        <Activity className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-zinc-400">
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
      <div className="p-3.5 rounded-xl bg-[#14161A] border border-[#23272F] flex items-center gap-3">
        <Footprints className="w-5 h-5 text-sky-400 shrink-0" />
        <div>
          <p className="text-[10px] uppercase font-bold text-zinc-400">
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
              className="w-12 text-xl font-bold bg-transparent text-zinc-100"
            />
            <span className="text-xs text-zinc-400">metros</span>
          </div>
        </div>
      </div>

      {/* Testes de Morte v2.5 */}
      <div className="p-3.5 rounded-xl bg-[#14161A] border border-[#23272F]">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
          <div
            className="flex items-center gap-1.5 cursor-help"
            title="Regras v2.5: 1 = 2 falhas | 2-9 = 1 falha | 10-19 = 1 sucesso | 20 = 2 sucessos. 3 sucessos = Estabilizado (recupera 1 PV). 3 falhas = Morte."
          >
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            <span>Portas da Morte</span>
            <Info className="w-3 h-3 text-zinc-500" />
          </div>
          <button
            type="button"
            onClick={handleRollDeathSave}
            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
            title="Rolar d20 puro para teste contra a morte"
          >
            <Dices className="w-3 h-3" /> Rolar
          </button>
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-medium text-[11px]">Sucessos</span>
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
                      ? "bg-emerald-500 border-emerald-400"
                      : "bg-[#0B0C0E] border-[#23272F]"
                  }`}
                  title={`${num} Sucesso(s)`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-rose-400 font-medium text-[11px]">Fracassos</span>
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
                      ? "bg-rose-600 border-rose-500"
                      : "bg-[#0B0C0E] border-[#23272F]"
                  }`}
                  title={`${num} Fracasso(s)`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
