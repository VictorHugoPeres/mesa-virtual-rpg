"use client";

import { FMCharacterData, SpellDef } from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { Wand2, Sparkles, Dices } from "lucide-react";

interface MobileSpellsSectionProps {
  sheet: FMCharacterData;
  characterName: string;
  characterId: string;
  campaignId: string;
  onUpdateSheet: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function MobileSpellsSection({
  sheet,
  characterName,
  characterId,
  campaignId,
  onUpdateSheet,
}: MobileSpellsSectionProps) {
  const { openRoller } = useDice();
  const isRestringido = sheet.origin === "Restringido";
  const spells = sheet.cursedProfile?.spells || [];

  if (spells.length === 0) return null;

  function handleCastSpell(sp: SpellDef) {
    const currentPE = sheet.energy?.current ?? 0;
    if (currentPE < sp.peCost) {
      alert(`PE Insuficiente! Você possui ${currentPE} PE, mas "${sp.name}" requer ${sp.peCost} PE.`);
      return;
    }

    const nextPE = Math.max(0, currentPE - sp.peCost);
    onUpdateSheet((prev) => ({
      ...prev,
      energy: { ...prev.energy, current: nextPE },
    }));

    // Registra no histórico e telão via API
    fetch("/api/rolls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "PHYSICAL",
        campaignId,
        characterId,
        roller: characterName,
        formula: `${sp.peCost} PE`,
        rawRoll: `Conjurou: ${sp.name} (-${sp.peCost} PE)`,
        modifier: 0,
        total: sp.peCost,
        label: `Feitiço: ${sp.name}`,
        isCritical: false,
        isFumble: false,
        showOnTv: true,
      }),
    }).catch((err) => console.warn("Erro ao registrar feitiço mobile:", err));

    // Se houver dados descritos no efeito (ex: 2d8, 1d10+3), abre o rolador
    const diceMatch = sp.effect?.match(/(\d*d\d+(?:\s*[+-]\s*\d+)?)/i);
    if (diceMatch) {
      openRoller({
        label: `${sp.name} (Efeito/Dano)`,
        modifier: 0,
        defaultDice: diceMatch[1],
        roller: characterName,
        characterId,
        campaignId,
      });
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
        <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
        {isRestringido ? "Habilidades Marciais" : `Técnica: ${sheet.cursedProfile?.techniqueName || "Inata"}`}
      </span>

      <div className="space-y-2">
        {spells.map((sp) => {
          const diceMatch = sp.effect?.match(/(\d*d\d+(?:\s*[+-]\s*\d+)?)/i);

          return (
            <div
              key={sp.id}
              className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[var(--text-primary)]">{sp.name}</h4>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    <span>{sp.action}</span>
                    <span>•</span>
                    <span>{sp.range}</span>
                    <span>•</span>
                    <span>Nvl {sp.level}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-800/80 px-2 py-0.5 rounded-full">
                  {sp.peCost} {isRestringido ? "Vigor" : "PE"}
                </span>
              </div>

              {sp.effect && (
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-card)]/50 p-2 rounded-xl border border-[var(--border-default)]/40">
                  {sp.effect}
                </p>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {diceMatch && (
                  <button
                    type="button"
                    onClick={() =>
                      openRoller({
                        label: `${sp.name} (Dano/Efeito)`,
                        modifier: 0,
                        defaultDice: diceMatch[1],
                        roller: characterName,
                        characterId,
                        campaignId,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] text-indigo-300 font-bold text-[11px] active:scale-95 touch-manipulation select-none cursor-pointer flex items-center gap-1"
                  >
                    <Dices className="w-3.5 h-3.5" /> Rolar ({diceMatch[1]})
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleCastSpell(sp)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs touch-manipulation select-none cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Usar (-{sp.peCost} PE)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
