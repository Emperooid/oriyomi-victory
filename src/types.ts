export type PartyId = "ACCORD" | "APC" | "PDP" | "ADC";

export interface Party {
  id: PartyId;
  label: string;
  color: string;
}

export interface Election {
  id: string;
  name: string;
}

export interface ResultEntry {
  id: string;
  electionId: string;
  lga: string;
  ward: string;
  pollingUnit: string;
  votes: Record<PartyId, number>;
  total: number;
  winner: PartyId | "TIE";
  recordedAt: string; // ISO timestamp, set when submitted
}

export type NewResult = Omit<ResultEntry, "id" | "total" | "winner" | "recordedAt">;

export type ViewId = "overview" | "units" | "wards" | "lgas" | "totals";
