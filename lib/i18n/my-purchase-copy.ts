import { tf } from "./config";
import type { Dictionary } from "./load";

type MyPurchaseDict = Dictionary["myPurchase"];

type TemplateKeys = "pendingBanner" | "creditedSummary" | "openReserved";

export type MyPurchaseCopy = Omit<MyPurchaseDict, TemplateKeys> & {
  pendingBanner: (amount: string) => string;
  creditedSummary: (amount: string) => string;
  openReserved: (open: string) => string;
};

export function createMyPurchaseCopy(d: MyPurchaseDict): MyPurchaseCopy {
  const { pendingBanner, creditedSummary, openReserved, ...rest } = d;
  return {
    ...rest,
    pendingBanner: (amount) => tf(pendingBanner, { amount }),
    creditedSummary: (amount) => tf(creditedSummary, { amount }),
    openReserved: (open) => tf(openReserved, { open }),
  };
}
