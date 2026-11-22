"use client";

import React from "react";

interface D20IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  glow?: boolean;
}

export function D20Icon({
  size = 24,
  glow = false,
  className = "",
  ...props
}: D20IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${glow ? "drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]" : ""} ${className}`}
      {...props}
    >
      <defs>
        <linearGradient id="d20-facet-grad" x1="50" y1="36" x2="50" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.25)" />
          <stop offset="100%" stopColor="rgba(185, 28, 28, 0.08)" />
        </linearGradient>
      </defs>

      {/* Hexágono externo do d20 */}
      <polygon
        points="50,6 88.1,28 88.1,72 50,94 11.9,72 11.9,28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="rgba(15, 15, 20, 0.75)"
      />

      {/* Face central triangular (onde o 20 fica destacado) */}
      <polygon
        points="30,36 70,36 50,70"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="url(#d20-facet-grad)"
      />

      {/* Linhas internas que formam as 10 faces visíveis */}
      {/* Vértice Superior Esquerdo da face central para o hexágono */}
      <line x1="30" y1="36" x2="50" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="30" y1="36" x2="11.9" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="30" y1="36" x2="11.9" y2="72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

      {/* Vértice Superior Direito da face central para o hexágono */}
      <line x1="70" y1="36" x2="50" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="70" y1="36" x2="88.1" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="70" y1="36" x2="88.1" y2="72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

      {/* Vértice Inferior da face central para o hexágono */}
      <line x1="50" y1="70" x2="11.9" y2="72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="50" y1="70" x2="50" y2="94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="50" y1="70" x2="88.1" y2="72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

      {/* Número 20 na face frontal */}
      <text
        x="50"
        y="49"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="17"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.5"
      >
        20
      </text>
    </svg>
  );
}

interface BrandLogoProps {
  variant?: "compact" | "full" | "hero";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  iconClassName?: string;
  href?: string;
}

export function BrandLogo({
  variant = "full",
  size = "md",
  className = "",
  iconClassName = "text-red-500",
}: BrandLogoProps) {
  // Tamanho do ícone d20 por escala
  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 48,
  }[size];

  // Variante Compacta: apenas o d20 com o 20
  if (variant === "compact") {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} title="D20 RPG">
        <D20Icon size={iconSizes} className={iconClassName} />
      </span>
    );
  }

  // Variante Hero: para a Home e Standby do Telão
  if (variant === "hero") {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-sm font-sans">
            D
          </span>
          <D20Icon
            size={size === "xl" ? 56 : 46}
            glow
            className={`${iconClassName} hover:scale-105 transition-transform duration-300`}
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-red-500/40" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-zinc-400">
            Mesa Digital
          </span>
          <span className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-red-500/40" />
        </div>
      </div>
    );
  }

  // Variante Full (Padrão para Cabeçalhos e Barras de Ferramentas)
  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];

  return (
    <div className={`inline-flex items-center gap-1 select-none ${className}`}>
      <span className={`font-black tracking-tight text-white leading-none font-sans ${textSizes}`}>
        D
      </span>
      <D20Icon
        size={iconSizes}
        className={`${iconClassName} hover:rotate-12 transition-transform duration-200`}
      />
    </div>
  );
}
