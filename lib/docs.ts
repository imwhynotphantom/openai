import type { Doc } from "./content";
import { docsEs } from "./i18n/docs/es";
import { docsEn } from "./i18n/docs/en";

/**
 * Doc pages (whitepaper, tokenomics, docs, audit, support, legal) por idioma.
 * Español = fuente de verdad legal; el resto de idiomas usa la versión inglesa
 * (cortesía) con aviso de traducción en la propia página.
 */
export function getDocs(locale: string): Record<string, Doc> {
  return locale === "es" ? docsEs : docsEn;
}

export const docSlugs = Object.keys(docsEs);
