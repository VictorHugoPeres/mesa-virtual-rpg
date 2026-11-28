"use client";

import {
  AttributeKey,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  getModifier,
  calcDefense,
  calcSpellDC,
  calcSuggestedHP,
  calcSuggestedPE,
} from "@/systems/feiticeiros-e-maldicoes";
import { WizardState } from "./wizardTypes";
import { calculateFinalAttributes } from "./wizardPayloadBuilder";
import {
  WEAPONS_CATALOG,
  UNIFORMS_CATALOG,
  SHIELDS_CATALOG,
  TOOL_KITS_CATALOG,
  GENERAL_GEAR_CATALOG,
} from "../../data/equipment";
import { WIZARD_WEAPONS, WIZARD_TOOLKITS } from "./wizardPresets";
import { Loader2, Check, Shield, Heart, Zap, Award, Swords, Sparkles, Dna } from "lucide-react";

interface StepReviewProps {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function StepReview({
  state,
  setState,
  onSubmit,
  isSubmitting,
  error,
}: StepReviewProps) {
  const isRestringido = state.origin === "Restringido" || state.specialization === "Restringido";
  const finalAttrs = calculateFinalAttributes(state);

  const conMod = getModifier(finalAttrs.CON);
  const dexMod = getModifier(finalAttrs.DEX);
  const sabMod = getModifier(finalAttrs.SAB);
  const keyAttr = state.keyAttribute || state.techniqueAttribute || "FOR";
  const keyAttrMod = getModifier(finalAttrs[keyAttr] || 10);

  const uniformItem = UNIFORMS_CATALOG.find((u) => u.id === (state.selectedUniform || "uniforme-comum"));
  const shieldItem = SHIELDS_CATALOG.find((s) => s.id === state.selectedShield);
  const uniformCa = uniformItem ? uniformItem.caBonus : 0;
  const shieldCa = shieldItem ? shieldItem.caBonus : 0;

  const maxHP = calcSuggestedHP(state.specialization, 1, conMod, state.clan);
  const maxPE = isRestringido
    ? 0
    : calcSuggestedPE(state.specialization, 1, keyAttrMod, { origin: state.origin, clan: state.clan });

  // Defesa v2.5: 10 + DES + floor(N/2) + Uniforme + Escudo
  const halfLevel = Math.floor(1 / 2); // 0 no Nível 1
  const totalDefense = 10 + dexMod + halfLevel + uniformCa + shieldCa;
  const initiative = dexMod;
  const attention = 10 + sabMod + (state.trainedSkills.includes("Percepção") ? 2 : 0);
  const spellDC = calcSpellDC(1, finalAttrs[state.techniqueAttribute] || 10);

  const weaponNames = state.selectedWeapons.map(
    (wId) => WEAPONS_CATALOG.find((w) => w.id === wId)?.name || WIZARD_WEAPONS.find((w) => w.id === wId)?.name || wId
  );
  const uniformName = uniformItem?.name || "Uniforme Comum";
  const shieldName = shieldItem?.name;
  const kitName = TOOL_KITS_CATALOG.find((k) => k.id === state.selectedToolKit)?.name || WIZARD_TOOLKITS.find((k) => k.id === state.selectedToolKit)?.name || state.selectedToolKit;
  const gearNames = (state.selectedGear || []).map(
    (gId) => GENERAL_GEAR_CATALOG.find((g) => g.id === gId)?.name || gId
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-zinc-100">Passo 7: Detalhes & Revisão Final</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Dê um nome ao seu feiticeiro, revise os cálculos automáticos e confirme a criação da ficha.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200">
          {error}
        </div>
      )}

      {/* Identificação Básica */}
      <div className="p-4 rounded-xl bg-[#14161A] border border-[#23272F] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
              Nome do Personagem *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Yuji Itadori, Maki Zenin, Megumi Fushiguro..."
              value={state.name}
              onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100 font-semibold focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
              Tipo de Personagem
            </label>
            <select
              value={state.type}
              onChange={(e) => setState((prev) => ({ ...prev, type: e.target.value as "PC" | "NPC" }))}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100 focus:outline-none"
            >
              <option value="PC">Jogador (PC)</option>
              <option value="NPC">NPC / Aliado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
            Conceito & Ideais do Personagem
          </label>
          <input
            type="text"
            placeholder="Ex: Lutar para que ninguém morra sozinho; Buscar a força absoluta..."
            value={state.concept}
            onChange={(e) => setState((prev) => ({ ...prev, concept: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[#0B0C0E] border border-[#23272F] text-zinc-100"
          />
        </div>
      </div>

      {/* Grid de Estatísticas Finais v2.5 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1 mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> PV Máximo
          </span>
          <span className="text-base font-bold text-zinc-100">{maxHP}</span>
          <span className="text-[10px] text-zinc-500 block font-mono">1º Nível</span>
        </div>

        <div className="p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1 mb-1">
            <Zap className={`w-3.5 h-3.5 ${isRestringido ? "text-amber-400" : "text-sky-400"}`} />
            {isRestringido ? "Estamina" : "PE Máximo"}
          </span>
          <span className="text-base font-bold text-zinc-100">
            {isRestringido ? "4 (1x4)" : maxPE}
          </span>
          <span className="text-[10px] text-zinc-500 block font-mono">
            {isRestringido ? "Vigor Físico" : "Energia"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1 mb-1">
            <Shield className="w-3.5 h-3.5 text-zinc-300" /> Defesa (CA)
          </span>
          <span className="text-base font-bold text-zinc-100">{totalDefense}</span>
          <span className="text-[10px] text-zinc-500 block font-mono" title="10 + DES + ⌊N/2⌋ + Uniforme + Escudo">
            10+{dexMod}+{halfLevel}+{uniformCa}+{shieldCa}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#14161A] border border-[#23272F]">
          <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> {isRestringido ? "Atenção" : "CD Técnica"}
          </span>
          <span className="text-base font-bold text-zinc-100">
            {isRestringido ? attention : spellDC}
          </span>
          <span className="text-[10px] text-zinc-500 block font-mono">
            {isRestringido ? `Inic: +${initiative}` : `10 + 2(BT) + ${getModifier(finalAttrs[state.techniqueAttribute] || 10)}`}
          </span>
        </div>
      </div>

      {/* Grid de Atributos Finais */}
      <div className="p-3.5 rounded-xl bg-[#14161A] border border-[#23272F]">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
          Atributos Finais (Base + Bônus de Origem)
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
          {ATTRIBUTE_KEYS.map((k: AttributeKey) => {
            const val = finalAttrs[k] || 10;
            const mod = getModifier(val);
            const isKey = k === keyAttr;
            return (
              <div
                key={k}
                className={`p-2 rounded-lg border ${
                  isKey ? "bg-rose-950/30 border-rose-600/60" : "bg-[#0B0C0E] border-[#23272F]"
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400 block">{ATTRIBUTE_LABELS[k]}</span>
                <span className="text-sm font-bold text-zinc-100 font-mono">{val}</span>
                <span className={`text-[10px] font-bold block ${mod >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {mod >= 0 ? `+${mod}` : mod}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo de Origem, Clã, Especialização e Talentos */}
      <div className="p-3.5 rounded-xl bg-[#14161A] border border-[#23272F] space-y-2 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Origem & Linhagem</span>
            <span className="text-zinc-200 font-semibold text-xs">
              {state.origin} {state.clan ? `(Clã ${state.clan})` : ""}
            </span>
            {state.anatomyTrait && (
              <span className="text-amber-400 text-[11px] block flex items-center gap-1 mt-0.5">
                <Dna className="w-3 h-3" /> Anatomia: {state.anatomyTrait}
              </span>
            )}
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Especialização</span>
            <span className="text-zinc-200 font-semibold text-xs">
              {state.specialization} {state.level1Choice ? `(${state.level1Choice})` : ""}
            </span>
            {state.level1FeatName && (
              <span className="text-rose-400 text-[11px] block flex items-center gap-1 mt-0.5">
                <Award className="w-3 h-3" /> {state.level1FeatName}
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-[#23272F]">
          <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">
            Perícias Treinadas ({state.trainedSkills.length}) {state.expertSkills && state.expertSkills.length > 0 ? `• Mestres: ${state.expertSkills.join(", ")}` : ""}
          </span>
          <div className="flex flex-wrap gap-1">
            {state.trainedSkills.map((sk) => {
              const isExpert = state.expertSkills?.includes(sk);
              return (
                <span
                  key={sk}
                  className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                    isExpert
                      ? "bg-amber-950/60 border-amber-800 text-amber-300 font-bold"
                      : "bg-[#0B0C0E] border-[#23272F] text-zinc-300"
                  }`}
                >
                  {sk} {isExpert ? "★ Mestre" : ""}
                </span>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-[#23272F]">
          <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">Equipamento Inicial</span>
          <p className="text-zinc-300 text-[11px]">
            <strong>Armas:</strong> {weaponNames.join(", ") || "Nenhuma"} • <strong>Proteção:</strong> {uniformName}
            {shieldName ? ` + ${shieldName}` : ""} • <strong>Kit:</strong> {kitName}
            {gearNames.length > 0 ? ` • ${gearNames.join(", ")}` : ""}
          </p>
        </div>
      </div>

      {/* Botão de Criação Final */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isSubmitting || !state.name.trim()}
          onClick={onSubmit}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Criando Feiticeiro no Banco...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Concluir e Criar Personagem (F&M v2.5)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
