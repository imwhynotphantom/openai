export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  RTL_LOCALES,
  NUMBER_LOCALES,
  isLocale,
  tf,
  type Locale,
} from "./config";
export { loadDictionary, type Dictionary } from "./load";
export { LocaleProvider, useI18n } from "./LocaleProvider";
export { getActiveNumberLocale } from "./runtime";
