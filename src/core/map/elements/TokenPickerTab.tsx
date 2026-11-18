"use client";

import { useState, useEffect } from "react";
import { User, Skull, Plus } from "lucide-react";
import { MapElement } from "./elementTypes";

interface CampaignCharItem {
  id: string;
  name: string;
  type: string;
  avatarUrl?: string | null;
  data: string;
}

interface TokenPickerTabProps {
  campaignId: string;
  spawnPosition: { x: number; y: number };
  onAddElement: (elem: MapElement) => void;
  onClose: () => void;
}

export function TokenPickerTab({
  campaignId,
  spawnPosition,
  onAddElement,
  onClose,
}: TokenPickerTabProps) {
  const [characters, setCharacters] = useState<CampaignCharItem[]>([]);
  const [tokenSize, setTokenSize] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchChars() {
      setLoading(true);
      try {
        const res = await fetch(`/api/campaigns/${campaignId}/characters`);
        if (res.ok) {
          const data = await res.json();
          setCharacters(data.characters || []);
        }
      } catch (err) {
        console.warn("Erro ao buscar combatentes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChars();
  }, [campaignId]);

  function genId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function handleAddCharacterToken(char: CampaignCharItem) {
    const isThreat = char.type === "THREAT";
    let hp = isThreat ? 30 : 20;

    try {
      const parsed = JSON.parse(char.data);
      if (parsed.hp?.max) hp = parsed.hp.max;
    } catch {}

    const newElement: MapElement = {
      id: genId(),
      type: "TOKEN",
      name: char.name,
      characterId: char.id,
      tokenType: isThreat ? "THREAT" : "PC",
      imageUrl: char.avatarUrl || undefined,
      currentHp: hp,
      maxHp: hp,
      healthStatus: "Saudável",
      widthCells: tokenSize,
      heightCells: tokenSize,
      rotation: 0,
      x: spawnPosition.x + Math.floor(Math.random() * 40 - 20),
      y: spawnPosition.y + Math.floor(Math.random() * 40 - 20),
    };

    onAddElement(newElement);
    onClose();
  }

  return (
    <div className="space-y-4">
      {/* Seletor de Tamanho */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-white/10">
        <span className="text-xs text-zinc-300 font-medium">Tamanho inicial do Token:</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setTokenSize(size)}
              className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                tokenSize === size
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Combatentes */}
      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-400">Carregando combatentes...</div>
      ) : characters.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-400">
          Nenhum combatente cadastrado nesta campanha.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {characters.map((char) => {
            const isThreat = char.type === "THREAT";
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => handleAddCharacterToken(char)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-left transition-all group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                    isThreat
                      ? "bg-red-950/80 border-red-500/40 text-red-400"
                      : "bg-blue-950/80 border-blue-500/40 text-blue-400"
                  }`}
                >
                  {char.avatarUrl ? (
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : isThreat ? (
                    <Skull className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400">
                    {char.name}
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {isThreat ? "Ameaça" : "Personagem"}
                  </span>
                </div>
                <Plus className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
