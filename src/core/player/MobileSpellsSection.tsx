"use client";

import { useState } from "react";
import {
  FMCharacterData,
  SpellDef,
  AttributeKey,
  getModifier,
  getProficiencyBonus,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { useDialog } from "@/core/ui";
import { Wand2, Sparkles, Dices, Swords } from "lucide-react";
import { MartialTechniquesModal } from "@/systems/feiticeiros-e-maldicoes/components/techniques";
import { generateId } from "@/lib/id";

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
  const [isMartialOpen, setIsMartialOpen] = useState(false);
  const isRestringido = sheet.origin === "Restringido" || sheet.specialization === "Restringido";
  const spells = sheet.cursedProfile?.spells || [];

  const techAttr = (sheet.cursedProfile?.techniqueAttribute || "INT") as AttributeKey;
  const techAttrMod = getModifier(sheet.attributes[techAttr] ?? 10);
  const halfLevel = Math.floor(sheet.level / 2);
  const prof = getProficiencyBonus(sheet.level);
  const calcDC = 10 + halfLevel + prof + techAttrMod;

  function handleCastSpell(sp: SpellDef) {
    const currentResource = sheet.energy?.current ?? 0;
    const resLabel = isRestringido ? "EST" : "PE";
    const resName = isRestringido ? "Estamina" : "PE";

    if (currentResource < sp.peCost) {
      toast.warning(`${resName} Insuficiente! Você possui ${currentResource} ${resLabel}, mas "${sp.name}" requer ${sp.peCost} ${resLabel}.`);
      return;
    }

    const nextResource = Math.max(0, currentResource - sp.peCost);
    onUpdateSheet((prev) => ({
      ...prev,
      energy: { ...prev.energy, current: nextResource },
    }));

    fetch("/api/rolls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "PHYSICAL",
        campaignId,
        characterId,
        roller: characterName,
        formula: `${sp.peCost} ${resLabel}`,
        rawRoll: `${isRestringido ? "Usou Manobra" : "Conjurou"}: ${sp.name} (-${sp.peCost} ${resLabel})`,
        modifier: 0,
        total: sp.peCost,
        label: `${isRestringido ? "Manobra" : "Feitiço"}: ${sp.name}`,
        isCritical: false,
        isFumble: false,
        showOnTv: true,
      }),
    }).catch((err) => console.warn("Erro ao registrar habilidade mobile:", err));

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
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          {isRestringido ? (
            <Swords className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 text-rose-500" />
          )}
          {isRestringido
            ? "Estilo & Técnicas Marciais"
            : `Técnica: ${sheet.cursedProfile?.techniqueName || "Inata"}`}
        </span>

        <div className="flex items-center gap-1.5">
          {isRestringido ? (
            <button
              type="button"
              onClick={() => setIsMartialOpen(true)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Swords className="w-3 h-3" /> + Arsenal
            </button>
          ) : (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950/50 border border-sky-800/60 text-sky-400">
              CD {calcDC}
            </span>
          )}
        </div>
      </div>

      {spells.length === 0 ? (
        isRestringido ? (
          <div className="p-3.5 rounded-2xl bg-[#14161A] border border-[#23272F] text-center space-y-2">
            <p className="text-xs text-zinc-300">Nenhuma técnica marcial equipada.</p>
            <button
              type="button"
              onClick={() => setIsMartialOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" /> Abrir Arsenal Marcial
            </button>
          </div>
        ) : null
      ) : (
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

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isRestringido
                        ? "text-amber-300 bg-amber-950/60 border border-amber-800/60"
                        : "text-sky-300 bg-sky-950/60 border border-sky-800/60"
                    }`}
                  >
                    {sp.peCost} {isRestringido ? "EST" : "PE"}
                  </span>
                </div>

                {sp.effect && (
                  <p className="text-[11px] text-zinc-300 leading-relaxed bg-[#0B0C0E] p-2 rounded-xl border border-[#23272F]">
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
                      className="px-2.5 py-1.5 rounded-xl bg-[#0B0C0E] border border-[#23272F] text-zinc-300 hover:text-white font-bold text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Dices className="w-3.5 h-3.5 text-sky-400" /> Rolar ({diceMatch[1]})
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCastSpell(sp)}
                    className={`px-3 py-1.5 rounded-xl text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors ${
                      isRestringido
                        ? "bg-amber-600 hover:bg-amber-500"
                        : "bg-rose-600 hover:bg-rose-500"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Usar (-{sp.peCost} {isRestringido ? "EST" : "PE"})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MartialTechniquesModal
        isOpen={isMartialOpen}
        onClose={() => setIsMartialOpen(false)}
        characterLevel={sheet.level}
        onAddTechnique={(tech) => {
          onUpdateSheet((prev) => ({
            ...prev,
            cursedProfile: {
              ...prev.cursedProfile,
              spells: [
                ...prev.cursedProfile.spells,
                {
                  id: generateId("spell"),
                  ...tech,
                },
              ],
            },
          }));
          toast.success(`Manobra "${tech.name}" adicionada ao Arsenal!`);
          setIsMartialOpen(false);
        }}
      />
    </div>
  );
}
