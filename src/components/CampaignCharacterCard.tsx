import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  parseCharacterData,
  ATTRIBUTE_LABELS,
  getModifier,
  AttributeKey,
} from "@/systems/feiticeiros-e-maldicoes";

interface CampaignCharacterCardProps {
  campaignId: string;
  char: {
    id: string;
    name: string;
    type: string;
    data: string;
  };
}

export function CampaignCharacterCard({
  campaignId,
  char,
}: CampaignCharacterCardProps) {
  let sheet;
  try {
    sheet = parseCharacterData(char.data);
  } catch {
    sheet = null;
  }

  return (
    <Link
      href={`/mestre/${campaignId}/fichas/${char.id}`}
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
              Nível {sheet.level} · {sheet.specialization} · {sheet.grade}
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
              Object.entries(ATTRIBUTE_LABELS) as [AttributeKey, string][]
            ).map(([key]) => {
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
                      mod >= 0 ? "text-green-400" : "text-red-400"
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
}

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
