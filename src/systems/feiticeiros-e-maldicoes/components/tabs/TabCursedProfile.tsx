"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { TechniqueDetails } from "./cursed/TechniqueDetails";
import { AptitudesTracker } from "./cursed/AptitudesTracker";
import { SpellsList } from "./cursed/SpellsList";
import { DomainExpansionCard } from "./cursed/DomainExpansionCard";

interface TabCursedProfileProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
  characterName?: string;
  characterId?: string;
  campaignId?: string;
}

export function TabCursedProfile({
  data,
  onChange,
  characterName,
  characterId,
  campaignId,
}: TabCursedProfileProps) {
  return (
    <div className="space-y-6">
      {/* 1. Técnica Amaldiçoada & Atributos Mágicos */}
      <TechniqueDetails
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 2. Níveis de Aptidão Amaldiçoada (0 a 5) */}
      <AptitudesTracker data={data} onChange={onChange} />

      {/* 3. Feitiços & Liberações */}
      <SpellsList data={data} onChange={onChange} />

      {/* 4. Expansão de Domínio */}
      <DomainExpansionCard data={data} onChange={onChange} />
    </div>
  );
}
