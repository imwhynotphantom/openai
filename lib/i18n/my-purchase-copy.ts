import { tf } from "./config";
import type { Dictionary } from "./load";

type MyPurchaseDict = Dictionary["myPurchase"];

type TemplateKeys = "pendingBanner" | "creditedSummary" | "openReserved" | "statsRelation" | "historyOpenLine";

export type MyPurchaseCopy = Omit<MyPurchaseDict, TemplateKeys> & {
  pendingBanner: (amount: string, open: string) => string;
  creditedSummary: (amount: string) => string;
  openReserved: (open: string) => string;
  statsRelation: (usdc: string, open: string) => string;
  historyOpenLine: (open: string) => string;
};

export function createMyPurchaseCopy(d: MyPurchaseDict): MyPurchaseCopy {
  const { pendingBanner, creditedSummary, openReserved, statsRelation, historyOpenLine, ...rest } = d;
  return {
    ...rest,
    pendingBanner: (amount, open) => tf(pendingBanner, { amount, open }),
    creditedSummary: (amount) => tf(creditedSummary, { amount }),
    openReserved: (open) => tf(openReserved, { open }),
    statsRelation: (usdc, open) => tf(statsRelation, { usdc, open }),
    historyOpenLine: (open) => tf(historyOpenLine, { open }),
  };
}
