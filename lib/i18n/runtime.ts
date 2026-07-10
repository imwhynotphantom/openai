/**
 * Locale numérico activo para helpers no-React (toLocaleString en libs).
 * Lo sincroniza LocaleProvider al cambiar de idioma.
 */

let activeNumberLocale = "es-ES";

export function setActiveNumberLocale(locale: string) {
  activeNumberLocale = locale;
}

export function getActiveNumberLocale(): string {
  return activeNumberLocale;
}
