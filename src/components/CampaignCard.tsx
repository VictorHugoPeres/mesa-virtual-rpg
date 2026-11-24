"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Calendar, Trash2 } from "lucide-react";
import { useDialog } from "@/core/ui";

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    systemId: string;
    createdAt: Date | string;
    characters: { id: string; name: string }[];
    sessions: { id: string; number: number | null }[];
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();
  const { confirm } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);

  const systemLabel =
    campaign.systemId === "feiticeiros-e-maldicoes"
      ? "Feiticeiros e Maldições"
      : campaign.systemId;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const ok = await confirm({
      title: "Excluir Campanha",
      message: `Tem certeza que deseja excluir a campanha "${campaign.name}"? Todos os personagens, sessões e dados associados serão removidos permanentemente.`,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!ok) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Falha ao excluir a campanha. Tente novamente.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setIsDeleting(false);
    }
  }

  return (
    <Link
      href={`/mestre/${campaign.id}`}
      className={`group block p-5 rounded-xl border border-[#23272F]
                 bg-[#14161A] hover:bg-[#1A1D24] hover:border-white/15
                 transition-all duration-200 relative ${
                   isDeleting ? "opacity-40 pointer-events-none" : ""
                 }`}
    >
      <div className="flex items-start justify-between">
        <div className="pr-8">
          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
            {campaign.name}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Sistema: <span className="text-zinc-300 font-medium">{systemLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">
            {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}
          </span>
          <button
            type="button"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
            title="Excluir campanha"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 mt-4 text-xs sm:text-sm text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-zinc-500" />
          {campaign.characters.length}{" "}
          {campaign.characters.length === 1 ? "personagem" : "personagens"}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-zinc-500" />
          {campaign.sessions.length}{" "}
          {campaign.sessions.length === 1 ? "sessão" : "sessões"}
        </span>
      </div>
    </Link>
  );
}
