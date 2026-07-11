import { tf } from "./config";
import type { Dictionary } from "./load";

type BuyDict = Dictionary["buy"];

type TemplateKeys =
  | "compraInsufficientSell"
  | "compraUsdEstimate"
  | "compraQuoteValidFor"
  | "compraModeSteps"
  | "listoSubtitle"
  | "bridgeSendCta"
  | "bridgeDepositInstructions"
  | "bridgeExpiresIn"
  | "depositPendingBanner"
  | "depositCreditedBanner";

export type BuyCopy = Omit<BuyDict, TemplateKeys> & {
  compraInsufficientSell: (symbol: string) => string;
  compraUsdEstimate: (v: string | number) => string;
  compraQuoteValidFor: (sec: number) => string;
  compraModeSteps: (n: number) => string;
  listoSubtitle: (balance: string) => string;
  bridgeSendCta: (network: string) => string;
  bridgeDepositInstructions: (amount: string, symbol: string) => string;
  bridgeExpiresIn: (sec: number) => string;
  depositPendingBanner: (amount: string) => string;
  depositCreditedBanner: (amount: string, open: string) => string;
};

/** Helpers de plantilla sobre el namespace `buy` del diccionario activo. */
export function createBuyCopy(d: BuyDict): BuyCopy {
  const { compraInsufficientSell, compraUsdEstimate, compraQuoteValidFor, compraModeSteps, listoSubtitle, bridgeSendCta, bridgeDepositInstructions, bridgeExpiresIn, depositPendingBanner, depositCreditedBanner, ...rest } = d;
  return {
    ...rest,
    compraInsufficientSell: (symbol) => tf(compraInsufficientSell, { symbol }),
    compraUsdEstimate: (v) => tf(compraUsdEstimate, { v }),
    compraQuoteValidFor: (sec) => tf(compraQuoteValidFor, { sec }),
    compraModeSteps: (n) => tf(compraModeSteps, { n }),
    listoSubtitle: (balance) => tf(listoSubtitle, { balance }),
    bridgeSendCta: (network) => tf(bridgeSendCta, { network }),
    bridgeDepositInstructions: (amount, symbol) => tf(bridgeDepositInstructions, { amount, symbol }),
    bridgeExpiresIn: (sec) => tf(bridgeExpiresIn, { sec }),
    depositPendingBanner: (amount) => tf(depositPendingBanner, { amount }),
    depositCreditedBanner: (amount, open) => tf(depositCreditedBanner, { amount, open }),
  };
}
