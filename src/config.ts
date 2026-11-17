/**
 * PLACEHOLDER CONTACT NUMBERS: replace with the real lines.
 * Numbers are digits only, international format, no "+" (e.g. 2348012345678).
 */
export const WHATSAPP_LINES: { label: string; number: string }[] = [
  { label: "Line 1", number: "2340000000001" },
  { label: "Line 2", number: "2340000000002" },
  { label: "Line 3", number: "2340000000003" },
  { label: "Line 4", number: "2340000000004" },
  { label: "Line 5", number: "2340000000005" },
];

export const SUPPORT = {
  phone: "2340000000000", // call line
  whatsapp: "2340000000000", // support WhatsApp
};

export const prettyPhone = (n: string) => `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`;
export const waLink = (n: string, text?: string) =>
  `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
