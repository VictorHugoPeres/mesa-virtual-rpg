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
  const isRestringido = data.origin === "Restringido" || data.specialization === "Restringido";

  return (
    <div className="space-y-6">
      {/* 1. Técnica Amaldiçoada ou Estilo Marcial */}
      <TechniqueDetails
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 2. Níveis de Aptidão Amaldiçoada (0 a 5) - Oculto para Restringido Celestial */}
      {!isRestringido && (
        <AptitudesTracker data={data} onChange={onChange} />
      )}

      {/* 3. Feitiços & Liberações ou Arsenal Marcial */}
      <SpellsList
        data={data}
        onChange={onChange}
        characterName={characterName}
        characterId={characterId}
        campaignId={campaignId}
      />

      {/* 4. Expansão de Domínio - Oculto para Restringido Celestial */}
      {!isRestringido && (
        <DomainExpansionCard data={data} onChange={onChange} />
      )}
    </div>
  );
}
