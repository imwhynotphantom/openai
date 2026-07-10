import type { Dictionary } from "@/lib/i18n/load";

type ConnectErrorDict = Dictionary["connectErrors"];

/** Traduce errores de conexión de wagmi/viem a mensajes claros en el idioma activo. */
export function mapConnectError(error: unknown, d: ConnectErrorDict): string {
  if (!(error instanceof Error)) return d.generic;

  const t = error.message.toLowerCase();

  if (t.includes("user rejected") || t.includes("user denied") || t.includes("connection request reset")) {
    return d.rejected;
  }
  if (t.includes("already connected")) {
    return d.alreadyConnected;
  }
  if (t.includes("resource unavailable") || t.includes("already pending") || t.includes("-32002")) {
    return d.pendingRequest;
  }
  if (t.includes("provider not found") || t.includes("no provider")) {
    return d.noProvider;
  }
  if (t.includes("chain") && (t.includes("not configured") || t.includes("unsupported"))) {
    return d.chainUnsupported;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[conexión] error sin mapear:", error);
  }
  return d.generic;
}
