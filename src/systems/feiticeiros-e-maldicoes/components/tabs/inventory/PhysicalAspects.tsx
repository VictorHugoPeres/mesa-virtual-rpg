"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { User } from "lucide-react";

interface PhysicalAspectsProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function PhysicalAspects({ data, onChange }: PhysicalAspectsProps) {
  const p = data.personal;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold">Aspectos Pessoais & Aparência</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Idade
          </label>
          <input
            type="text"
            placeholder="Ex: 27 anos"
            value={p.age}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, age: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Gênero
          </label>
          <input
            type="text"
            placeholder="Ex: Masculino"
            value={p.gender}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, gender: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Altura
          </label>
          <input
            type="text"
            placeholder="Ex: 1,84m"
            value={p.height}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, height: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Peso
          </label>
          <input
            type="text"
            placeholder="Ex: 80kg"
            value={p.weight}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, weight: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Aura de Energia
          </label>
          <input
            type="text"
            placeholder="Ex: Azul elétrica, densa"
            value={p.aura}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, aura: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Olhos
          </label>
          <input
            type="text"
            placeholder="Ex: Castanhos"
            value={p.eyes}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, eyes: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Cabelos
          </label>
          <input
            type="text"
            placeholder="Ex: Loiros curtos"
            value={p.hair}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, hair: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Pele
          </label>
          <input
            type="text"
            placeholder="Ex: Clara"
            value={p.skin}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, skin: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
            Vestimenta
          </label>
          <input
            type="text"
            placeholder="Ex: Terno bege com gravata de bolinhas"
            value={p.clothing}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                personal: { ...prev.personal, clothing: val },
              }));
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>
      </div>
    </div>
  );
}
