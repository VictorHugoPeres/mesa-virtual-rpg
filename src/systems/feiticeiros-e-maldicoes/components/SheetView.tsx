"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FMCharacterData,
  parseCharacterData,
} from "@/systems/feiticeiros-e-maldicoes";
import { useCampaignSync } from "@/core/sync/useCampaignSync";
import { TabPersonal } from "./tabs/TabPersonal";
import { TabCursedProfile } from "./tabs/TabCursedProfile";
import { TabInventory } from "./tabs/TabInventory";
import { TabInvocations } from "./tabs/TabInvocations";
import { TabTraining } from "./tabs/TabTraining";
import { SheetHeader } from "./SheetHeader";
import {
  User,
  Sparkles,
  Package,
  Ghost,
  Dumbbell,
} from "lucide-react";

interface SheetViewProps {
  characterId: string;
  campaignId: string;
  initialName: string;
  initialType: string;
  initialDataRaw: string;
}

type TabKey = "personal" | "cursed" | "inventory" | "invocations" | "training";

export function SheetView({
  characterId,
  campaignId,
  initialName,
  initialType,
  initialDataRaw,
}: SheetViewProps) {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState(initialType);
  const [data, setData] = useState<FMCharacterData>(() =>
    parseCharacterData(initialDataRaw)
  );

  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );

  // Debounced auto-save
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const isIncomingSyncRef = useRef(false);

  // Sincronização em tempo real (atualizações vindas do combate ou celular)
  useCampaignSync({
    campaignId,
    onEvent: (event) => {
      if (event.type === "CHARACTER_UPDATE") {
        const payload = event.payload as { characterId: string; name?: string; data: FMCharacterData };
        if (payload?.characterId === characterId && payload.data) {
          isIncomingSyncRef.current = true;
          if (payload.name) setName(payload.name);
          setData(payload.data);
        }
      }
    },
  });

  const saveToDatabase = useCallback(
    async (charName: string, charType: string, charData: FMCharacterData) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/characters/${characterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: charName,
            type: charType,
            data: charData,
          }),
        });

        if (!res.ok) throw new Error("Falha ao salvar");
        setSaveStatus("saved");
      } catch (err) {
        console.error("Erro ao salvar:", err);
        setSaveStatus("error");
      }
    },
    [characterId]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isIncomingSyncRef.current) {
      isIncomingSyncRef.current = false;
      return;
    }

    setSaveStatus("saving");
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveToDatabase(name, type, data);
    }, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [name, type, data, saveToDatabase]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "personal",
      label: "Ficha Pessoal",
      icon: <User className="w-4 h-4" />,
    },
    {
      key: "cursed",
      label: "Perfil Amaldiçoado",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      key: "inventory",
      label: "Inventário & Aspectos",
      icon: <Package className="w-4 h-4" />,
    },
    {
      key: "invocations",
      label: `Invocações (${data.invocations?.length || 0})`,
      icon: <Ghost className="w-4 h-4" />,
    },
    {
      key: "training",
      label: "Treinamentos",
      icon: <Dumbbell className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Barra Superior Modular */}
      <SheetHeader
        name={name}
        setName={setName}
        type={type}
        campaignId={campaignId}
        characterId={characterId}
        data={data}
        saveStatus={saveStatus}
        onManualSave={() => saveToDatabase(name, type, data)}
      />

      {/* Navegação entre as 5 Abas */}
      <div className="flex overflow-x-auto gap-1 border-b border-[var(--border-default)] pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                isActive
                  ? "bg-[var(--bg-card)] border-blue-500 text-blue-400 shadow-xs"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div>
        {activeTab === "personal" && (
          <TabPersonal
            data={data}
            onChange={setData}
            characterName={name}
            characterId={characterId}
            campaignId={campaignId}
          />
        )}
        {activeTab === "cursed" && (
          <TabCursedProfile
            data={data}
            onChange={setData}
            characterName={name}
            characterId={characterId}
            campaignId={campaignId}
          />
        )}
        {activeTab === "inventory" && (
          <TabInventory data={data} onChange={setData} />
        )}
        {activeTab === "invocations" && (
          <TabInvocations data={data} onChange={setData} />
        )}
        {activeTab === "training" && (
          <TabTraining data={data} onChange={setData} />
        )}
      </div>
    </div>
  );
}
