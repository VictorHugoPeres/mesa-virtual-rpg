"use client";

import { useState } from "react";
import { X, User, Skull, Plus, Sparkles } from "lucide-react";
import { CombatParticipant } from "./initiativeTypes";
import { parseCharacterData } from "@/systems/feiticeiros-e-maldicoes/schemas";
import { CustomCombatantTab } from "./CustomCombatantTab";

interface CampaignCharItem {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface AddCombatantModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CampaignCharItem[];
  existingParticipants: CombatParticipant[];
  onAddParticipant: (participant: CombatParticipant) => void;
}

export function AddCombatantModal({
  isOpen,
  onClose,
  characters,
  existingParticipants,
  onAddParticipant,
}: AddCombatantModalProps) {
  const [tab, setTab] = useState<"pcs" | "threats" | "custom">("pcs");

  if (!isOpen) return null;

  const pcs = characters.filter((c) => c.type === "PC" || c.type === "NPC");
  const threats = characters.filter((c) => c.type === "THREAT");

  function getGenId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function handleAddPC(char: CampaignCharItem) {
    let hp = 20;
    let def = 10;
    let initBonus = 0;
    let maxPe: number | undefined = undefined;

    try {
      const parsed = parseCharacterData(char.data);
      hp = parsed.hp.max || 20;
      def = parsed.defense.total || 10;
      initBonus = parsed.initiative || 0;
      maxPe = parsed.energy?.max;
    } catch {}

    const participant: CombatParticipant = {
      id: getGenId(),
      name: char.name,
      type: (char.type as "PC" | "NPC") || "PC",
      characterId: char.id,
      initiative: 0,
      initiativeBonus: initBonus,
      maxHp: hp,
      currentHp: hp,
      maxEnergy: maxPe,
      currentEnergy: maxPe,
      defense: def,
      conditions: [],
      isVisible: true,
    };

    onAddParticipant(participant);
  }

  function handleCloneThreat(char: CampaignCharItem) {
    let hp = 30;
    let def = 12;
    let initBonus = 0;
    let maxPe: number | undefined = undefined;

    try {
      const parsed = parseCharacterData(char.data);
      hp = parsed.hp.max || 30;
      def = parsed.defense.total || 12;
      initBonus = parsed.initiative || 0;
      maxPe = parsed.energy?.max;
    } catch {}

    const existingCount = existingParticipants.filter(
      (p) => p.characterId === char.id || p.name.startsWith(char.name)
    ).length;

    const cloneName = existingCount === 0 ? `${char.name} #1` : `${char.name} #${existingCount + 1}`;

    const participant: CombatParticipant = {
      id: getGenId(),
      name: cloneName,
      type: "THREAT",
      characterId: char.id,
      initiative: 0,
      initiativeBonus: initBonus,
      maxHp: hp,
      currentHp: hp,
      maxEnergy: maxPe,
      currentEnergy: maxPe,
      defense: def,
      conditions: [],
      isVisible: true,
    };

    onAddParticipant(participant);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Topo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" /> Adicionar Combatente
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-secondary)] text-xs">
          <button
            type="button"
            onClick={() => setTab("pcs")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              tab === "pcs"
                ? "border-blue-500 text-blue-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Personagens ({pcs.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("threats")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              tab === "threats"
                ? "border-red-500 text-red-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Skull className="w-3.5 h-3.5" /> Ameaças ({threats.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("custom")}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              tab === "custom"
                ? "border-purple-500 text-purple-400 bg-[var(--bg-card)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Rápido / Custom
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {tab === "pcs" && (
            <div className="space-y-2">
              {pcs.length === 0 ? (
                <p className="text-center text-xs text-[var(--text-muted)] py-6">
                  Nenhum personagem jogador cadastrado na campanha.
                </p>
              ) : (
                pcs.map((char) => {
                  const isAlreadyIn = existingParticipants.some((p) => p.characterId === char.id);
                  let hp = 10;
                  let def = 10;
                  let initBonus = 0;
                  try {
                    const parsed = parseCharacterData(char.data);
                    hp = parsed.hp.max;
                    def = parsed.defense.total;
                    initBonus = parsed.initiative;
                  } catch {}

                  return (
                    <div
                      key={char.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{char.name}</p>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-3 mt-0.5">
                          <span>PV: {hp}</span>
                          <span>Defesa: {def}</span>
                          <span>Inic: {initBonus >= 0 ? `+${initBonus}` : initBonus}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddPC(char)}
                        disabled={isAlreadyIn}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                      >
                        {isAlreadyIn ? "No Combate" : "+ Adicionar"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "threats" && (
            <div className="space-y-2">
              {threats.length === 0 ? (
                <p className="text-center text-xs text-[var(--text-muted)] py-6">
                  Nenhuma ameaça cadastrada. Use o Bestiário para criar ameaças.
                </p>
              ) : (
                threats.map((threat) => {
                  let hp = 10;
                  let def = 10;
                  let grade = "Ameaça";
                  try {
                    const parsed = parseCharacterData(threat.data);
                    hp = parsed.hp.max;
                    def = parsed.defense.total;
                    grade = parsed.grade || "Ameaça";
                  } catch {}

                  return (
                    <div
                      key={threat.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-red-950/60 hover:border-red-900/80 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/60">
                            {grade}
                          </span>
                          <p className="text-sm font-bold text-white">{threat.name}</p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-3 mt-1">
                          <span>PV: {hp}</span>
                          <span>Defesa: {def}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCloneThreat(threat)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/30 text-red-300 border border-red-500/40 hover:bg-red-600/50 cursor-pointer"
                      >
                        + Clonar (#)
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "custom" && (
            <CustomCombatantTab
              onAddParticipant={onAddParticipant}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
