"use client";

import { useState } from "react";
import { FMCharacterData, SPEC_TABLE, Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { Moon, Sun, Heart, Activity, Dices, X, Check, ShieldAlert } from "lucide-react";

interface RestModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName: string;
  characterId?: string;
  campaignId?: string;
}

export function RestModal({
  isOpen,
  onClose,
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: RestModalProps) {
  const [activeTab, setActiveTab] = useState<"short" | "long">("short");
  const [diceToSpend, setDiceToSpend] = useState(1);
  const [lastRestResult, setLastRestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalDV = Math.max(data.hitDice?.total ?? 1, data.level ?? 1);
  const spentDV = data.hitDice?.spent ?? 0;
  const availableDV = Math.max(0, totalDV - spentDV);
  const die = data.hitDice?.die || SPEC_TABLE[data.specialization as Specialization]?.hitDie || "d10";
  const dieMax = parseInt(die.replace(/\D/g, "")) || 10;
  const conMod = Math.floor(((data.attributes?.CON ?? 10) - 10) / 2);
  const halfPE = Math.floor(data.energy.max / 2);

  function handleShortRest() {
    if (availableDV <= 0 || diceToSpend <= 0) return;

    const count = Math.min(diceToSpend, availableDV);
    let totalHealed = 0;
    const rolls: number[] = [];

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * dieMax) + 1;
      rolls.push(roll);
      const heal = Math.max(1, roll + conMod);
      totalHealed += heal;
    }

    const newHp = Math.min(data.hp.max, data.hp.current + totalHealed);
    const newPe = Math.min(data.energy.max, data.energy.current + halfPE);
    const actualHpGained = newHp - data.hp.current;
    const actualPeGained = newPe - data.energy.current;

    onChange((prev) => ({
      ...prev,
      hp: { ...prev.hp, current: newHp },
      energy: { ...prev.energy, current: newPe },
      hitDice: {
        die,
        total: totalDV,
        spent: spentDV + count,
      },
    }));

    const resultMsg = `Descanso Curto: gastou ${count}${die} [${rolls.join(", ")}] + Mod CON (${conMod}). Recuperou +${actualHpGained} PV e +${actualPeGained} PE.`;
    setLastRestResult(resultMsg);

    if (campaignId) {
      fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          roller: characterName,
          characterId,
          label: `Descanso Curto (${count}${die})`,
          dice: `${count}${die}`,
          modifier: conMod * count,
          total: totalHealed,
          individualRolls: rolls,
          isManual: false,
        }),
      }).catch((err) => console.warn("Erro ao enviar log de descanso:", err));
    }
  }

  function handleLongRest() {
    onChange((prev) => ({
      ...prev,
      hp: { ...prev.hp, current: prev.hp.max, temp: 0 },
      energy: { ...prev.energy, current: prev.energy.max, temp: 0 },
      hitDice: {
        die,
        total: totalDV,
        spent: 0,
      },
      deathSaves: { successes: 0, failures: 0 },
    }));

    const resultMsg = `Descanso Longo realizado: PV e PE totalmente restaurados ao máximo! Todos os ${totalDV} Dados de Vida recuperados.`;
    setLastRestResult(resultMsg);

    if (campaignId) {
      fetch("/api/rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          roller: characterName,
          characterId,
          label: "Descanso Longo (8h)",
          dice: "-",
          modifier: 0,
          total: data.hp.max,
          individualRolls: [],
          isManual: false,
        }),
      }).catch((err) => console.warn("Erro ao enviar log de descanso:", err));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl p-5 text-white space-y-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Descanso & Recuperação</h3>
              <p className="text-[11px] text-zinc-400">{characterName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Atual */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-zinc-900 border border-white/10">
            <span className="flex items-center justify-center gap-1 text-[10px] text-red-400 font-bold mb-0.5">
              <Heart className="w-3 h-3" /> PV Atual
            </span>
            <span className="font-bold text-white">{data.hp.current} / {data.hp.max}</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-900 border border-white/10">
            <span className="flex items-center justify-center gap-1 text-[10px] text-blue-400 font-bold mb-0.5">
              <Activity className="w-3 h-3" /> PE Atual
            </span>
            <span className="font-bold text-white">{data.energy.current} / {data.energy.max}</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-900 border border-white/10">
            <span className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-bold mb-0.5">
              <Dices className="w-3 h-3" /> Dados Vida
            </span>
            <span className="font-bold text-amber-300 font-mono">{availableDV}/{totalDV} {die}</span>
          </div>
        </div>

        {/* Abas Descanso Curto vs Longo */}
        <div className="flex rounded-xl bg-zinc-900 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => { setActiveTab("short"); setLastRestResult(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "short" ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Curto (2-4h)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("long"); setLastRestResult(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "long" ? "bg-amber-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Longo (8h)
          </button>
        </div>

        {/* Conteúdo da Aba */}
        {activeTab === "short" ? (
          <div className="space-y-3 text-xs">
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Gaste Dados de Vida (DV) para curar PV (rola <span className="text-white font-mono">1{die} + {conMod >= 0 ? `+${conMod}` : conMod}</span> de CON por dado). Recupera automaticamente metade do PE máximo (<span className="text-blue-300 font-bold">+{halfPE} PE</span>).
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/10">
              <span className="font-medium text-zinc-300">Gastar quantos DVs?</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, availableDV)}
                  value={diceToSpend}
                  disabled={availableDV === 0}
                  onChange={(e) => setDiceToSpend(Math.max(1, Math.min(availableDV, parseInt(e.target.value) || 1)))}
                  className="w-16 px-2 py-1 text-center font-bold font-mono rounded bg-zinc-950 border border-white/20 text-white"
                />
                <span className="text-zinc-500 font-mono">/ {availableDV}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={availableDV === 0}
              onClick={handleShortRest}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Dices className="w-4 h-4" /> Realizar Descanso Curto
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              O Descanso Longo (8h de sono/repouso) recupera completamente seus <span className="text-red-300 font-bold">PVs</span>, restaura todo seu <span className="text-blue-300 font-bold">PE</span>, recupera todos os <span className="text-amber-300 font-bold">Dados de Vida</span> e zera salvaguardas de morte.
            </p>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Garante restauração integral de recursos. Use apenas ao final de um dia de aventura.</span>
            </div>

            <button
              type="button"
              onClick={handleLongRest}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sun className="w-4 h-4" /> Realizar Descanso Longo
            </button>
          </div>
        )}

        {/* Feedback do Resultado */}
        {lastRestResult && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{lastRestResult}</span>
          </div>
        )}
      </div>
    </div>
  );
}
