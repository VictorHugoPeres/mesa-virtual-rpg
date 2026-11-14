"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { Flame } from "lucide-react";

interface DomainExpansionCardProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function DomainExpansionCard({ data, onChange }: DomainExpansionCardProps) {
  const cp = data.cursedProfile;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-5 h-5 text-purple-400" />
        <h3 className="text-base font-semibold text-purple-300">
          Expansão de Domínio (Ryōiki Tenkai)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Nome do Domínio
          </label>
          <input
            type="text"
            placeholder="Ex: Santuário Malevolente, Vazio Imensurável..."
            value={cp.domainExpansion.name}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: {
                  ...prev.cursedProfile,
                  domainExpansion: { ...prev.cursedProfile.domainExpansion, name: val },
                },
              }));
            }}
            className="w-full px-3 py-1.5 text-sm font-semibold rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Tipo de Domínio
          </label>
          <select
            value={cp.domainExpansion.type}
            onChange={(e) => {
              const val = e.target.value;
              onChange((prev) => ({
                ...prev,
                cursedProfile: {
                  ...prev.cursedProfile,
                  domainExpansion: { ...prev.cursedProfile.domainExpansion, type: val },
                },
              }));
            }}
            className="w-full px-3 py-1.5 text-sm rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          >
            <option value="Letal">Letal (Acerto Garantido Ofensivo)</option>
            <option value="Não-Letal">Não-Letal (Regras e Condições Forçadas)</option>
            <option value="Incompleta">Incompleta (Sem Barreira Fechada)</option>
            <option value="Sem Barreira">Sem Barreira (Aberta no Espaço)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Custo de Ativação (PE)
          </label>
          <input
            type="number"
            min={0}
            value={cp.domainExpansion.cost}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              onChange((prev) => ({
                ...prev,
                cursedProfile: {
                  ...prev.cursedProfile,
                  domainExpansion: { ...prev.cursedProfile.domainExpansion, cost: val },
                },
              }));
            }}
            className="w-full text-center px-3 py-1.5 text-sm font-bold text-purple-400 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Efeitos do Acerto Garantido & Cenário
        </label>
        <textarea
          rows={3}
          placeholder="Descreva o ambiente do domínio e as propriedades que se tornam inevitáveis aos alvos aprisionados..."
          value={cp.domainExpansion.description}
          onChange={(e) => {
            const val = e.target.value;
            onChange((prev) => ({
              ...prev,
              cursedProfile: {
                ...prev.cursedProfile,
                domainExpansion: { ...prev.cursedProfile.domainExpansion, description: val },
              },
            }));
          }}
          className="w-full text-xs p-3 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)] resize-none"
        />
      </div>
    </div>
  );
}
