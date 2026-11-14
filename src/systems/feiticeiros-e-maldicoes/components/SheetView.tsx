"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FMCharacterData,
  parseCharacterData,
} from "@/systems/feiticeiros-e-maldicoes";
import { TabPersonal } from "./tabs/TabPersonal";
import { TabCursedProfile } from "./tabs/TabCursedProfile";
import { TabInventory } from "./tabs/TabInventory";
import { TabInvocations } from "./tabs/TabInvocations";
import { TabTraining } from "./tabs/TabTraining";
import {
  ArrowLeft,
  User,
  Sparkles,
  Package,
  Ghost,
  Dumbbell,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
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
      {/* ────────────────────────────────────────────────────────── */}
      {/* BARRA SUPERIOR DE AÇÕES & STATUS */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <Link
            href={`/mestre/${campaignId}`}
            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Voltar ao Painel da Campanha"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do Personagem"
                className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-[var(--border-accent)] focus:border-blue-500 focus:outline-none transition-colors"
              />
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  type === "PC"
                    ? "bg-blue-900/60 text-blue-300 border border-blue-700"
                    : "bg-red-900/60 text-red-300 border border-red-700"
                }`}
              >
                {type}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {data.origin} · {data.specialization} · Nível {data.level} · {data.grade}
            </p>
          </div>
        </div>

        {/* Status de salvamento e botão manual */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Salvando...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Salvo no banco</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-400">Erro ao salvar</span>
              </>
            )}
          </div>

          <button
            onClick={() => saveToDatabase(name, type, data)}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Salvar Agora
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* NAVEGAÇÃO ENTRE AS 5 ABAS */}
      {/* ────────────────────────────────────────────────────────── */}
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

      {/* ────────────────────────────────────────────────────────── */}
      {/* CONTEÚDO DA ABA ATIVA */}
      {/* ────────────────────────────────────────────────────────── */}
      <div>
        {activeTab === "personal" && (
          <TabPersonal data={data} onChange={setData} />
        )}
        {activeTab === "cursed" && (
          <TabCursedProfile data={data} onChange={setData} />
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
