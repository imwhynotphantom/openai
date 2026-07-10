"use client";

import { css } from "@/lib/css";
import { useI18n } from "@/lib/i18n/LocaleProvider";

/** Zonas legales con micro-texto propio (antes brandLegal.legalChecklist.zones). */
type Zone = "ecosystem" | "docCta";

type Props = {
  children?: string;
  zone?: Zone;
};

export function LegalMicro({ children, zone }: Props) {
  const { t } = useI18n();
  const zoneText =
    zone === "ecosystem" ? t.legal.equityMicro : zone === "docCta" ? t.legal.marketingPitch : undefined;
  const text = children ?? zoneText ?? t.legal.microDisclaimer;
  return (
    <p style={css("font:400 12px/1.45 var(--font-mono);color:#A8A8AE;margin:10px 0 0")}>{text}</p>
  );
}
