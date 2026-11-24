"use client";

import { useState } from "react";
import { Portal } from "@/core/ui";
import { useDice } from "./DiceContext";
import { DigitalRollerTab } from "./DigitalRollerTab";
import { PhysicalInputTab } from "./PhysicalInputTab";
import { Dices, Dice5, X } from "lucide-react";

export function DiceModal() {
  const { isModalOpen, closeRoller, activeRequest } = useDice();
  const [tab, setTab] = useState<"digital" | "physical">("digital");

  if (!isModalOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="w-full max-w-md rounded-2xl bg-[#14161A] border border-[#23272F] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header do modal */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#23272F] bg-[#0B0C0E]">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Dices className="w-5 h-5 text-sky-400" />
                {activeRequest?.label || "Rolador de Dados"}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Rolando como: <span className="text-zinc-200 font-medium">{activeRequest?.roller || "Mestre"}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={closeRoller}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Abas: Digital vs Físico */}
          <div className="flex border-b border-[#23272F] bg-[#0B0C0E]/60">
            <button
              type="button"
              onClick={() => setTab("digital")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all cursor-pointer border-b-2 ${
                tab === "digital"
                  ? "border-rose-500/60 text-white bg-white/[0.05]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Dices className={`w-4 h-4 ${tab === "digital" ? "text-sky-400" : "text-zinc-400"}`} /> Rolagem Digital (2D)
            </button>

            <button
              type="button"
              onClick={() => setTab("physical")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all cursor-pointer border-b-2 ${
                tab === "physical"
                  ? "border-rose-500/60 text-white bg-white/[0.05]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Dice5 className={`w-4 h-4 ${tab === "physical" ? "text-emerald-400" : "text-zinc-400"}`} /> Dado Físico (Input Real)
            </button>
          </div>

          {/* Conteúdo da aba */}
          <div className="p-5">
            {tab === "digital" ? (
              <DigitalRollerTab request={activeRequest} onSuccess={closeRoller} />
            ) : (
              <PhysicalInputTab request={activeRequest} onSuccess={closeRoller} />
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
