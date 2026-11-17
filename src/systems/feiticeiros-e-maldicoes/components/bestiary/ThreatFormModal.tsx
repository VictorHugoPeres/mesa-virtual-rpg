"use client";

import { useState } from "react";
import { Skull, X, Loader2 } from "lucide-react";
import { createDefaultCharacter } from "../../defaultCharacter";
import { AttributeKey } from "../../constants";
import { getModifier } from "../../formulas";
import { ThreatAttributesForm } from "./ThreatAttributesForm";
import { ThreatAttacksForm, AttackItem } from "./ThreatAttacksForm";

interface ThreatFormModalProps {
  campaignId: string;
  onSuccess: () => void;
}

export function ThreatFormModal({ campaignId, onSuccess }: ThreatFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("4° Grau");
  const [maxHp, setMaxHp] = useState(25);
  const [defense, setDefense] = useState(13);
  const [movement, setMovement] = useState(9);
  const [attributes, setAttributes] = useState<Record<AttributeKey, number>>({
    FOR: 12,
    DEX: 12,
    CON: 12,
    INT: 8,
    SAB: 10,
    CAR: 8,
  });

  const [attacks, setAttacks] = useState<AttackItem[]>([
    { id: "1", name: "Golpe Amaldiçoado", attackBonus: 4, damage: "1d8+2" },
  ]);
  const [traits, setTraits] = useState("");

  function handleAttrChange(key: AttributeKey, val: number) {
    setAttributes((prev) => ({ ...prev, [key]: val }));
  }

  function addAttack() {
    setAttacks((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "Novo Ataque", attackBonus: 3, damage: "1d6+1" },
    ]);
  }

  function removeAttack(id: string) {
    setAttacks((prev) => prev.filter((a) => a.id !== id));
  }

  function updateAttack(id: string, field: keyof AttackItem, value: string | number) {
    setAttacks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const charData = createDefaultCharacter(name.trim(), "NPC", "Lutador", "Inato");
      charData.grade = grade;
      charData.hp = { current: maxHp, max: maxHp, temp: 0 };
      charData.defense = {
        natural: defense,
        uniform: 0,
        shield: 0,
        dexMod: getModifier(attributes.DEX),
        other: 0,
        total: defense,
      };
      charData.movement = movement;
      charData.attributes = attributes;
      charData.initiative = getModifier(attributes.DEX);

      charData.weapons = attacks.map((a) => ({
        name: a.name,
        attackBonus: a.attackBonus,
        damage: a.damage,
        critical: "20",
        damageType: "Amaldiçoado",
        range: "1.5m",
      }));

      if (traits.trim()) {
        charData.features = [
          {
            id: Date.now().toString(),
            name: "Habilidades da Maldição",
            current: 0,
            max: 0,
            cost: "",
            description: traits.trim(),
          },
        ];
      }

      const res = await fetch(`/api/campaigns/${campaignId}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type: "THREAT",
          data: charData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao cadastrar ameaça");
      }

      setIsOpen(false);
      setName("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all cursor-pointer shadow-xs"
      >
        <Skull className="w-3.5 h-3.5 text-red-400" />
        + Nova Ameaça
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-default)]">
              <h3 className="text-base font-semibold flex items-center gap-2 text-red-400">
                <Skull className="w-4 h-4" />
                Cadastrar Maldição / Ameaça (F&M)
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              {error && (
                <div className="p-3 text-xs rounded bg-red-950/60 border border-red-800 text-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    Nome da Ameaça
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maldição Feto Híbrido..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                    autoFocus
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    Grau da Maldição
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                  >
                    <option value="4° Grau">4° Grau</option>
                    <option value="3° Grau">3° Grau</option>
                    <option value="2° Grau">2° Grau</option>
                    <option value="1° Grau">1° Grau</option>
                    <option value="Grau Especial">Grau Especial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    PV Máximo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxHp}
                    onChange={(e) => setMaxHp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    Defesa (CA)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={defense}
                    onChange={(e) => setDefense(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                    Deslocamento (m)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={movement}
                    onChange={(e) => setMovement(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Atributos Modulares */}
              <ThreatAttributesForm
                attributes={attributes}
                onChange={handleAttrChange}
              />

              {/* Ataques Clicáveis Modulares */}
              <ThreatAttacksForm
                attacks={attacks}
                onAddAttack={addAttack}
                onRemoveAttack={removeAttack}
                onUpdateAttack={updateAttack}
              />

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1">
                  Características / Efeitos Amaldiçoados
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Regeneração Passiva, Domínio Incompleto..."
                  value={traits}
                  onChange={(e) => setTraits(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-default)]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {loading ? "Cadastrando..." : "Cadastrar Maldição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
