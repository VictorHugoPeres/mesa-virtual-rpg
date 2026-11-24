"use client";

import { FMCharacterData, SpellDef } from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { useDialog } from "@/core/ui";
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
  const { toast } = useDialog();
  const isRestringido = sheet.origin === "Restringido";
  const spells = sheet.cursedProfile?.spells || [];

  if (spells.length === 0) return null;

  function handleCastSpell(sp: SpellDef) {
    const currentPE = sheet.energy?.current ?? 0;
    if (currentPE < sp.peCost) {
      toast.warning(`PE Insuficiente! Você possui ${currentPE} PE, mas "${sp.name}" requer ${sp.peCost} PE.`);
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
      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
        <Wand2 className="w-3.5 h-3.5 text-rose-500" />
        {isRestringido ? "Habilidades Marciais" : `Técnica: ${sheet.cursedProfile?.techniqueName || "Inata"}`}
      </span>

      <div className="space-y-2">
        {spells.map((sp) => {
          const diceMatch = sp.effect?.match(/(\d*d\d+(?:\s*[+-]\s*\d+)?)/i);

          return (
            <div
              key={sp.id}
              className="p-3.5 rounded-2xl bg-[#14161A] border border-[#23272F] space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-100">{sp.name}</h4>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <span>{sp.action}</span>
                    <span>•</span>
                    <span>{sp.range}</span>
                    <span>•</span>
                    <span>Nvl {sp.level}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-full">
                  {sp.peCost} {isRestringido ? "Vigor" : "PE"}
                </span>
              </div>

              {sp.effect && (
                <p className="text-[11px] text-zinc-300 leading-relaxed bg-[#0B0C0E]/60 p-2 rounded-xl border border-[#23272F]/50">
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
                    className="px-2.5 py-1.5 rounded-xl bg-[#0B0C0E] border border-[#23272F] text-zinc-300 hover:text-white font-bold text-[11px] active:scale-95 touch-manipulation select-none cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Dices className="w-3.5 h-3.5 text-sky-400" /> Rolar ({diceMatch[1]})
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleCastSpell(sp)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs touch-manipulation select-none cursor-pointer transition-all"
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
