"use client";

import { useState, useMemo } from "react";
import { Swords, Shield, Briefcase, Search, Sparkles } from "lucide-react";
import { Specialization, AttributeKey } from "@/systems/feiticeiros-e-maldicoes";
import {
  WEAPONS_CATALOG,
  UNIFORMS_CATALOG,
  SHIELDS_CATALOG,
  TOOL_KITS_CATALOG,
  GENERAL_GEAR_CATALOG,
  checkEquipmentEligibility,
  STARTING_QUOTA,
} from "../../data/equipment";
import { EquipmentQuotaSummary } from "./EquipmentQuotaSummary";
import { EquipmentCard } from "./EquipmentCard";

interface StepEquipmentProps {
  specialization?: Specialization;
  attributes?: Record<AttributeKey, number>;
  selectedWeapons: string[];
  setSelectedWeapons: (weapons: string[]) => void;
  selectedUniform?: string;
  setSelectedUniform?: (u: string) => void;
  selectedShield?: string;
  setSelectedShield?: (s: string) => void;
  selectedToolKit: string;
  setSelectedToolKit: (kit: string) => void;
  selectedGear?: string[];
  setSelectedGear?: (g: string[]) => void;
}

export function StepEquipment({
  specialization = "Lutador",
  attributes = { FOR: 10, DEX: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
  selectedWeapons,
  setSelectedWeapons,
  selectedUniform = "uniforme-comum",
  setSelectedUniform,
  selectedShield = "",
  setSelectedShield,
  selectedToolKit,
  setSelectedToolKit,
  selectedGear = [],
  setSelectedGear,
}: StepEquipmentProps) {
  const [activeTab, setActiveTab] = useState<"weapons" | "protection" | "kits">("weapons");
  const [search, setSearch] = useState("");

  // Cálculo da cota gasta
  const spentQuota = useMemo(() => {
    let total = 0;
    // Armas
    for (const wId of selectedWeapons) {
      const item = WEAPONS_CATALOG.find((w) => w.id === wId);
      if (item) total += item.cost;
    }
    // Uniforme (uniforme-comum é grátis custo 0)
    if (selectedUniform && selectedUniform !== "uniforme-comum") {
      const u = UNIFORMS_CATALOG.find((x) => x.id === selectedUniform);
      if (u) total += u.cost;
    }
    // Escudo
    if (selectedShield) {
      const s = SHIELDS_CATALOG.find((x) => x.id === selectedShield);
      if (s) total += s.cost;
    }
    // Equipamentos gerais
    for (const gId of selectedGear) {
      const g = GENERAL_GEAR_CATALOG.find((x) => x.id === gId);
      if (g) total += g.cost;
    }
    return total;
  }, [selectedWeapons, selectedUniform, selectedShield, selectedGear]);

  // Handlers de seleção
  function toggleWeapon(wId: string) {
    if (selectedWeapons.includes(wId)) {
      setSelectedWeapons(selectedWeapons.filter((id) => id !== wId));
    } else {
      setSelectedWeapons([...selectedWeapons, wId]);
    }
  }

  function toggleShield(sId: string) {
    if (selectedShield === sId) {
      setSelectedShield?.("");
    } else {
      setSelectedShield?.(sId);
    }
  }

  function toggleGear(gId: string) {
    if (selectedGear.includes(gId)) {
      setSelectedGear?.(selectedGear.filter((id) => id !== gId));
    } else {
      setSelectedGear?.([...selectedGear, gId]);
    }
  }

  const filteredWeapons = useMemo(() => {
    const q = search.toLowerCase();
    return WEAPONS_CATALOG.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.properties.some((p) => p.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          Passo 6: Equipamentos Iniciais & Arsenal Jujutsu
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Escolha seu armamento, uniforme de proteção e suprimentos respeitando sua cota inicial e proficiências.
        </p>
      </div>

      <EquipmentQuotaSummary specialization={specialization} spentQuota={spentQuota} />

      {/* Abas e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("weapons")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "weapons"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Swords className="w-3.5 h-3.5" /> Armas ({selectedWeapons.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("protection")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "protection"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Proteção & Escudos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kits")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "kits"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Kits & Geral
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar equipamento ou propriedade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Conteúdo da Aba Armas */}
      {activeTab === "weapons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredWeapons.map((wpn) => {
            const isSelected = selectedWeapons.includes(wpn.id);
            const elig = checkEquipmentEligibility(
              { cost: wpn.cost, kind: "Arma", category: wpn.category, minStrength: wpn.minStrength },
              specialization,
              attributes,
              spentQuota,
              isSelected
            );
            return (
              <EquipmentCard
                key={wpn.id}
                id={wpn.id}
                name={wpn.name}
                categoryBadge={wpn.category}
                cost={wpn.cost}
                highlightStat={`Dano: ${wpn.damage} (${wpn.damageType}) • Crítico: ${wpn.critical}`}
                slots={wpn.slots}
                properties={[wpn.range, ...wpn.properties]}
                description={wpn.description}
                isSelected={isSelected}
                canSelect={elig.isEligible}
                hasProficiency={elig.hasProficiency}
                warning={elig.warning || elig.error}
                onToggle={() => toggleWeapon(wpn.id)}
              />
            );
          })}
        </div>
      )}

      {/* Conteúdo da Aba Proteção & Escudos */}
      {activeTab === "protection" && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
              Uniformes e Revestimentos (Escolha 1)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {UNIFORMS_CATALOG.map((u) => {
                const isSelected = (selectedUniform || "uniforme-comum") === u.id;
                const canSelect = isSelected || spentQuota + u.cost <= STARTING_QUOTA.maxBudget;
                return (
                  <EquipmentCard
                    key={u.id}
                    id={u.id}
                    name={u.name}
                    categoryBadge="Uniforme"
                    cost={u.cost}
                    isFree={u.cost === 0}
                    highlightStat={`Defesa +${u.caBonus} • Penalidade ${u.penalty || 0}`}
                    slots={u.slots}
                    properties={u.properties}
                    description={u.description}
                    isSelected={isSelected}
                    canSelect={canSelect}
                    onToggle={() => setSelectedUniform?.(u.id)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
              Escudos de Confronto (Opcional)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {SHIELDS_CATALOG.map((s) => {
                const isSelected = selectedShield === s.id;
                const elig = checkEquipmentEligibility(
                  { cost: s.cost, kind: "Escudo", shieldType: s.shieldType, minStrength: s.minStrength },
                  specialization,
                  attributes,
                  spentQuota,
                  isSelected
                );
                return (
                  <EquipmentCard
                    key={s.id}
                    id={s.id}
                    name={s.name}
                    categoryBadge="Escudo"
                    cost={s.cost}
                    highlightStat={`Defesa +${s.caBonus} • RD ${s.rdBonus}`}
                    slots={s.slots}
                    properties={s.properties}
                    description={s.description}
                    isSelected={isSelected}
                    canSelect={elig.isEligible}
                    hasProficiency={elig.hasProficiency}
                    warning={elig.warning || elig.error}
                    onToggle={() => toggleShield(s.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba Kits & Geral */}
      {activeTab === "kits" && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
              Kit de Ferramentas / Ofício (1 Grátis Incluído)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {TOOL_KITS_CATALOG.map((kit) => {
                const isSelected = selectedToolKit === kit.id;
                return (
                  <EquipmentCard
                    key={kit.id}
                    id={kit.id}
                    name={kit.name}
                    categoryBadge="Kit de Ferramentas"
                    cost={1}
                    isFree={true}
                    highlightStat={kit.utility}
                    slots={kit.slots}
                    description={kit.description}
                    isSelected={isSelected}
                    canSelect={true}
                    onToggle={() => setSelectedToolKit(kit.id)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
              Equipamento Geral & Acessórios Táticos
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {GENERAL_GEAR_CATALOG.map((gear) => {
                const isSelected = selectedGear.includes(gear.id);
                const canSelect = isSelected || spentQuota + gear.cost <= STARTING_QUOTA.maxBudget;
                return (
                  <EquipmentCard
                    key={gear.id}
                    id={gear.id}
                    name={gear.name}
                    categoryBadge="Geral"
                    cost={gear.cost}
                    highlightStat={gear.utility}
                    slots={gear.slots}
                    description={gear.description}
                    isSelected={isSelected}
                    canSelect={canSelect}
                    onToggle={() => toggleGear(gear.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
