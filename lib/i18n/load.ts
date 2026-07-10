import type { Locale } from "./config";
import { LOCALE_CODES } from "./config";
import type { Dictionary } from "./dictionaries/es";
import esDict from "./dictionaries/json/es.json";

const cache = new Map<Locale, Dictionary>([["es", esDict as Dictionary]]);

async function loadJson(locale: Locale): Promise<Dictionary> {
  if (locale === "es") return esDict as Dictionary;
  try {
    const mod = await import(`./dictionaries/json/${locale}.json`);
    return mod.default as Dictionary;
  } catch {
    if (locale !== "en") {
      try {
        const en = await import("./dictionaries/json/en.json");
        return en.default as Dictionary;
      } catch {
        return esDict as Dictionary;
      }
    }
    return esDict as Dictionary;
  }
}

const loaders = Object.fromEntries(
  LOCALE_CODES.map((code) => [code, () => loadJson(code)])
) as Record<Locale, () => Promise<Dictionary>>;

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  const cached = cache.get(locale);
  if (cached) return cached;
  const dict = await loaders[locale]();
  cache.set(locale, dict);
  return dict;
}

export type { Dictionary };
