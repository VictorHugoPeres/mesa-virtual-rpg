"use client";

import { FMCharacterData } from "@/systems/feiticeiros-e-maldicoes";
import { InventoryList } from "./inventory/InventoryList";
import { PhysicalAspects } from "./inventory/PhysicalAspects";
import { PersonalityAspects } from "./inventory/PersonalityAspects";

interface TabInventoryProps {
  data: FMCharacterData;
  onChange: (updater: (prev: FMCharacterData) => FMCharacterData) => void;
}

export function TabInventory({ data, onChange }: TabInventoryProps) {
  return (
    <div className="space-y-6">
      {/* 1. Inventário & Equipamentos */}
      <InventoryList data={data} onChange={onChange} />

      {/* 2. Aspectos Pessoais & Aparência */}
      <PhysicalAspects data={data} onChange={onChange} />

      {/* 3. Personalidade, Filosofia & História */}
      <PersonalityAspects data={data} onChange={onChange} />
    </div>
  );
}
