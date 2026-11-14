"use client";

import {
  ATTRIBUTE_KEYS,
  getModifier,
} from "@/systems/feiticeiros-e-maldicoes";
import { Trash2, Shield, Heart, Footprints } from "lucide-react";

export interface InvocationItem {
  id: string;
  name: string;
  grade: string;
  hpCurrent: number;
  hpMax: number;
  ca: number;
  movement: number;
  attributes: Record<string, number>;
  actionsAndTraits: string;
}

interface InvocationCardProps {
  inv: InvocationItem;
  idx: number;
  onUpdate: (idx: number, updater: (prev: InvocationItem) => InvocationItem) => void;
  onRemove: (idx: number) => void;
}

export function InvocationCard({ inv, idx, onUpdate, onRemove }: InvocationCardProps) {
  return (
    <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] space-y-4 shadow-sm">
      {/* Header da invocação */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={inv.name}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(idx, (prev) => ({ ...prev, name: val }));
            }}
            className="w-full text-base font-bold bg-transparent border-b border-transparent focus:border-indigo-500 text-[var(--text-primary)]"
          />
          <input
            type="text"
            placeholder="Grau (ex: 3° Grau)"
            value={inv.grade}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(idx, (prev) => ({ ...prev, grade: val }));
            }}
            className="text-xs text-[var(--text-secondary)] bg-transparent w-32"
          />
        </div>

        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
          title="Remover invocação"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Status rápidos: PV, CA, Movimento */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center">
          <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-red-400 uppercase">
            <Heart className="w-3 h-3" /> PV
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <input
              type="number"
              value={inv.hpCurrent}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onUpdate(idx, (prev) => ({ ...prev, hpCurrent: val }));
              }}
              className="w-10 text-center font-bold text-sm bg-transparent"
            />
            <span className="text-xs text-[var(--text-muted)]">/</span>
            <input
              type="number"
              value={inv.hpMax}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onUpdate(idx, (prev) => ({ ...prev, hpMax: val }));
              }}
              className="w-10 text-center text-xs text-[var(--text-muted)] bg-transparent"
            />
          </div>
        </div>

        <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center">
          <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-400 uppercase">
            <Shield className="w-3 h-3" /> Defesa
          </span>
          <input
            type="number"
            value={inv.ca}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              onUpdate(idx, (prev) => ({ ...prev, ca: val }));
            }}
            className="w-full text-center font-bold text-sm bg-transparent mt-1"
          />
        </div>

        <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-center">
          <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-cyan-400 uppercase">
            <Footprints className="w-3 h-3" /> Mov.
          </span>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            <input
              type="number"
              value={inv.movement}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onUpdate(idx, (prev) => ({ ...prev, movement: val }));
              }}
              className="w-8 text-center font-bold text-sm bg-transparent"
            />
            <span className="text-[10px] text-[var(--text-muted)]">m</span>
          </div>
        </div>
      </div>

      {/* Atributos da Invocação */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Atributos
        </p>
        <div className="grid grid-cols-6 gap-1 text-center">
          {ATTRIBUTE_KEYS.map((k) => {
            const val = inv.attributes[k] ?? 10;
            const mod = getModifier(val);
            return (
              <div
                key={k}
                className="p-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
              >
                <p className="text-[9px] font-bold text-[var(--text-muted)]">
                  {k}
                </p>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => {
                    const num = parseInt(e.target.value) || 0;
                    onUpdate(idx, (prev) => ({
                      ...prev,
                      attributes: { ...prev.attributes, [k]: num },
                    }));
                  }}
                  className="w-full text-center text-xs font-bold bg-transparent"
                />
                <p
                  className={`text-[9px] font-semibold ${
                    mod >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {mod >= 0 ? `+${mod}` : mod}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ações e Características */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Ações & Características Especiais
        </label>
        <textarea
          rows={3}
          placeholder="Ataques, habilidades passivas, regras de controle..."
          value={inv.actionsAndTraits}
          onChange={(e) => {
            const val = e.target.value;
            onUpdate(idx, (prev) => ({ ...prev, actionsAndTraits: val }));
          }}
          className="w-full text-xs p-2.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
        />
      </div>
    </div>
  );
}
