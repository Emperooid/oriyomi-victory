import { GroupTable } from "../components/ui";
import { PARTIES } from "../data/oyo";
import { fmt, groupBy, partyTotals } from "../lib";
import type { ResultEntry, ViewId } from "../types";

export default function Reports({ view, rows }: { view: Exclude<ViewId, "overview" | "units">; rows: ResultEntry[] }) {
  if (view === "wards")
    return (
      <section className="card">
        <h3>Ward reports</h3>
        <GroupTable label="Ward" groups={groupBy(rows, (r) => `${r.lga} · ${r.ward}`)} />
      </section>
    );
  if (view === "lgas")
    return (
      <section className="card">
        <h3>LGA reports</h3>
        <GroupTable label="Local government" groups={groupBy(rows, (r) => r.lga)} />
      </section>
    );

  const totals = partyTotals(rows);
  const grand = Object.values(totals).reduce((a, b) => a + b, 0);
  return (
    <section className="card">
      <h3>Total votes</h3>
      <p className="muted small">Oyo State, all reporting polling units: <strong>{fmt(grand)}</strong> votes.</p>
      {[...PARTIES].sort((a, b) => totals[b.id] - totals[a.id]).map((p) => {
        const pct = grand ? (totals[p.id] / grand) * 100 : 0;
        return (
          <div key={p.id} className="big-bar">
            <div className="row-between"><strong>{p.label}</strong><span>{fmt(totals[p.id])} · {pct.toFixed(1)}%</span></div>
            <div className="bar tall"><i style={{ width: `${pct}%`, background: p.color }} /></div>
          </div>
        );
      })}
    </section>
  );
}
