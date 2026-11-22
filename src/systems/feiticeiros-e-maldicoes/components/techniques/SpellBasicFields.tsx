"use client";

interface SpellBasicFieldsProps {
  action: string;
  setAction: (act: string) => void;
  range: string;
  setRange: (rng: string) => void;
  duration: string;
  setDuration: (dur: string) => void;
  maxRangeMeters: number;
}

export function SpellBasicFields({
  action,
  setAction,
  range,
  setRange,
  duration,
  setDuration,
  maxRangeMeters,
}: SpellBasicFieldsProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Ação</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white"
        >
          <option value="Ação Comum">Ação Comum</option>
          <option value="Ação Bônus">Ação Bônus</option>
          <option value="Reação">Reação</option>
          <option value="Ação Completa">Ação Completa</option>
          <option value="Passiva">Passiva</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Alcance (Máx {maxRangeMeters}m)</label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white"
        >
          <option value="Toque">Toque</option>
          <option value="9m">9 metros</option>
          <option value="12m">12 metros</option>
          {maxRangeMeters >= 18 && <option value="18m">18 metros</option>}
          {maxRangeMeters >= 24 && <option value="24m">24 metros</option>}
          {maxRangeMeters >= 30 && <option value="30m">30 metros</option>}
          {maxRangeMeters >= 48 && <option value="48m">48 metros</option>}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Duração</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-white"
        >
          <option value="Instantânea">Instantânea</option>
          <option value="Imediata">Imediata (1 rod.)</option>
          <option value="Duradoura">Duradoura (1 min.)</option>
          <option value="Sustentada">Sustentada (PE/rod.)</option>
        </select>
      </div>
    </div>
  );
}
