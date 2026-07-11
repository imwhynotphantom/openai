/**
 * Sistema de depósitos por comprador (multi-red → Base).
 *
 * La factory está desplegada de forma determinista (proxy CREATE2 canónico +
 * mismo salt + mismo owner), por lo que tendrá la MISMA dirección en todas las
 * cadenas EVM cuando se replique el deploy (Etapa 2). Las direcciones de
 * depósito (forwarders) se derivan con CREATE2 y coinciden entre redes.
 */

// ForwarderFactory — desplegada en Base mainnet (10-jul-2026).
// Salt: keccak256("openprotocol.forwarder.factory.v1"), owner 0xcbcb...1cF09.
export const FACTORY_ADDRESS = "0xff428eE2e2d9E1eB78f3493E1f0dD0ba92F91129" as const;

// keccak256(type(DepositForwarder).creationCode) — extraído del artifact de
// Hardhat y verificado contra factory.computeAddress() en el deploy y en
// contracts/test/Forwarder.test.js (test de paridad off-chain ↔ on-chain).
export const FORWARDER_INIT_CODE_HASH =
  "0xd21bdc6e284fcbfdf3aae1374e9a3d517abd12b9f2b4b88745067eabc3cd546d" as const;

// USDC NATIVO por red. ⚠️ Verificadas en circle.com/usdc. Nunca USDC.e/bridged.
export const USDC: Record<number, `0x${string}`> = {
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // Arbitrum (nativo)
  10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // Optimism
  137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // Polygon (nativo)
};

// ETAPA 1: solo Base. Etapa 2: [8453, 1, 42161, 10, 137].
export const CHAINS = [8453] as const;

export const CONFIRMATIONS: Record<number, number> = {
  8453: 10,
  1: 3,
  42161: 20,
  10: 10,
  137: 30,
};

// Mínimos de depósito en USDC (el de mainnet cubre el gas del barrido en L1).
export const MIN_DEPOSIT_USDC = 10;
export const MIN_DEPOSIT_ETH_MAINNET_USDC = 100;
