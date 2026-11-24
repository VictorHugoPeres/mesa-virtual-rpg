"use client";

import { useState, useRef, useCallback } from "react";
import {
  FMCharacterData,
  getSkillBonus,
  getSoulState,
  SKILLS_LIST,
  SkillDef,
  SPEC_TABLE,
  Specialization,
} from "@/systems/feiticeiros-e-maldicoes";
import { useDice } from "@/core/dice/DiceContext";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { SyncEvent } from "@/core/sync/syncTypes";
import { MobileResourceBar } from "./MobileResourceBar";
import { MobileAttributesGrid } from "./MobileAttributesGrid";
import { MobileSpellsSection } from "./MobileSpellsSection";
import { RestModal } from "@/systems/feiticeiros-e-maldicoes/components/RestModal";
import { Heart, Activity, Sparkles, Swords, Moon, Zap } from "lucide-react";

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
  const [isRestOpen, setIsRestOpen] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalDV = Math.max(sheet.hitDice?.total ?? 1, sheet.level ?? 1);
  const spentDV = sheet.hitDice?.spent ?? 0;
  const availableDV = Math.max(0, totalDV - spentDV);
  const die = sheet.hitDice?.die || SPEC_TABLE[sheet.specialization as Specialization]?.hitDie || "d10";

  // Sincronização em tempo real com o PC do Mestre e o Tracker de Combate
  const handleIncomingSync = useCallback(
    (event: SyncEvent) => {
      if (event.type === "CHARACTER_UPDATE") {
        const payload = event.payload as { characterId: string; data: FMCharacterData };
        if (payload?.characterId === characterId && payload.data) {
          setSheet(payload.data);
        }
      }
    },
    [characterId]
  );

  useCampaignSync({
    campaignId,
    onEvent: handleIncomingSync,
  });

  const scheduleSave = useCallback(
    (dataToSave: FMCharacterData) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataToSave }),
        }).catch((err) => console.error("Erro ao salvar ficha mobile:", err));
      }, 500);
    },
    [characterId]
  );

  const updateSheet = useCallback(
    (updater: (prev: FMCharacterData) => FMCharacterData) => {
      setSheet((prev) => {
        const next = updater(prev);
        queueMicrotask(() => scheduleSave(next));
        return next;
      });
    },
    [scheduleSave]
  );

  const isRestringido = sheet.origin === "Restringido" || sheet.specialization === "Restringido";
  const soul = getSoulState(sheet.integrity.current, sheet.integrity.max);

  // Perícias treinadas + subcategorias de Ofício configuradas
  const customCrafts = Object.keys(sheet.skills || {})
    .filter((k) => (k.startsWith("Ofício:") || k.startsWith("Ofício (")) && sheet.skills[k]?.trained && !SKILLS_LIST.some((s) => s.name === k))
    .map((name) => ({
      name,
      attribute: "INT" as const,
      requiresTraining: true,
      isSavingThrow: false,
    }));

  const trainedList = [
    ...SKILLS_LIST.filter((s: SkillDef) => sheet.skills[s.name]?.trained),
    ...customCrafts,
  ];

  const getSoulBadgeClass = () => {
    switch (soul.state) {
      case "Estável": return "bg-emerald-950/50 border-emerald-800/60 text-emerald-300";
      case "Danificado": return "bg-amber-950/50 border-amber-800/60 text-amber-300";
      case "Instável": return "bg-orange-950/50 border-orange-800/60 text-orange-300";
      case "Crítico": return "bg-rose-950/60 border-rose-800/80 text-rose-300 animate-pulse";
      default: return "bg-red-950/80 border-red-800 text-red-400";
    }
  };

  const soulPenalty = soul.state === "Danificado" ? "(-3)" : soul.state === "Instável" ? "(-6)" : soul.state === "Crítico" ? "(-8)" : "";

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Barras de Recursos v2.5 */}
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
          colorClass={isRestringido ? "bg-amber-950/20 border-amber-900/40 text-amber-300" : "bg-sky-950/20 border-sky-900/40 text-sky-300"}
          barColor={isRestringido ? "bg-amber-400" : "bg-sky-400"}
          icon={isRestringido ? <Zap className="w-4 h-4 text-amber-400" /> : <Activity className="w-4 h-4 text-sky-400" />}
          onChange={(newVal) => updateSheet((prev) => ({ ...prev, energy: { ...prev.energy, current: newVal } }))}
        />

        <MobileResourceBar
          label="Integridade da Alma"
          current={sheet.integrity.current}
          max={sheet.integrity.max}
          colorClass="bg-purple-950/20 border-purple-900/40 text-purple-300"
          barColor="bg-purple-500"
          icon={<Sparkles className="w-4 h-4 text-purple-400" />}
          badge={
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getSoulBadgeClass()}`} title={soul.description}>
              {soul.state} {soulPenalty}
            </span>
          }
          onChange={(newVal) => updateSheet((prev) => ({ ...prev, integrity: { ...prev.integrity, current: newVal } }))}
        />

        {/* Dados de Vida e Descanso */}
        <div className="p-2.5 rounded-xl bg-[#14161A] border border-[#23272F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Dados de Vida (DV)
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {availableDV} / {totalDV} {die}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsRestOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#1A1D24] hover:bg-[#23272F] border border-[#23272F] text-zinc-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Moon className="w-3.5 h-3.5" /> Descanso
          </button>
        </div>
      </div>

      {/* 2. Estatísticas e Atributos v2.5 */}
      <MobileAttributesGrid
        sheet={sheet}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 3. Armas & Ataques v2.5 */}
      {sheet.weapons?.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-blue-400" /> Armas & Ataques
          </span>
          <div className="space-y-2">
            {sheet.weapons.map((wpn, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#14161A] border border-[#23272F] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-zinc-100">{wpn.name}</h4>
                  <p className="text-[11px] text-zinc-400">
                    Dano: {wpn.damage} ({wpn.damageType}) • Crit: {wpn.critical}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openRoller({
                      label: `Ataque: ${wpn.name}`,
                      modifier: wpn.attackBonus ?? 0,
                      defaultDice: "1d20",
                      roller: characterName,
                      characterId,
                      campaignId,
                      linkedDamage: wpn.damage?.trim() || undefined,
                    })}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer transition-colors"
                  >
                    Ataque (+{wpn.attackBonus})
                  </button>
                  <button
                    type="button"
                    onClick={() => openRoller({ label: `Dano: ${wpn.name}`, modifier: 0, defaultDice: wpn.damage || "1d6", roller: characterName, characterId, campaignId })}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1A1D24] hover:bg-[#23272F] border border-[#23272F] text-rose-300 font-bold text-[11px] cursor-pointer transition-colors"
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

      {/* 5. Perícias e TRs Treinados (Toque para Rolar) */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Perícias & TRs Treinados ({trainedList.length})
        </span>
        {trainedList.length === 0 ? (
          <p className="text-xs text-zinc-500 italic p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
            Nenhuma perícia ou TR marcado como treinado na ficha.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {trainedList.map((skill) => {
              const attrVal = sheet.attributes[skill.attribute] ?? 10;
              const skillData = sheet.skills[skill.name];
              const bonus = getSkillBonus(attrVal, sheet.level, skillData?.trained ?? false, skillData?.expert ?? false, skillData?.otherBonus ?? 0, { attributeKey: skill.attribute, origin: sheet.origin });
              const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`;

              return (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => openRoller({ label: `Perícia: ${skill.name} (${skill.attribute})`, modifier: bonus, defaultDice: "1d20", roller: characterName, characterId, campaignId })}
                  className="p-2.5 rounded-xl bg-[#14161A] border border-[#23272F] hover:border-zinc-500 text-left flex items-center justify-between cursor-pointer transition-colors shadow-xs"
                >
                  <div className="truncate mr-1">
                    <span className="font-semibold block truncate text-zinc-200">{skill.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{skill.attribute}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{bonusStr}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <RestModal
        isOpen={isRestOpen}
        onClose={() => setIsRestOpen(false)}
        data={sheet}
        onChange={updateSheet}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />
    </div>
  );
}
