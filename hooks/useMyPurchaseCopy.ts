import { useMemo } from "react";
import { createMyPurchaseCopy, type MyPurchaseCopy } from "@/lib/i18n/my-purchase-copy";
import { useI18n } from "@/lib/i18n/LocaleProvider";

export function useMyPurchaseCopy(): MyPurchaseCopy {
  const { t } = useI18n();
  return useMemo(() => createMyPurchaseCopy(t.myPurchase), [t.myPurchase]);
}
