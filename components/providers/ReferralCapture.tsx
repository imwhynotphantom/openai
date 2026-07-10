"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveReferrer } from "@/lib/referral";

/**
 * Captura ?ref=0x… en cualquier página y lo persiste 30 días.
 * Montar dentro de <Suspense> (useSearchParams lo exige en App Router).
 */
export function ReferralCapture() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    saveReferrer(ref);
  }, [ref]);

  return null;
}
