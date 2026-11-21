"use client";

import { useState, useRef } from "react";
import {
  FMCharacterData,
  getSkillBonus,
  SKILLS_LIST,
  SkillDef,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { MobileResourceBar } from "./MobileResourceBar";
import { MobileAttributesGrid } from "./MobileAttributesGrid";
import { MobileSpellsSection } from "./MobileSpellsSection";
import { Heart, Activity, Sparkles, Swords } from "lucide-react";

interface MobileTabFichaProps {
  campaignId: string;
  characterId: string;
  characterName: string;
  initialSheet: FMCharacterData;
}

export function MobileTabFicha({
  campaignId,
  characterId,
  characterName,
  initialSheet,
}: MobileTabFichaProps) {
  const { openRoller } = useDice();
  const [sheet, setSheet] = useState<FMCharacterData>(initialSheet);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isIncomingSyncRef = useRef(false);

  // Sincronização em tempo real com o PC do Mestre e o Tracker de Combate
  useCampaignSync({
    campaignId,
    onEvent: (event) => {
      if (event.type === "CHARACTER_UPDATE") {
        const payload = event.payload as { characterId: string; data: FMCharacterData };
        if (payload?.characterId === characterId && payload.data) {
          isIncomingSyncRef.current = true;
          setSheet(payload.data);
        }
      }
    },
  });

  function updateSheet(updater: (prev: FMCharacterData) => FMCharacterData) {
    setSheet((prev) => {
      const next = updater(prev);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: next }),
        }).catch((err) => console.error("Erro ao salvar ficha mobile:", err));
      }, 500);

      return next;
    });
  }

  const isRestringido = sheet.origin === "Restringido";

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Barras de Recursos */}
      <div className="space-y-2">
        <MobileResourceBar
          label="Pontos de Vida (PV)"
          current={sheet.hp.current}
          max={sheet.hp.max}
          temp={sheet.hp.temp}
          colorClass="bg-rose-950/20 border-rose-900/40 text-rose-300"
          barColor="bg-rose-500"
          icon={<Heart className="w-4 h-4 text-rose-400" />}
          onChange={(newVal) => updateSheet((prev) => ({ ...prev, hp: { ...prev.hp, current: newVal } }))}
        />

        <MobileResourceBar
          label={isRestringido ? "Estamina / Vigor" : "Energia Amaldiçoada (PE)"}
          current={sheet.energy.current}
          max={sheet.energy.max}
          temp={sheet.energy.temp}
          colorClass="bg-blue-950/20 border-blue-900/40 text-blue-300"
          barColor="bg-blue-500"
          icon={<Activity className="w-4 h-4 text-blue-400" />}
          onChange={(newVal) => updateSheet((prev) => ({ ...prev, energy: { ...prev.energy, current: newVal } }))}
        />

        <MobileResourceBar
          label="Integridade da Alma"
          current={sheet.integrity.current}
          max={sheet.integrity.max}
          colorClass="bg-purple-950/20 border-purple-900/40 text-purple-300"
          barColor="bg-purple-500"
          icon={<Sparkles className="w-4 h-4 text-purple-400" />}
          onChange={(newVal) => updateSheet((prev) => ({ ...prev, integrity: { ...prev.integrity, current: newVal } }))}
        />
      </div>

      {/* 2. Estatísticas e Atributos */}
      <MobileAttributesGrid
        sheet={sheet}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 3. Armas & Ataques */}
      {sheet.weapons?.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-blue-400" /> Armas & Ataques
          </span>
          <div className="space-y-2">
            {sheet.weapons.map((wpn, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[var(--text-primary)]">{wpn.name}</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Dano: {wpn.damage} ({wpn.damageType}) • Crit: {wpn.critical}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      openRoller({
                        label: `Ataque: ${wpn.name}`,
                        modifier: wpn.attackBonus ?? 0,
                        defaultDice: "1d20",
                        roller: characterName,
                        characterId,
                        campaignId,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[11px] cursor-pointer touch-manipulation select-none"
                  >
                    Ataque (+{wpn.attackBonus})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openRoller({
                        label: `Dano: ${wpn.name}`,
                        modifier: 0,
                        defaultDice: wpn.damage || "1d6",
                        roller: characterName,
                        characterId,
                        campaignId,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-rose-300 font-bold text-[11px] cursor-pointer active:scale-95 touch-manipulation select-none"
                  >
                    Dano
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Feitiços & Técnicas (Gasto de PE Interativo) */}
      <MobileSpellsSection
        sheet={sheet}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
        onUpdateSheet={updateSheet}
      />

      {/* 5. Perícias Treinadas */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
          Perícias Treinadas (Toque para Rolar)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {SKILLS_LIST.filter((s: SkillDef) => sheet.skills[s.name]?.trained).map((skill: SkillDef) => {
            const attrVal = sheet.attributes[skill.attribute] ?? 10;
            const skillData = sheet.skills[skill.name];
            const bonus = getSkillBonus(
              attrVal,
              sheet.level,
              skillData?.trained ?? false,
              skillData?.expert ?? false,
              skillData?.otherBonus ?? 0
            );
            const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`;

            return (
              <button
                key={skill.name}
                type="button"
                onClick={() =>
                  openRoller({
                    label: `Perícia: ${skill.name} (${skill.attribute})`,
                    modifier: bonus,
                    defaultDice: "1d20",
                    roller: characterName,
                    characterId,
                    campaignId,
                  })
                }
                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-blue-900/50 hover:border-blue-400 active:scale-95 text-left flex items-center justify-between cursor-pointer transition-all shadow-xs touch-manipulation select-none"
              >
                <div className="truncate mr-1">
                  <span className="font-semibold block truncate text-[var(--text-primary)]">{skill.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{skill.attribute}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">{bonusStr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
