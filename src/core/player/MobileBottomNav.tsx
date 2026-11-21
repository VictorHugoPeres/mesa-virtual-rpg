"use client";

import { User, Dices, Swords, BookOpen } from "lucide-react";

export type MobileTab = "ficha" | "dados" | "combate" | "guia";

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
    { id: "guia" as const, label: "Guia", icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border-default)] px-3 py-1.5 flex items-center justify-around max-w-lg mx-auto pointer-events-auto touch-manipulation select-none">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 relative transition-all cursor-pointer active:scale-95 touch-manipulation select-none ${
              isActive
                ? "text-blue-400 font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-medium"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-400 scale-110" : ""}`} />
              {t.badge && (
                <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
