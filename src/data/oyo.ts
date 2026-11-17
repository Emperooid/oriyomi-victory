import type { Election, Party } from "../types";

export const PARTIES: Party[] = [
  { id: "ACCORD", label: "Accord", color: "#0a7a4f" },
  { id: "APC", label: "APC", color: "#2456d6" },
  { id: "PDP", label: "PDP", color: "#c62f2f" },
  { id: "ADC", label: "ADC", color: "#b45309" },
];

export const ELECTIONS: Election[] = [
  { id: "gen-2027", name: "2027 General Election" },
  { id: "gov-2027", name: "2027 Governorship Election" },
  { id: "lcc-2027", name: "2027 Local Council Election" },
];

// The 33 Local Government Areas of Oyo State.
export const LGAS: string[] = [
  "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North",
  "Ibadan North-East", "Ibadan North-West", "Ibadan South-East",
  "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North",
  "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu",
  "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole",
  "Ona Ara", "Orelope", "Ori Irele", "Oyo East", "Oyo West", "Saki East",
  "Saki West", "Surulere",
];

// PLACEHOLDER: real ward / polling-unit names come from INEC data later.
// Until then every LGA gets generic wards and units.
const WARDS_PER_LGA = 10;
const UNITS_PER_WARD = 8;

const pad = (n: number) => String(n).padStart(2, "0");

export const wardsFor = (lga: string): string[] =>
  lga ? Array.from({ length: WARDS_PER_LGA }, (_, i) => `Ward ${pad(i + 1)}`) : [];

export const unitsFor = (ward: string): string[] =>
  ward ? Array.from({ length: UNITS_PER_WARD }, (_, i) => `PU ${pad(i + 1)}`) : [];
