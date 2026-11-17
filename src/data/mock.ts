import { LGAS, PARTIES, unitsFor, wardsFor } from "./oyo";
import type { PartyId, ResultEntry } from "../types";

/** DEMO DATA ONLY: invented numbers for UI development, not real results. */

// Small deterministic PRNG so the demo looks the same on every load.
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const ELECTIONS = ["gen-2027", "gov-2027", "lcc-2027"] as const;
const ENTRIES_PER_LGA = 2;

export function mockResults(): ResultEntry[] {
  const rand = rng(2027);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
  const base = Date.now() - 9 * 3600_000; // spread over the last ~9 hours
  const rows: ResultEntry[] = [];

  ELECTIONS.forEach((electionId, e) => {
    LGAS.forEach((lga, l) => {
      // each LGA leans toward one party, which changes per election
      const lean = PARTIES[(l * 7 + e * 3 + Math.floor(rand() * 2)) % PARTIES.length].id;
      for (let i = 0; i < ENTRIES_PER_LGA; i++) {
        const ward = pick(wardsFor(lga));
        const pollingUnit = pick(unitsFor(ward));
        const votes = {} as Record<PartyId, number>;
        for (const p of PARTIES) {
          const strength = p.id === lean ? 260 : 120;
          votes[p.id] = Math.round(strength * (0.4 + rand()) + rand() * 40);
        }
        const entries = Object.entries(votes) as [PartyId, number][];
        const total = entries.reduce((s, [, v]) => s + v, 0);
        const [winner] = entries.sort((a, b) => b[1] - a[1])[0];
        rows.push({
          id: `mock-${electionId}-${l}-${i}`,
          electionId, lga, ward, pollingUnit, votes, total, winner,
          recordedAt: new Date(base + rand() * 9 * 3600_000).toISOString(),
        });
      }
    });
  });

  return rows.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}
