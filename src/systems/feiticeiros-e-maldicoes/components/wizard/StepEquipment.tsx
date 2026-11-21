"use client";

import { WIZARD_WEAPONS, WIZARD_TOOLKITS } from "./wizardPresets";
import { Shield, Swords, Briefcase, Check } from "lucide-react";

interface StepEquipmentProps {
  selectedWeapons: string[];
  setSelectedWeapons: (weapons: string[]) => void;
  selectedToolKit: string;
  setSelectedToolKit: (kit: string) => void;
}

export function StepEquipment({
  selectedWeapons,
  setSelectedWeapons,
  selectedToolKit,
  setSelectedToolKit,
}: StepEquipmentProps) {
  function toggleWeapon(weaponId: string) {
    if (selectedWeapons.includes(weaponId)) {
      setSelectedWeapons(selectedWeapons.filter((w) => w !== weaponId));
    } else {
      if (selectedWeapons.length < 2) {
        setSelectedWeapons([...selectedWeapons, weaponId]);
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">Passo 6: Equipamentos Iniciais</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Conforme as regras do livro de Feiticeiros & Maldições, cada personagem começa com 2 armas/equipamentos de custo 1, um uniforme comum e 1 kit de ferramentas.
        </p>
      </div>

      {/* Armas Iniciais (Escolher 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-blue-400" />
            Armas & Itens de Combate (Escolha 2)
          </span>
          <span className="text-[11px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
            {selectedWeapons.length} / 2 selecionadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {WIZARD_WEAPONS.map((wpn) => {
            const isSelected = selectedWeapons.includes(wpn.id);
            const canSelect = isSelected || selectedWeapons.length < 2;

            return (
              <button
                key={wpn.id}
                type="button"
                disabled={!canSelect}
                onClick={() => toggleWeapon(wpn.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? "bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/50"
                    : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-blue-400/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-primary)]">{wpn.name}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-900/60 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Escolhido
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-tight mb-2">
                    {wpn.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border-default)] text-[10px] text-[var(--text-muted)] font-medium">
                  <span>Dano: {wpn.damage}</span>
                  <span>{wpn.properties}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Uniforme Padrão */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] block">Uniforme Jujutsu Comum (Incluído)</span>
            <span className="text-[11px] text-[var(--text-muted)]">Traje reforçado que fornece o cálculo base de Defesa (10 + DES).</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          Equipado
        </span>
      </div>

      {/* Kits de Ferramentas (Escolher 1) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          Kit de Ferramentas (Escolha 1)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {WIZARD_TOOLKITS.map((kit) => {
            const isSelected = selectedToolKit === kit.id;

            return (
              <button
                key={kit.id}
                type="button"
                onClick={() => setSelectedToolKit(kit.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50"
                    : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-amber-400/60"
                }`}
              >
                <div className="mt-0.5">
                  {isSelected ? (
                    <div className="w-4 h-4 rounded bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded border border-[var(--border-default)] shrink-0" />
                  )}
                </div>

                <div>
                  <span className="font-bold text-xs text-[var(--text-primary)] block mb-0.5">{kit.name}</span>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-tight">{kit.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
