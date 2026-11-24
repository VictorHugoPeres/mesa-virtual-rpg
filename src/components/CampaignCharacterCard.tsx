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
      className="group block p-4 sm:p-5 rounded-xl border border-[#23272F]
                 bg-[#14161A] hover:bg-[#1A1D24]
                 hover:border-white/20 transition-all duration-200 shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
              {char.name}
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
          </div>
          {sheet && (
            <p className="text-xs text-zinc-400 mt-0.5">
              Nível {sheet.level} · {sheet.specialization} · {sheet.grade}
            </p>
          )}
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
            char.type === "PC"
              ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
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
              color="#f43f5e"
            />
            <ResourceMini
              label="PE"
              current={sheet.energy.current}
              max={sheet.energy.max}
              color="#38bdf8"
            />
            <ResourceMini
              label="Defesa"
              current={sheet.defense.total}
              max={null}
              color="#d4d4d8"
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
                  className="py-1 rounded-lg bg-[#0B0C0E] border border-[#23272F]"
                >
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    {key}
                  </p>
                  <p className="text-xs font-bold text-zinc-200">{val}</p>
                  <p
                    className={`text-[11px] font-medium ${
                      mod > 0
                        ? "text-emerald-400"
                        : mod < 0
                        ? "text-rose-400"
                        : "text-zinc-400"
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
      <p className="text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">
        {label}
      </p>
      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs font-semibold mt-0.5" style={{ color }}>
        {current}
        {max !== null && <span className="text-zinc-500 font-normal">/{max}</span>}
      </p>
    </div>
  );
}
