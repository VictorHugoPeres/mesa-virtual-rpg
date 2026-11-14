"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { PersonalHeader } from "./personal/PersonalHeader";
import { ResourceBars } from "./personal/ResourceBars";
import { DerivedStats } from "./personal/DerivedStats";
import { AttributesGrid } from "./personal/AttributesGrid";
import { SkillsTable } from "./personal/SkillsTable";
import { WeaponsTable } from "./personal/WeaponsTable";
import { FeaturesList } from "./personal/FeaturesList";

interface TabPersonalProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function TabPersonal({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: TabPersonalProps) {
  return (
    <div className="space-y-6">
      {/* 1. Cabeçalho (Nível, Grau, Especialização, Origem) */}
      <PersonalHeader data={data} onChange={onChange} />

      {/* 2. Barras de Recursos (PV, PE, Integridade, CA) */}
      <ResourceBars data={data} onChange={onChange} />

      {/* 3. Derivados & Testes de Morte (Atenção, Iniciativa, Movimento, Portas da Morte) */}
      <DerivedStats
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 4. Atributos Base (6 atributos com rolagens clicáveis) */}
      <AttributesGrid
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 5. Tabela Completa de Perícias (25 perícias clicáveis) */}
      <SkillsTable
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 6. Registro Rápido de Armas & Ataques Clicáveis */}
      <WeaponsTable
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 7. Habilidades de Especialização & Características */}
      <FeaturesList data={data} onChange={onChange} />
    </div>
  );
}
