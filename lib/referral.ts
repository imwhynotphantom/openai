import { isAddress, getAddress, zeroAddress, type Address } from "viem";

/**
 * Persistencia del referido (?ref=0x…) en localStorage.
 * El primer link capturado se conserva 30 días; visitas posteriores con otro
 * link NO lo sobrescriben (first-touch attribution, el estándar en preventas).
 */

const STORAGE_KEY = "open_referrer_v1";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

type StoredReferrer = { address: Address; savedAt: number };

export function saveReferrer(raw: string | null | undefined): void {
  if (typeof window === "undefined" || !raw) return;
  if (!isAddress(raw)) return;
  const address = getAddress(raw);
  if (address === zeroAddress) return;
  // First-touch: si ya hay un referido vigente, se respeta.
  if (getReferrer()) return;
  try {
    const payload: StoredReferrer = { address, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage puede fallar (modo privado, cuota); el referido es opcional.
  }
}

/** Devuelve la dirección del referidor vigente, o null si no hay o expiró. */
export function getReferrer(): Address | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredReferrer>;
    if (!parsed.address || !isAddress(parsed.address) || typeof parsed.savedAt !== "number") {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (Date.now() - parsed.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return getAddress(parsed.address);
  } catch {
    return null;
  }
}

/**
 * Referrer a pasar a buy(): nunca el propio comprador (el contrato también lo
 * ignora, pero así evitamos publicar la relación en la tx sin necesidad).
 */
export function getReferrerForBuy(buyer: Address | undefined): Address {
  const ref = getReferrer();
  if (!ref) return zeroAddress;
  if (buyer && getAddress(buyer) === ref) return zeroAddress;
  return ref;
}
