"use client";

import { useEffect, useRef, useState } from "react";
import { css } from "@/lib/css";
import { ACCENT } from "@/lib/format";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/LocaleProvider";

/** Selector de idioma tipo ChatGPT: globo + código, dropdown con nombres nativos. */
export function LanguagePicker() {
  const { locale, t, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code: Locale) => {
    setOpen(false);
    if (code !== locale) setLocale(code);
  };

  return (
    <div ref={rootRef} data-lang-picker style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t.nav.language}
        onClick={() => setOpen((v) => !v)}
        style={css(
          "appearance:none;cursor:pointer;display:flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid #ECECEC;background:#fff;border-radius:999px;color:#0D0D0D"
        )}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6B76" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z" />
        </svg>
        <span data-lang-code style={css("font:600 12px var(--font-mono);letter-spacing:0.04em;text-transform:uppercase")}>{locale}</span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t.nav.language}
          style={css(
            "position:absolute;top:calc(100% + 8px);right:0;z-index:200;min-width:190px;max-height:min(420px,70vh);overflow-y:auto;background:#fff;border:1px solid #ECECEC;border-radius:14px;box-shadow:0 18px 44px -18px rgba(13,13,13,0.28);padding:6px"
          )}
        >
          {SUPPORTED_LOCALES.map(({ code, label }) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(code)}
                style={{
                  ...css(
                    "appearance:none;cursor:pointer;border:none;width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 12px;border-radius:9px;text-align:left;font:500 14px var(--font-hanken)"
                  ),
                  background: active ? "#F2F2F3" : "transparent",
                  color: "#0D0D0D",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#F7F7F8";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{label}</span>
                <span style={css("display:inline-flex;align-items:center;gap:8px")}>
                  <span style={css("font:500 10px var(--font-mono);letter-spacing:0.05em;text-transform:uppercase;color:#A8A8AE")}>{code}</span>
                  {active ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
