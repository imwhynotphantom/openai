"use client";

import Link from "next/link";
import { css } from "@/lib/css";
import { useI18n } from "@/lib/i18n/LocaleProvider";

export function GeoNotice() {
  const { t } = useI18n();
  return (
    <p style={css("font:400 11px/1.45 var(--font-mono);color:#A8A8AE;margin:0")}>
      {t.legal.geoNotice}{" "}
      <Link href="/docs/terms#elegibilidad" prefetch style={css("color:#6B6B76;text-decoration:underline")}>
        {t.legal.geoEligibility}
      </Link>
    </p>
  );
}
