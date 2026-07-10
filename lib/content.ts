/**
 * Datos estáticos NO traducibles (posiciones, números, colores, símbolos).
 * Los textos asociados viven en lib/i18n/dictionaries/{locale}.ts (content.*).
 */

/** Nombres de los 6 servicios de OpenAI (marca, no se traducen). */
export const ecosystemNames = [
  "ChatGPT",
  "API",
  "DALL·E",
  "Sora",
  "Whisper",
  "Codex",
] as const;

/** Iconos de los 3 motivos de inversión (mismo orden que dict.content.tokenWhy). */
export const tokenWhyIcons = ["↗", "◴", "◆"] as const;

// hub nodes (OPEN in the center syncing with the 6 services)
export const hubPos = [
  "position:absolute;left:50%;top:7.7%;transform:translate(-50%,-50%)",
  "position:absolute;left:84.2%;top:28.8%;transform:translate(-50%,-50%)",
  "position:absolute;left:84.2%;top:71.2%;transform:translate(-50%,-50%)",
  "position:absolute;left:50%;top:88.8%;transform:translate(-50%,-50%)",
  "position:absolute;left:15.8%;top:71.2%;transform:translate(-50%,-50%)",
  "position:absolute;left:15.8%;top:28.8%;transform:translate(-50%,-50%)",
];

/** Distribución del suministro: porcentaje + color (etiquetas en dict.content.tkSegs). */
export const tkSegData: { pct: number; color: string }[] = [
  { pct: 9.95, color: "var(--accent,#0E8C6A)" },
  { pct: 40, color: "#D8D8DC" },
  { pct: 20, color: "#8FD9C4" },
  { pct: 15, color: "#E0B36A" },
  { pct: 5, color: "#5A5A60" },
  { pct: 10.05, color: "#6478F0" },
];

export const assetMeta: Record<string, { name: string; color: string; sym: string }> = {
  OPEN: { name: "OPEN Token", color: "#0E8C6A", sym: "A" },
  ETH: { name: "Ethereum", color: "#6478F0", sym: "Ξ" },
  BTC: { name: "Bitcoin", color: "#E9962E", sym: "₿" },
  USDC: { name: "USD Coin", color: "#2775CA", sym: "$" },
};

export const baseTk: { s: string; p: string; c: string; up: boolean }[] = [
  { s: "BTC", p: "$64,180", c: "+1.8%", up: true },
  { s: "ETH", p: "$3,452", c: "+2.4%", up: true },
  { s: "SOL", p: "$172.30", c: "-0.9%", up: false },
  { s: "BNB", p: "$611.40", c: "+0.6%", up: true },
  { s: "XRP", p: "$0.583", c: "+3.1%", up: true },
  { s: "ADA", p: "$0.461", c: "-1.2%", up: false },
  { s: "DOGE", p: "$0.142", c: "+4.7%", up: true },
  { s: "AVAX", p: "$34.10", c: "-0.4%", up: false },
  { s: "LINK", p: "$16.82", c: "+1.1%", up: true },
  { s: "DOT", p: "$7.14", c: "-0.7%", up: false },
];

export type DocSection = { h?: string; p: string[]; id?: string };
export type Doc = {
  eyebrow: string;
  title: string;
  meta: string;
  subtitle: string;
  hasStats?: boolean;
  stats?: { value: string; label: string }[];
  sections: DocSection[];
};
