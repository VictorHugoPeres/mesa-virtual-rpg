"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { Package, Plus, Trash2 } from "lucide-react";

interface InventoryListProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function InventoryList({ data, onChange }: InventoryListProps) {
  const items = data.inventory || [];
  const strVal = data.attributes["FOR"] ?? 10;
  const maxCapacity = Math.max(10, strVal * 2);
  const currentSlots = items.reduce((acc, it) => acc + (it.slots || 0) * (it.quantity || 1), 0);

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-base font-semibold">Inventário & Equipamentos</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Capacidade de Carga: {currentSlots} / {maxCapacity} espaços (baseado em Força: {strVal})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden hidden sm:block">
            <div
              className={`h-full transition-all duration-300 ${
                currentSlots > maxCapacity ? "bg-red-500" : "bg-amber-500"
              }`}
              style={{
                width: `${Math.min(100, (currentSlots / (maxCapacity || 1)) * 100)}%`,
              }}
            />
          </div>

          <button
            onClick={() => {
              onChange((prev) => ({
                ...prev,
                inventory: [
                  ...prev.inventory,
                  {
                    id: Math.random().toString(36).substring(2, 9),
                    name: "Novo Item",
                    quantity: 1,
                    slots: 1,
                    cost: "1",
                    description: "",
                  },
                ],
              }));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Adicionar Item
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] py-6 text-center">
          Inventário vazio. Clique em &quot;Adicionar Item&quot; para registrar uniformes, ferramentas amaldiçoadas ou kits.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2">Item</th>
                <th className="py-2 px-2 text-center">Qtd.</th>
                <th className="py-2 px-2 text-center">Espaços</th>
                <th className="py-2 px-2 text-center">Custo</th>
                <th className="py-2 px-2">Descrição / Efeito</th>
                <th className="py-2 px-2 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-[var(--bg-secondary)]/50">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const inv = [...prev.inventory];
                          inv[idx] = { ...inv[idx], name: val };
                          return { ...prev, inventory: inv };
                        });
                      }}
                      className="w-full px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] font-medium"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        onChange((prev) => {
                          const inv = [...prev.inventory];
                          inv[idx] = { ...inv[idx], quantity: val };
                          return { ...prev, inventory: inv };
                        });
                      }}
                      className="w-12 text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min={0}
                      value={item.slots}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onChange((prev) => {
                          const inv = [...prev.inventory];
                          inv[idx] = { ...inv[idx], slots: val };
                          return { ...prev, inventory: inv };
                        });
                      }}
                      className="w-12 text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-amber-300"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="text"
                      value={item.cost}
                      placeholder="1"
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const inv = [...prev.inventory];
                          inv[idx] = { ...inv[idx], cost: val };
                          return { ...prev, inventory: inv };
                        });
                      }}
                      className="w-14 text-center py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      placeholder="Propriedades especiais, encantamentos..."
                      value={item.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange((prev) => {
                          const inv = [...prev.inventory];
                          inv[idx] = { ...inv[idx], description: val };
                          return { ...prev, inventory: inv };
                        });
                      }}
                      className="w-full px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                    />
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={() => {
                        onChange((prev) => ({
                          ...prev,
                          inventory: prev.inventory.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
