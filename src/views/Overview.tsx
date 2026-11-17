import { Download } from "lucide-react";
import { Empty, PartyBadge } from "../components/ui";
import { PARTIES } from "../data/oyo";
import { exportCsv, fmt, fmtTime, leader, partyTotals } from "../lib";
import type { ResultEntry } from "../types";

export default function Overview({ rows, limit = 50, onReset }: { rows: ResultEntry[]; limit?: number; onReset: () => void }) {
  const totals = partyTotals(rows);
  const grand = Object.values(totals).reduce((a, b) => a + b, 0);
  const lead = leader(totals);
  const lgasReporting = new Set(rows.map((r) => r.lga)).size;

  return (
    <>
      <div className="stats">
        <div className="stat green"><span>TOTAL VOTES</span><b>{fmt(grand)}</b><small>Across all parties</small></div>
        <div className="stat"><span>POLLING UNITS</span><b>{fmt(rows.length)}</b><small>{lgasReporting} of 33 LGAs reporting</small></div>
        <div className="stat yellow">
          <span>LEADING PARTY</span><b>{lead ? lead.label : "—"}</b>
          <small>{lead ? `${fmt(totals[lead.id])} votes` : "Awaiting results"}</small>
        </div>
        <div className="stat"><span>REPORTS VERIFIED</span><b>{fmt(rows.length)}</b><small>Time-stamped entries</small></div>
      </div>

      <div className="parties">
        {PARTIES.map((p) => {
          const pct = grand ? (totals[p.id] / grand) * 100 : 0;
          return (
            <div key={p.id} className="party-card">
              <div className="row-between"><span className="label">{p.label}</span><span className="muted small">{pct.toFixed(0)}%</span></div>
              <b style={{ color: p.color }}>{fmt(totals[p.id])}</b>
              <div className="bar"><i style={{ width: `${pct}%`, background: p.color }} /></div>
            </div>
          );
        })}
      </div>

      <section className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow muted">RAW RESULTS</div>
            <h3>Polling unit report</h3>
          </div>
          <button className="ghost" disabled={!rows.length} onClick={() => exportCsv(rows)}><Download size={14} /> Export report</button>
        </div>
        {rows.length === 0 ? (
          <Empty title="No results recorded yet" hint="Use the result entry panel to add the first polling unit." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>LGA</th><th>Ward</th><th>Polling unit</th>
                  {PARTIES.map((p) => <th key={p.id} className="num">{p.label}</th>)}
                  <th className="num">Total</th><th>Winner</th><th>Recorded</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, limit).map((r) => (
                  <tr key={r.id}>
                    <td>{r.lga}</td><td>{r.ward}</td><td>{r.pollingUnit}</td>
                    {PARTIES.map((p) => <td key={p.id} className="num">{fmt(r.votes[p.id])}</td>)}
                    <td className="num strong">{fmt(r.total)}</td>
                    <td><PartyBadge id={r.winner} /></td>
                    <td className="muted small">{fmtTime(r.recordedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="row-between muted tiny foot">
          <span>{rows.length} report{rows.length === 1 ? "" : "s"} now</span>
          <span>Demo data · <button className="link" onClick={onReset}>Reset demo data</button></span>
        </div>
      </section>
    </>
  );
}
