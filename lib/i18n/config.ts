/**
 * Configuración de idiomas soportados (estilo ChatGPT: mismas URLs,
 * selector de idioma + cookie). Añadir un idioma = añadir entrada aquí
 * y crear su diccionario en lib/i18n/dictionaries/{code}.ts.
 */

export const SUPPORTED_LOCALES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "tr", label: "Türkçe" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number]["code"];

export const LOCALE_CODES = SUPPORTED_LOCALES.map((l) => l.code) as Locale[];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Idiomas con escritura de derecha a izquierda. */
export const RTL_LOCALES: ReadonlySet<string> = new Set(["ar"]);

/** Locale BCP-47 para Intl / toLocaleString por idioma de UI. */
export const NUMBER_LOCALES: Record<Locale, string> = {
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  nl: "nl-NL",
  pl: "pl-PL",
  tr: "tr-TR",
  ru: "ru-RU",
  ar: "ar-SA",
  hi: "hi-IN",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && (LOCALE_CODES as string[]).includes(value));
}

/** Primer idioma soportado del header Accept-Language (primera visita). */
export function pickFromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const primary = tag.split("-")[0];
    if (isLocale(tag)) return tag;
    if (isLocale(primary ?? "")) return primary as Locale;
  }
  return undefined;
}

/** Interpola plantillas "{clave}" con valores dinámicos. */
export function tf(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
