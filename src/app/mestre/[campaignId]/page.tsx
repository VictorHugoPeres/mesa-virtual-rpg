import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Swords, User, ScrollText, ArrowUpRight } from "lucide-react";
import { NewCharacterModal } from "@/components/NewCharacterModal";
import {
  parseCharacterData,
  ATTRIBUTE_LABELS,
  getModifier,
  getProficiencyBonus,
} from "@/systems/feiticeiros-e-maldicoes";
import type { AttributeKey } from "@/systems/feiticeiros-e-maldicoes";

export const dynamic = "force-dynamic";

export default async function MestrePage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      characters: true,
      sessions: { orderBy: { number: "desc" } },
    },
  });

  if (!campaign) return notFound();

  const systemLabel =
    campaign.systemId === "feiticeiros-e-maldicoes"
      ? "Feiticeiros e Maldições"
      : campaign.systemId;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]
                   hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar às Campanhas
      </Link>

      {/* Header da campanha */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Swords className="w-7 h-7 text-red-500" />
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Sistema:{" "}
          <span className="text-[var(--accent-purple)] font-medium">
            {systemLabel}
          </span>
          {" · "}
          {campaign.sessions.length}{" "}
          {campaign.sessions.length === 1 ? "sessão" : "sessões"}
        </p>
      </header>

      {/* Grid com personagens */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--accent-blue)]" />
            Personagens ({campaign.characters.length})
          </h2>
          <NewCharacterModal campaignId={campaign.id} />
        </div>

        {campaign.characters.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">
            Nenhum personagem cadastrado nesta campanha.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {campaign.characters.map((char) => {
              let sheet;
              try {
                sheet = parseCharacterData(char.data);
              } catch {
                sheet = null;
              }

              return (
                <Link
                  key={char.id}
                  href={`/mestre/${campaign.id}/fichas/${char.id}`}
                  className="group block p-5 rounded-xl border border-[var(--border-default)]
                             bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]
                             hover:border-blue-500/50 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-semibold group-hover:text-blue-400 transition-colors">
                          {char.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      </div>
                      {sheet && (
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Nível {sheet.level} · {sheet.specialization} ·{" "}
                          {sheet.grade}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        char.type === "PC"
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-red-900/50 text-red-300"
                      }`}
                    >
                      {char.type}
                    </span>
                  </div>

                  {sheet && (
                    <>
                      {/* Barras de recursos */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <ResourceMini
                          label="PV"
                          current={sheet.hp.current}
                          max={sheet.hp.max}
                          color="var(--accent-red)"
                        />
                        <ResourceMini
                          label="PE"
                          current={sheet.energy.current}
                          max={sheet.energy.max}
                          color="var(--accent-blue)"
                        />
                        <ResourceMini
                          label="Defesa"
                          current={sheet.defense.total}
                          max={null}
                          color="var(--accent-amber)"
                        />
                      </div>

                      {/* Atributos compactos */}
                      <div className="grid grid-cols-6 gap-1 text-center">
                        {(
                          Object.entries(ATTRIBUTE_LABELS) as [
                            AttributeKey,
                            string,
                          ][]
                        ).map(([key, label]) => {
                          const val = sheet.attributes[key] ?? 10;
                          const mod = getModifier(val);
                          return (
                            <div
                              key={key}
                              className="py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                            >
                              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                {key}
                              </p>
                              <p className="text-sm font-bold">{val}</p>
                              <p
                                className={`text-xs font-medium ${
                                  mod >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {mod >= 0 ? `+${mod}` : mod}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Última sessão */}
      {campaign.sessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[var(--accent-green)]" />
            Última Sessão
          </h2>
          <div
            className="p-5 rounded-xl border border-[var(--border-default)]
                         bg-[var(--bg-card)]"
          >
            <p className="text-sm font-medium mb-1">
              Sessão #{campaign.sessions[0].number}
            </p>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
              {campaign.sessions[0].notes || "Sem anotações."}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-[var(--text-muted)]">
        Painel do Mestre — Etapa 1A
      </footer>
    </main>
  );
}

/** Componente auxiliar para mini-barra de recursos */
function ResourceMini({
  label,
  current,
  max,
  color,
}: {
  label: string;
  current: number;
  max: number | null;
  color: string;
}) {
  const pct = max ? Math.min(100, (current / max) * 100) : 100;
  return (
    <div>
      <p className="text-[10px] font-semibold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
        {label}
      </p>
      <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs font-medium mt-0.5" style={{ color }}>
        {current}
        {max !== null && <span className="text-[var(--text-muted)]">/{max}</span>}
      </p>
    </div>
  );
}
