"use client";

import Link from "next/link";
import { Skull, Swords, ExternalLink, Shield, Heart, Zap, PlusCircle } from "lucide-react";
import { useDice } from "@/core/dice/DiceContext";
import { FMCharacterData, parseCharacterData } from "../../schemas";
import { ATTRIBUTE_KEYS } from "../../constants";
import { getModifier } from "../../formulas";

interface ThreatCardProps {
  campaignId: string;
  threat: {
    id: string;
    name: string;
    type: string;
    data: string;
  };
  onCloneToCombat?: (charData: FMCharacterData, threatName: string, threatId: string) => void;
}

export function ThreatCard({ campaignId, threat, onCloneToCombat }: ThreatCardProps) {
  const { openRoller } = useDice();

  let parsed: FMCharacterData;
  try {
    parsed = parseCharacterData(threat.data);
  } catch {
    return null;
  }

  function handleAttackRoll(name: string, bonus: number) {
    openRoller({
      label: `${threat.name} — ${name}`,
      modifier: bonus,
      defaultDice: "1d20",
      roller: threat.name,
      characterId: threat.id,
      campaignId,
    });
  }

  function handleDamageRoll(name: string, damageFormula: string) {
    openRoller({
      label: `${threat.name} — Dano (${name})`,
      modifier: 0,
      defaultDice: damageFormula || "1d6",
      roller: threat.name,
      characterId: threat.id,
      campaignId,
    });
  }

  return (
    <div className="p-4 rounded-xl border border-red-950/60 bg-[var(--bg-card)] hover:border-red-800/80 transition-all shadow-xs flex flex-col justify-between">
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 inline-block mb-1">
              {parsed.grade || "Ameaça"}
            </span>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-red-500 shrink-0" />
              {threat.name}
            </h4>
          </div>

          <div className="flex items-center gap-1">
            {onCloneToCombat && (
              <button
                type="button"
                onClick={() => onCloneToCombat(parsed, threat.name, threat.id)}
                className="p-1.5 rounded-lg text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 transition-colors cursor-pointer"
                title="Clonar para o combate ativo"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}
            <Link
              href={`/mestre/${campaignId}/fichas/${threat.id}`}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-secondary)] transition-colors"
              title="Abrir ficha completa"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Estatísticas Chave */}
        <div className="grid grid-cols-3 gap-2 my-2.5 text-center text-xs">
          <div className="bg-[var(--bg-secondary)] p-1.5 rounded border border-[var(--border-default)]">
            <span className="flex items-center justify-center gap-1 text-[10px] text-red-400 font-medium">
              <Heart className="w-3 h-3" /> PV
            </span>
            <span className="font-bold">{parsed.hp.max}</span>
          </div>
          <div className="bg-[var(--bg-secondary)] p-1.5 rounded border border-[var(--border-default)]">
            <span className="flex items-center justify-center gap-1 text-[10px] text-blue-400 font-medium">
              <Shield className="w-3 h-3" /> Defesa
            </span>
            <span className="font-bold">{parsed.defense?.total ?? 10}</span>
          </div>
          <div className="bg-[var(--bg-secondary)] p-1.5 rounded border border-[var(--border-default)]">
            <span className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-medium">
              <Zap className="w-3 h-3" /> Desloc.
            </span>
            <span className="font-bold">{parsed.movement || 9}m</span>
          </div>
        </div>

        {/* Atributos Resumidos */}
        <div className="grid grid-cols-6 gap-1 my-2 text-center text-[10px]">
          {ATTRIBUTE_KEYS.map((k) => {
            const val = parsed.attributes[k] ?? 10;
            const mod = getModifier(val);
            return (
              <div key={k} className="bg-[var(--bg-secondary)] py-1 rounded">
                <span className="block text-[9px] text-[var(--text-muted)]">{k}</span>
                <span className="font-semibold">{mod >= 0 ? `+${mod}` : mod}</span>
              </div>
            );
          })}
        </div>

        {/* Ataques Clicáveis */}
        {parsed.weapons && parsed.weapons.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
              <Swords className="w-3 h-3 text-red-400" /> Ações / Ataques
            </p>
            {parsed.weapons.map((w, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-1 text-xs bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded border border-[var(--border-default)]"
              >
                <span className="font-medium truncate flex-1">{w.name}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAttackRoll(w.name, w.attackBonus)}
                    className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 font-bold text-[11px] cursor-pointer"
                    title="Rolar Ataque (d20)"
                  >
                    {w.attackBonus >= 0 ? `+${w.attackBonus}` : w.attackBonus}
                  </button>
                  {w.damage && (
                    <button
                      type="button"
                      onClick={() => handleDamageRoll(w.name, w.damage)}
                      className="px-2 py-0.5 rounded bg-red-600/30 text-red-300 hover:bg-red-600/50 font-medium text-[11px] cursor-pointer"
                      title="Rolar Dano"
                    >
                      {w.damage}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Habilidades Resumidas */}
        {parsed.features && parsed.features.length > 0 && (
          <div className="mt-2.5 text-[11px] text-[var(--text-secondary)] line-clamp-2 italic">
            {parsed.features[0].description}
          </div>
        )}
      </div>
    </div>
  );
}
