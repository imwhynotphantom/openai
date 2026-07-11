"use client";

import { useSearchParams } from "next/navigation";
import { css } from "@/lib/css";
import { useMyPurchaseCopy } from "@/hooks/useMyPurchaseCopy";
import { MyPurchaseView } from "@/components/purchase/MyPurchaseView";
import { StepCard, StepTitle } from "@/components/buy/ui/CopyAddressButton";

export default function MyPurchaseFlow() {
  const mp = useMyPurchaseCopy();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth";

  return (
    <main style={css("max-width:720px;margin:0 auto;padding:48px 24px 120px")}>
      <StepCard>
        <StepTitle title={mp.pageTitle} subtitle={mp.pageSubtitle} />
        {authError ? (
          <p style={css("font:500 13px var(--font-hanken);color:#D14343;margin:0 0 16px;text-align:center")}>
            {mp.authFailed}
          </p>
        ) : null}
        <MyPurchaseView />
      </StepCard>
    </main>
  );
}
