"use client";

import { useState, useEffect } from "react";
import { Box, Shield, Car, Circle, Square } from "lucide-react";
import { MapElement } from "./elementTypes";

interface PropElementProps {
  element: MapElement;
  gridSize: number;
  isSelected?: boolean;
}

export function PropElement({ element, gridSize, isSelected }: PropElementProps) {
  const [imageError, setImageError] = useState(false);
  const widthPx = Math.max(gridSize, element.widthCells * gridSize);
  const heightPx = Math.max(gridSize, element.heightCells * gridSize);
  const isCircle = element.propShape === "circle";

  useEffect(() => {
    setImageError(false);
  }, [element.imageUrl]);

  function renderPropContent() {
    if (element.imageUrl && !imageError) {
      return (
        <img
          src={element.imageUrl}
          alt={element.name}
          draggable={false}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain pointer-events-none drop-shadow-md"
        />
      );
    }

    const icon = element.propIcon || "box";
    const color = element.propColor || "#475569";

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center border-2 border-white/20 shadow-lg text-white font-bold p-1 select-none ${
          isCircle ? "rounded-full" : "rounded-lg"
        }`}
        style={{ backgroundColor: color }}
      >
        {icon === "table" && <Square className="w-5 h-5 text-amber-200 opacity-80" />}
        {icon === "chair" && <Square className="w-4 h-4 text-amber-200 opacity-80" />}
        {icon === "box" && <Box className="w-5 h-5 text-amber-100 opacity-90" />}
        {icon === "pillar" && <Circle className="w-5 h-5 text-zinc-300 opacity-90" />}
        {icon === "shield" && <Shield className="w-5 h-5 text-slate-200 opacity-90" />}
        {icon === "car" && <Car className="w-6 h-6 text-blue-200 opacity-90" />}
        <span className="text-[10px] font-bold text-white/90 text-center truncate max-w-[90%] mt-0.5">
          {element.name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none transition-all duration-150 ${
        isSelected
          ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-black scale-[1.02]"
          : "hover:scale-[1.01]"
      }`}
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        transform: `rotate(${element.rotation || 0}deg)`,
      }}
    >
      {renderPropContent()}

      {/* Dimensão do Prop (ex: 2x1) */}
      <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-black text-white/80 border border-white/10 pointer-events-none">
        {element.widthCells}x{element.heightCells}
      </div>
    </div>
  );
}
