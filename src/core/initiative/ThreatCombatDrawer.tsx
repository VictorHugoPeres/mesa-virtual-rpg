"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Skull, Swords, ExternalLink, Shield, Heart, Zap, X, Dices } from "lucide-react";
import { Portal } from "@/core/ui";
import { useDice } from "@/core/dice/DiceContext";
import { FMCharacterData, parseCharacterData } from "@/systems/feiticeiros-e-maldicoes/schemas";
import { ATTRIBUTE_KEYS } from "@/systems/feiticeiros-e-maldicoes/constants";
import { getModifier } from "@/systems/feiticeiros-e-maldicoes/formulas";

interface CampaignCharItem {
  id: string;
  name: string;
  type: string;
  data: string;
}

interface ThreatCombatDrawerProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  characterId?: string;
  character?: CampaignCharItem;
  participantName?: string;
}

export function ThreatCombatDrawer({
  campaignId,
  isOpen,
  onClose,
  characterId,
  character,
  participantName,
}: ThreatCombatDrawerProps) {
  const { openRoller } = useDice();
  const [charData, setCharData] = useState<FMCharacterData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (character && character.data) {
      try {
        setCharData(parseCharacterData(character.data));
        return;
      } catch (err) {
        console.warn("Erro ao fazer parse dos dados da ameaça:", err);
      }
    }

    if (characterId) {
      setLoading(true);
      fetch(`/api/characters/${characterId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.character && data.character.data) {
            setCharData(parseCharacterData(data.character.data));
          }
        })
        .catch((err) => console.warn("Erro ao buscar dados da ameaça:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, character, characterId]);

  if (!isOpen) return null;

  const displayName = participantName || character?.name || "Ameaça";

  function handleAttackRoll(weaponName: string, bonus: number, damageFormula?: string) {
    openRoller({
      label: `${displayName} — ${weaponName} (Ataque)`,
      modifier: bonus,
      defaultDice: "1d20",
      roller: displayName,
      characterId,
      campaignId,
      linkedDamage: damageFormula?.trim() || undefined,
    });
  }

  function handleDamageRoll(weaponName: string, damageFormula: string) {
    openRoller({
      label: `${displayName} — Dano (${weaponName})`,
      modifier: 0,
      defaultDice: damageFormula || "1d6",
      roller: displayName,
      characterId,
      campaignId,
    });
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border-l border-white/15 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-800/60 text-red-400">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/60">
                  {charData?.grade || "Ameaça"}
                </span>
                {characterId && (
                  <Link
                    href={`/mestre/${campaignId}/fichas/${characterId}`}
                    target="_blank"
                    className="text-zinc-400 hover:text-white"
                    title="Abrir ficha completa em nova aba"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              <h3 className="font-bold text-sm text-white truncate max-w-[220px]">
                {displayName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {loading && (
            <div className="text-center py-8 text-zinc-400 animate-pulse">
              Carregando ficha da ameaça...
            </div>
          )}

          {!loading && charData && (
            <>
              {/* Estatísticas Chave */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-900/80 p-2 rounded-xl border border-white/10">
                  <span className="flex items-center justify-center gap-1 text-[10px] text-red-400 font-medium mb-0.5">
                    <Heart className="w-3 h-3" /> PV Máx
                  </span>
                  <span className="font-bold text-sm text-white">{charData.hp?.max || 20}</span>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-xl border border-white/10">
                  <span className="flex items-center justify-center gap-1 text-[10px] text-blue-400 font-medium mb-0.5">
                    <Shield className="w-3 h-3" /> Defesa
                  </span>
                  <span className="font-bold text-sm text-white">{charData.defense?.total ?? 10}</span>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-xl border border-white/10">
                  <span className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-medium mb-0.5">
                    <Zap className="w-3 h-3" /> Deslocamento
                  </span>
                  <span className="font-bold text-sm text-white">{charData.movement || 9}m</span>
                </div>
              </div>

              {/* Atributos com Modificadores */}
              <div>
                <span className="block text-[11px] font-bold text-zinc-400 mb-1.5">Atributos</span>
                <div className="grid grid-cols-6 gap-1 text-center">
                  {ATTRIBUTE_KEYS.map((k) => {
                    const val = charData.attributes?.[k] ?? 10;
                    const mod = getModifier(val);
                    return (
                      <div key={k} className="bg-zinc-900/90 py-1.5 px-1 rounded-lg border border-white/10">
                        <span className="block text-[9px] text-zinc-400 font-bold">{k}</span>
                        <span className="font-mono font-bold text-white text-xs">
                          {mod >= 0 ? `+${mod}` : mod}
                        </span>
                        <span className="block text-[9px] text-zinc-500">({val})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ataques & Ações Clicáveis */}
              <div>
                <span className="block text-[11px] font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  Ações de Ataque & Dano (Clique para rolar)
                </span>

                {charData.weapons && charData.weapons.length > 0 ? (
                  <div className="space-y-1.5">
                    {charData.weapons.map((w, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 bg-zinc-900/90 p-2.5 rounded-xl border border-white/10 hover:border-red-500/40 transition-colors"
                      >
                        <div className="truncate flex-1">
                          <span className="font-bold text-white text-xs">{w.name}</span>
                          {w.range && <span className="text-[10px] text-zinc-400 ml-1.5">({w.range})</span>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAttackRoll(w.name, w.attackBonus, w.damage)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold text-[11px] border border-blue-500/40 cursor-pointer transition-colors"
                            title="Rolar Teste de Ataque (1d20 + bônus)"
                          >
                            <Dices className="w-3 h-3" />
                            <span>{w.attackBonus >= 0 ? `+${w.attackBonus}` : w.attackBonus}</span>
                          </button>
                          {w.damage && (
                            <button
                              type="button"
                              onClick={() => handleDamageRoll(w.name, w.damage)}
                              className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold text-[11px] border border-red-500/40 cursor-pointer transition-colors"
                              title="Rolar Fórmula de Dano"
                            >
                              {w.damage}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 italic text-[11px] bg-zinc-900/50 p-2 rounded-lg">
                    Nenhum ataque cadastrado para esta ameaça.
                  </p>
                )}
              </div>

              {/* Habilidades & Características */}
              {charData.features && charData.features.length > 0 && (
                <div>
                  <span className="block text-[11px] font-bold text-zinc-400 mb-1.5">
                    Características & Habilidades Especiais
                  </span>
                  <div className="space-y-2">
                    {charData.features.map((f, idx) => (
                      <div key={idx} className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/10">
                        {f.name && <span className="font-bold text-xs text-amber-300 block mb-0.5">{f.name}</span>}
                        <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-line">
                          {f.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
