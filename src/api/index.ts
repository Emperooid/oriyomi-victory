import { PARTIES } from "../data/oyo";
import { mockResults } from "../data/mock";
import type { NewResult, PartyId, ResultEntry } from "../types";

/**
 * The only thing the UI knows about storage. When the backend exists,
 * write an HTTP implementation of this interface and export it as `api`.
 */
export interface ResultsApi {
  list(): Promise<ResultEntry[]>;
  submit(input: NewResult): Promise<ResultEntry>;
  /** Demo only: restore the seeded mock data. Drop this once a real backend exists. */
  resetDemo(): Promise<ResultEntry[]>;
}

const KEY = "oriyomi-dashboard:results:v3";

const read = (): ResultEntry[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to mock data */
  }
  return mockResults();
};

const write = (rows: ResultEntry[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    /* storage unavailable: results live only for this session */
  }
};

// crypto.randomUUID only exists on secure origins (localhost / https).
const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `r-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

let memory: ResultEntry[] | null = null;

const localApi: ResultsApi = {
  async list() {
    memory ??= read();
    return [...memory];
  },
  async submit(input) {
    memory ??= read();
    const entries = Object.entries(input.votes) as [PartyId, number][];
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const max = Math.max(...entries.map(([, v]) => v));
    const leaders = entries.filter(([, v]) => v === max);
    const row: ResultEntry = {
      ...input,
      id: newId(),
      total,
      winner: total === 0 || leaders.length > 1 ? "TIE" : leaders[0][0],
      recordedAt: new Date().toISOString(),
    };
    memory = [row, ...memory];
    write(memory);
    return row;
  },
  async resetDemo() {
    memory = mockResults();
    write(memory);
    return [...memory];
  },
};

export const api: ResultsApi = localApi;

export const emptyVotes = (): Record<PartyId, number> =>
  Object.fromEntries(PARTIES.map((p) => [p.id, 0])) as Record<PartyId, number>;
