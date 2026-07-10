"use client";

import { useMemo } from "react";
import { createBuyCopy, type BuyCopy } from "@/lib/i18n/buy-copy";
import { useI18n } from "@/lib/i18n/LocaleProvider";

export function useBuyCopy(): BuyCopy {
  const { t } = useI18n();
  return useMemo(() => createBuyCopy(t.buy), [t.buy]);
}
