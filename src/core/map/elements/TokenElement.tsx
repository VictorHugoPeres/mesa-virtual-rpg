"use client";

import { useState, useEffect } from "react";
import { User, Skull } from "lucide-react";
import { MapElement, getHealthColor } from "./elementTypes";

interface TokenElementProps {
  element: MapElement;
  gridSize: number;
  isSelected?: boolean;
}

export function TokenElement({ element, gridSize, isSelected }: TokenElementProps) {
  const [imageError, setImageError] = useState(false);
  const sizePx = Math.max(gridSize, element.widthCells * gridSize);
  const health = getHealthColor(element.healthStatus);
  const isThreat = element.tokenType === "THREAT";

  useEffect(() => {
    setImageError(false);
  }, [element.imageUrl]);

  return (
    <div
      className="relative flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        transform: `rotate(${element.rotation || 0}deg)`,
      }}
    >
      {/* Círculo do Token com Anel de Vida */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden border-[3px] bg-zinc-900 shadow-xl transition-all duration-150 ${
          health.ring
        } ${
          isSelected
            ? "ring-4 ring-emerald-400 ring-offset-2 ring-offset-black scale-105"
            : "hover:scale-[1.02]"
        }`}
      >
        {element.imageUrl && !imageError ? (
          <img
            src={element.imageUrl}
            alt={element.name}
            draggable={false}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white font-bold">
            {isThreat ? (
              <Skull className="w-1/2 h-1/2 text-red-400" />
            ) : (
              <User className="w-1/2 h-1/2 text-blue-400" />
            )}
          </div>
        )}

        {/* Badge de tamanho se for maior que 1x1 */}
        {element.widthCells > 1 && (
          <div className="absolute top-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[10px] font-black text-white/90 border border-white/20">
            {element.widthCells}x{element.heightCells}
          </div>
        )}
      </div>

      {/* Rótulo de Nome do Combatente */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-black/85 border border-white/10 text-[11px] font-bold text-white shadow-md pointer-events-none max-w-[140px] truncate">
        {element.name}
      </div>
    </div>
  );
}
