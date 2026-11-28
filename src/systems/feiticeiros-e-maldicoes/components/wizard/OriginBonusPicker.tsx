"use client";

import { useEffect } from "react";
import { AttributeKey, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, Origin } from "@/systems/feiticeiros-e-maldicoes";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { FreePointsDistributor } from "./FreePointsDistributor";

interface OriginBonusPickerProps {
  origin: Origin;
  clan?: string;
  bonusPlus2: AttributeKey;
  setBonusPlus2: (attr: AttributeKey) => void;
  bonusPlus1: AttributeKey;
  setBonusPlus1: (attr: AttributeKey) => void;
  attributeBonuses?: Partial<Record<AttributeKey, number>>;
  setAttributeBonuses?: (bonuses: Partial<Record<AttributeKey, number>>) => void;
}

const CLAN_PLUS2_OPTIONS: Record<string, AttributeKey[]> = {
  Gojo: ["INT", "PRE"],
  Zenin: ["FOR", "DEX"],
  Kamo: ["CON"],
  Inumaki: ["PRE", "CON"],
};

export function OriginBonusPicker({
  origin,
  clan,
  bonusPlus2,
  setBonusPlus2,
  bonusPlus1,
  setBonusPlus1,
  attributeBonuses = {},
  setAttributeBonuses,
}: OriginBonusPickerProps) {
  const isRestringido = origin === "Restringido";
  const isSemTecnicaOrMaldicao = origin === "Sem Técnica" || origin === "Maldição";
  const isReencarnadoOrFantoche = origin === "Feiticeiro Reencarnado" || origin === "Fantoche Definitivo";
  const isCorpoMutante = origin === "Corpo Amaldiçoado Mutante";
  const isHerdado = origin === "Herdado";

  // Clã options
  const allowedPlus2 = isHerdado && clan && CLAN_PLUS2_OPTIONS[clan]
    ? CLAN_PLUS2_OPTIONS[clan]
    : (ATTRIBUTE_KEYS as readonly AttributeKey[]);

  // Garantir que bonusPlus2 seja válido para o clã
  useEffect(() => {
    if (isHerdado && clan && CLAN_PLUS2_OPTIONS[clan]) {
      const allowed = CLAN_PLUS2_OPTIONS[clan];
      if (!allowed.includes(bonusPlus2)) {
        setBonusPlus2(allowed[0]);
      }
    }
  }, [isHerdado, clan, bonusPlus2, setBonusPlus2]);

  // Sincronizar attributeBonuses para Inato / Derivado / Herdado / Feto
  useEffect(() => {
    if (!setAttributeBonuses) return;

    if (!isRestringido && !isSemTecnicaOrMaldicao && !isReencarnadoOrFantoche && !isCorpoMutante) {
      setAttributeBonuses({
        [bonusPlus2]: 2,
        [bonusPlus1]: 1,
      });
    }
  }, [origin, bonusPlus2, bonusPlus1, isRestringido, isSemTecnicaOrMaldicao, isReencarnadoOrFantoche, isCorpoMutante, setAttributeBonuses]);

  return (
    <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F] space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
          <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
          Bônus de Atributos da Origem ({origin}{clan ? ` - ${clan}` : ""})
        </h4>
        <span className="text-[10px] text-zinc-400 font-mono">Oficial v2.5</span>
      </div>

      {/* 1. Restringido: +1 FOR, +1 DES, +1 CON automáticos + 2 livres físicos */}
      {isRestringido ? (
        <div className="space-y-3">
          <div className="p-2.5 rounded-lg bg-[#0B0C0E] border border-amber-900/30 text-xs text-amber-200">
            <span className="font-bold block mb-0.5">Voto Celestial Automático:</span>
            +1 FOR, +1 DES e +1 CON automáticos (já inclusos). Abaixo, escolha onde aplicar seus +2 pontos livres adicionais:
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-zinc-300 font-medium">Bônus Adicional (+2):</span>
            <select
              value={bonusPlus2}
              onChange={(e) => {
                const val = e.target.value as AttributeKey;
                setBonusPlus2(val);
                if (setAttributeBonuses) {
                  setAttributeBonuses({
                    FOR: 1 + (val === "FOR" ? 2 : 0),
                    DEX: 1 + (val === "DEX" ? 2 : 0),
                    CON: 1 + (val === "CON" ? 2 : 0),
                  });
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs font-semibold cursor-pointer"
            >
              <option value="FOR">Força (+2 livre =&gt; +3 total)</option>
              <option value="DEX">Destreza (+2 livre =&gt; +3 total)</option>
              <option value="CON">Constituição (+2 livre =&gt; +3 total)</option>
            </select>
          </div>
        </div>
      ) : isSemTecnicaOrMaldicao && setAttributeBonuses ? (
        /* 2. Sem Técnica / Maldição: +4 pontos livres, máx +3 */
        <FreePointsDistributor
          totalPoints={4}
          maxPerAttribute={3}
          bonuses={attributeBonuses}
          onChangeBonuses={setAttributeBonuses}
        />
      ) : isReencarnadoOrFantoche && setAttributeBonuses ? (
        /* 3. Reencarnado / Fantoche: +3 pontos livres */
        <FreePointsDistributor
          totalPoints={3}
          maxPerAttribute={3}
          bonuses={attributeBonuses}
          onChangeBonuses={setAttributeBonuses}
        />
      ) : isCorpoMutante && setAttributeBonuses ? (
        /* 4. Corpo Mutante: +2 pontos livres */
        <FreePointsDistributor
          totalPoints={2}
          maxPerAttribute={2}
          bonuses={attributeBonuses}
          onChangeBonuses={setAttributeBonuses}
        />
      ) : (
        /* 5. Inato, Herdado, Derivado, Feto: +2 e +1 padrão */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Bônus Primário (+2): {isHerdado && clan ? `(Restrito ao ${clan})` : ""}
            </label>
            <select
              value={bonusPlus2}
              onChange={(e) => {
                const val = e.target.value as AttributeKey;
                setBonusPlus2(val);
                if (val === bonusPlus1) {
                  const fallback = (ATTRIBUTE_KEYS as readonly AttributeKey[]).find((k) => k !== val) || "CON";
                  setBonusPlus1(fallback);
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs font-semibold cursor-pointer"
            >
              {allowedPlus2.map((k) => (
                <option key={k} value={k}>
                  {ATTRIBUTE_LABELS[k]} (+2)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Bônus Secundário (+1):</label>
            <select
              value={bonusPlus1}
              onChange={(e) => setBonusPlus1(e.target.value as AttributeKey)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-200 text-xs font-semibold cursor-pointer"
            >
              {(ATTRIBUTE_KEYS as readonly AttributeKey[])
                .filter((k) => k !== bonusPlus2)
                .map((k) => (
                  <option key={k} value={k}>
                    {ATTRIBUTE_LABELS[k]} (+1)
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
