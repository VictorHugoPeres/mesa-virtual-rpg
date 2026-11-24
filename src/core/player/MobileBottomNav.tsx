"use client";

import { User, Dices, Swords, Map as MapIcon, BookOpen } from "lucide-react";

export type MobileTab = "ficha" | "dados" | "combate" | "mapa" | "guia";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  inCombat?: boolean;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  inCombat = false,
}: MobileBottomNavProps) {
  const tabs = [
    { id: "ficha" as const, label: "Ficha", icon: User },
    { id: "dados" as const, label: "Dados", icon: Dices },
    { id: "combate" as const, label: "Combate", icon: Swords, badge: inCombat },
    { id: "mapa" as const, label: "Mapa", icon: MapIcon },
    { id: "guia" as const, label: "Guia", icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0C0E] border-t border-[#23272F] px-1.5 py-1 flex items-center justify-around max-w-lg mx-auto">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors cursor-pointer ${
              isActive
                ? "text-rose-400 font-bold"
                : "text-zinc-400 hover:text-zinc-200 font-medium"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "text-rose-400" : "text-zinc-400"}`} />
              {t.badge && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
