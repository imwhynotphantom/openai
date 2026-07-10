import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, pickFromAcceptLanguage, type Locale } from "./config";

/** Locale de la petición: cookie → Accept-Language → español. */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  const headerStore = await headers();
  return pickFromAcceptLanguage(headerStore.get("accept-language")) ?? DEFAULT_LOCALE;
}
