import { BarChart3 } from "lucide-react";
import { PARTIES } from "../data/oyo";
import { fmt, type Group } from "../lib";
import type { PartyId } from "../types";

export function Empty({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="empty">
      <div className="empty-icon"><BarChart3 size={18} /></div>
      <strong>{title}</strong>
      <span className="muted small">{hint}</span>
    </div>
  );
}

export function PartyBadge({ id }: { id: PartyId | "TIE" }) {
  if (id === "TIE") return <span className="muted">—</span>;
  const p = PARTIES.find((x) => x.id === id)!;
  return <span className="chip" style={{ background: p.color }}>{p.label}</span>;
}

export function GroupTable({ groups, label }: { groups: Group[]; label: string }) {
  if (!groups.length) return <Empty title="No results recorded yet" hint="Use the result entry panel to add the first polling unit." />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{label}</th><th>Units</th>
            {PARTIES.map((p) => <th key={p.id} className="num">{p.label}</th>)}
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.key}>
              <td>{g.key}</td><td>{g.units}</td>
              {PARTIES.map((p) => <td key={p.id} className="num">{fmt(g.totals[p.id])}</td>)}
              <td className="num strong">{fmt(g.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
