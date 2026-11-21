"use client";

import { Map as MapIcon, Plus } from "lucide-react";

interface EmptyMapStateProps {
  onOpenAddModal: () => void;
}

export function EmptyMapState({ onOpenAddModal }: EmptyMapStateProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
      <MapIcon className="w-16 h-16 mb-3 opacity-20 text-emerald-400" />
      <h3 className="text-base font-bold text-white mb-1">Nenhum mapa cadastrado</h3>
      <p className="text-xs max-w-sm mb-4">
        Crie o seu primeiro mapa de batalha fazendo upload de uma imagem ou colando um link.
      </p>
      <button
        type="button"
        onClick={onOpenAddModal}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Criar Primeiro Mapa
      </button>
    </div>
  );
}
