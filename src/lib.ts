import { PARTIES } from "./data/oyo";
import type { PartyId, ResultEntry } from "./types";

export const fmt = (n: number) => n.toLocaleString("en-NG");

export const partyTotals = (rows: ResultEntry[]): Record<PartyId, number> => {
  const t = Object.fromEntries(PARTIES.map((p) => [p.id, 0])) as Record<PartyId, number>;
  for (const r of rows) for (const p of PARTIES) t[p.id] += r.votes[p.id] ?? 0;
  return t;
};

export const leader = (totals: Record<PartyId, number>) => {
  const sorted = [...PARTIES].sort((a, b) => totals[b.id] - totals[a.id]);
  return totals[sorted[0].id] > 0 ? sorted[0] : null;
};

export interface Group {
  key: string;
  units: number;
  total: number;
  totals: Record<PartyId, number>;
}

export const groupBy = (rows: ResultEntry[], keyOf: (r: ResultEntry) => string): Group[] => {
  const map = new Map<string, ResultEntry[]>();
  for (const r of rows) {
    const k = keyOf(r);
    map.set(k, [...(map.get(k) ?? []), r]);
  }
  return [...map.entries()]
    .map(([key, rs]) => {
      const totals = partyTotals(rs);
      return { key, units: rs.length, totals, total: Object.values(totals).reduce((a, b) => a + b, 0) };
    })
    .sort((a, b) => b.total - a.total);
};

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

export const exportCsv = (rows: ResultEntry[]) => {
  const head = ["Election", "LGA", "Ward", "Polling unit", ...PARTIES.map((p) => p.label), "Total", "Winner", "Recorded at"];
  const body = rows.map((r) => [
    r.electionId, r.lga, r.ward, r.pollingUnit,
    ...PARTIES.map((p) => r.votes[p.id]), r.total, r.winner, r.recordedAt,
  ]);
  const csv = [head, ...body].map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "oriyomi-results.csv";
  a.click();
  URL.revokeObjectURL(a.href);
};
