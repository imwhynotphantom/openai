"use client";

import Link from "next/link";
import { css } from "@/lib/css";
import { legalUrls } from "@/lib/legal.config";
import { useI18n } from "@/lib/i18n/LocaleProvider";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function LegalConsent({ checked, onChange }: Props) {
  const { t } = useI18n();
  return (
    <label
      style={css(
        "display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px;background:#F7F7F8;border-radius:12px;cursor:pointer;font:400 13px/1.5 var(--font-hanken);color:#5C5C66"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 3, accentColor: "#0D0D0D", flex: "none" }}
      />
      <span>
        {t.legal.consentPrefix}{" "}
        <Link href={legalUrls.terms} prefetch style={css("color:#0D0D0D;font-weight:600")}>
          {t.legal.consentTerms}
        </Link>
        {t.legal.consentPrivacyJoin}{" "}
        <Link href={legalUrls.privacy} prefetch style={css("color:#0D0D0D;font-weight:600")}>
          {t.legal.consentPrivacy}
        </Link>{" "}
        {t.legal.consentRisksJoin}{" "}
        <Link href={legalUrls.risks} prefetch style={css("color:#0D0D0D;font-weight:600")}>
          {t.legal.risksDocTitle}
        </Link>
        .
      </span>
    </label>
  );
}
