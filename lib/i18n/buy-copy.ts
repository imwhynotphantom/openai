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
  | "depositCreditedBanner"
  | "depositCalcResult"
  | "depositCalcMinHint"
  | "depositCalcMinEthNote"
  | "depositLinkWalletReplaceConfirm"
  | "depositLinkWalletAlreadyLinked";

export type BuyCopy = Omit<BuyDict, TemplateKeys> & {
  compraInsufficientSell: (symbol: string) => string;
  compraUsdEstimate: (v: string | number) => string;
  compraQuoteValidFor: (sec: number) => string;
  compraModeSteps: (n: number) => string;
  listoSubtitle: (balance: string) => string;
  bridgeSendCta: (network: string) => string;
  bridgeDepositInstructions: (amount: string, symbol: string) => string;
  bridgeExpiresIn: (sec: number) => string;
  depositPendingBanner: (amount: string, open: string) => string;
  depositCreditedBanner: (amount: string, open: string) => string;
  depositCalcResult: (usdc: string, open: string) => string;
  depositCalcMinHint: (min: string) => string;
  depositCalcMinEthNote: (min: string) => string;
  depositLinkWalletReplaceConfirm: (from: string, to: string) => string;
  depositLinkWalletAlreadyLinked: (address: string) => string;
};

/** Helpers de plantilla sobre el namespace `buy` del diccionario activo. */
export function createBuyCopy(d: BuyDict): BuyCopy {
  const { compraInsufficientSell, compraUsdEstimate, compraQuoteValidFor, compraModeSteps, listoSubtitle, bridgeSendCta, bridgeDepositInstructions, bridgeExpiresIn, depositPendingBanner, depositCreditedBanner, depositCalcResult, depositCalcMinHint, depositCalcMinEthNote, depositLinkWalletReplaceConfirm, depositLinkWalletAlreadyLinked, ...rest } = d;
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
    depositPendingBanner: (amount, open) => tf(depositPendingBanner, { amount, open }),
    depositCreditedBanner: (amount, open) => tf(depositCreditedBanner, { amount, open }),
    depositCalcResult: (usdc, open) => tf(depositCalcResult, { usdc, open }),
    depositCalcMinHint: (min) => tf(depositCalcMinHint, { min }),
    depositCalcMinEthNote: (min) => tf(depositCalcMinEthNote, { min }),
    depositLinkWalletReplaceConfirm: (from, to) => tf(depositLinkWalletReplaceConfirm, { from, to }),
    depositLinkWalletAlreadyLinked: (address) => tf(depositLinkWalletAlreadyLinked, { address }),
  };
}
