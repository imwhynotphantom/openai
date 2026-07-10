"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, NUMBER_LOCALES, RTL_LOCALES, type Locale } from "./config";
import { loadDictionary, type Dictionary } from "./load";
import { setActiveNumberLocale } from "./runtime";

type I18nContextValue = {
  locale: Locale;
  /** Diccionario completo del idioma activo. */
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const v = useContext(I18nContext);
  if (!v) throw new Error("useI18n must be used within <LocaleProvider>");
  return v;
}

type Props = {
  initialLocale: Locale;
  initialDict: Dictionary;
  children: React.ReactNode;
};

export function LocaleProvider({ initialLocale, initialDict, children }: Props) {
  const router = useRouter();
  const [state, setState] = useState({ locale: initialLocale, t: initialDict });

  // El locale numérico debe estar listo ANTES del primer render de los hijos.
  setActiveNumberLocale(NUMBER_LOCALES[state.locale]);

  useEffect(() => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = RTL_LOCALES.has(state.locale) ? "rtl" : "ltr";
  }, [state.locale]);

  const setLocale = useCallback((locale: Locale) => {
    void loadDictionary(locale).then((dict) => {
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
      setState({ locale, t: dict });
      router.refresh();
    });
  }, [router]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale: state.locale, t: state.t, setLocale }),
    [state, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
