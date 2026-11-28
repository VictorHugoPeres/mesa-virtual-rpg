"use client";

import { AttributeKey, ATTRIBUTE_LABELS, Specialization } from "@/systems/feiticeiros-e-maldicoes";
import { KeyRound, Swords } from "lucide-react";

interface SpecChoiceOption {
  id: string;
  name: string;
  desc: string;
}

const SPEC_LEVEL1_OPTIONS: Record<Specialization, { title: string; options: SpecChoiceOption[] }> = {
  Lutador: {
    title: "Foco de Manobra Inicial",
    options: [
      { id: "sequencia", name: "Sequência de Golpes", desc: "Gasta 1 PE para desferir um golpe secundário imediato ao acertar." },
      { id: "artes_marciais", name: "Pugilato Ágil", desc: "Ataques desarmados causam 1d6 e usa Destreza no lugar de Força." },
    ],
  },
  "Especialista em Combate": {
    title: "Estilo de Combate",
    options: [
      { id: "duelista", name: "Duelista", desc: "+2 no dano ao empunhar uma arma corpo a corpo em uma mão." },
      { id: "arquearia", name: "Arquearia", desc: "+2 nas jogadas de ataque com armas de disparo ou arremesso." },
      { id: "duas_armas", name: "Empunhadura Dupla", desc: "+1 na Defesa e ataque com a arma secundária sem penalidade." },
      { id: "defensivo", name: "Defensivo", desc: "+1 na Defesa enquanto vestir uniforme e postura para bloquear." },
      { id: "armas_pesadas", name: "Armas Grandes", desc: "Re-rola resultados 1 ou 2 no dano de armas de duas mãos." },
    ],
  },
  "Especialista em Técnica": {
    title: "Modificação de Fundamento",
    options: [
      { id: "manipulacao", name: "Manipulação Aprimorada", desc: "Soma Mod. Chave ao máximo de PE e reduz custo de feitiços básicos." },
      { id: "fundamentos", name: "Fundamentos Avançados", desc: "+1 na Classe de Dificuldade (CD) de todas as suas técnicas." },
    ],
  },
  Controlador: {
    title: "Doutrina de Comando",
    options: [
      { id: "elo", name: "Elo de Invocação", desc: "Pode materializar e controlar remotamente até 2 invocações ativas." },
      { id: "comando", name: "Comando Tático", desc: "Sua invocação pode interceptar ataques direcionados a você como reação." },
    ],
  },
  Suporte: {
    title: "Doutrina de Auxílio",
    options: [
      { id: "socorro", name: "Socorro Imediato", desc: "Como ação bônus, estabiliza aliados caídos ou concede PV temporários." },
      { id: "campo", name: "Campo Protetor", desc: "Gasta 1 PE para conceder +2 na Defesa de um aliado próximo como reação." },
    ],
  },
  Restringido: {
    title: "Aptidão Celestial",
    options: [
      { id: "estamina", name: "Físico Celestial", desc: "0 PE, Estamina = 4x nível, deslocamento 12m e sentidos aguçados." },
      { id: "sentidos", name: "Sentidos Sobre-humanos", desc: "Soma metade do nível na Atenção passiva e detecta ar e densidade." },
    ],
  },
};

interface SpecChoicesSectionProps {
  specialization: Specialization;
  availableKeyAttributes: AttributeKey[];
  selectedKeyAttribute?: AttributeKey;
  onSelectKeyAttribute: (attr: AttributeKey) => void;
  selectedLevel1Choice?: string;
  onSelectLevel1Choice: (choice: string) => void;
}

export function SpecChoicesSection({
  specialization,
  availableKeyAttributes,
  selectedKeyAttribute,
  onSelectKeyAttribute,
  selectedLevel1Choice,
  onSelectLevel1Choice,
}: SpecChoicesSectionProps) {
  const level1Data = SPEC_LEVEL1_OPTIONS[specialization];

  return (
    <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#23272F] space-y-4 animate-in fade-in duration-200">
      {/* 1. Escolha do Atributo Chave */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <KeyRound className="w-3.5 h-3.5 text-rose-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Atributo Chave da Especialização
          </h4>
        </div>
        <p className="text-[11px] text-zinc-400 mb-2">
          Define a CD dos seus feitiços, bônus de PE e aptidões táticas.
        </p>

        <div className="flex flex-wrap gap-2">
          {availableKeyAttributes.map((attr) => {
            const isChosen = selectedKeyAttribute === attr;
            return (
              <button
                key={attr}
                type="button"
                onClick={() => onSelectKeyAttribute(attr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isChosen
                    ? "bg-rose-950/60 border-rose-600 text-rose-300 ring-1 ring-rose-600/50"
                    : "bg-[#14161A] border-[#23272F] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                }`}
              >
                <span>{ATTRIBUTE_LABELS[attr]}</span>
                <span className="text-[10px] font-mono text-zinc-500">({attr})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Escolha de Nível 1 */}
      {level1Data && (
        <div className="pt-3 border-t border-[#23272F]">
          <div className="flex items-center gap-1.5 mb-2">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              {level1Data.title} (1º Nível)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {level1Data.options.map((opt) => {
              const isChosen = selectedLevel1Choice === opt.name || selectedLevel1Choice === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectLevel1Choice(opt.name)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    isChosen
                      ? "bg-[#14161A] border-rose-600 ring-1 ring-rose-600/50"
                      : "bg-[#14161A]/60 border-[#23272F] hover:border-zinc-500 hover:bg-[#14161A]"
                  }`}
                >
                  <span className="font-bold text-xs text-zinc-100 block mb-1">{opt.name}</span>
                  <p className="text-[11px] text-zinc-400 leading-snug">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
