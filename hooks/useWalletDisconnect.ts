"use client";

import { useCallback } from "react";
import { useDisconnect } from "wagmi";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n/LocaleProvider";

/**
 * Desconexión completa: cierra la sesión del conector de wagmi
 * (incluida la sesión WalletConnect) y limpia el estado local de la app.
 */
export function useWalletDisconnect() {
  const { disconnect } = useDisconnect();
  const { disconnect: clearAppState } = useApp();
  const { t } = useI18n();

  return useCallback(() => {
    disconnect();
    clearAppState(t.common.walletDisconnected);
  }, [disconnect, clearAppState, t.common.walletDisconnected]);
}
