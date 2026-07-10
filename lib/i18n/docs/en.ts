import type { Doc } from "@/lib/content";
import { legalConfig } from "@/lib/legal.config";

/**
 * Documents (whitepaper, tokenomics, docs, audit, support, legal) — ENGLISH.
 * Courtesy translation: the Spanish version (lib/i18n/docs/es.ts) prevails
 * in case of discrepancy. Locales other than Spanish fall back to this file.
 */

const { contactLegal, contactPrivacy, governanceUrl } = legalConfig;

const lastUpdated = "June 29, 2026";
const protocolName = "openAI Protocol";
const governanceModel =
  "On-chain governance by OPEN holders; protocol parameters (treasury allocation, buybacks, liquidity) voted by the community";
const tokenContractAddress = "[TO COMPLETE: 0x… or pending deployment]";
const tokenChain = "[TO COMPLETE: e.g. Ethereum, Base, Arbitrum]";
const operatorName = "openAI Protocol — Protocol contributors";
const operatorCountry =
  "Global protocol; SPV vehicle subject to the jurisdiction defined by governance";
const operatorAddress =
  "No single registered office. Communications via the protocol's public channels.";
const restrictedList =
  "United States (except permitted states); North Korea; Iran; Syria; Cuba; Crimea; any territory under international sanctions";

const summary =
  "Funds contributed by investors (via OPEN purchases or stablecoins held in treasury) are allocated in two layers: (1) acquisition and custody of real OpenAI, Inc. shares in an off-chain legal vehicle, and (2) operation of the openAI Protocol product ecosystem to generate recurring revenue. The token's value derives from the treasury's composite NAV (equity + operating cash) and from the buyback program funded by fees.";

const legalBoundary =
  "OPEN is a participation in the openAI Protocol treasury, not a share issued by OpenAI, Inc. It confers no voting rights, direct dividends or cap-table registration. The treasury may hold OpenAI, Inc. shares via an SPV; there is no 1:1 parity nor guaranteed redemption into shares.";

const legalBoundaryMarketing =
  "OPEN represents an economic participation in the protocol treasury, which includes OpenAI, Inc. shares held in custody by an SPV. The market price tracks the composite NAV and may deviate from the company's valuation.";

const phaseSubscription =
  "The investor acquires OPEN in the primary presale or in on-chain pools, paying with USDC, ETH, WETH or cbBTC on Base, or with funds bridged from other networks. The treasury contract (TreasuryRouter) records the operation on-chain and routes the collateral to the protocol's treasury multisig wallet.";

const phaseEquity =
  "The treasury transfers capital to the off-chain vehicle (SPV / regulated trust) in charge of buying and holding OpenAI, Inc. shares on private secondary markets. The SPV publishes periodic attestations of the holding (equity NAV, valuation date, custodian). The NAV oracle ingests those attestations as a reference-price input.";

const phaseOperating =
  "Part of the treasury funds the operation of the open* ecosystem (openChat, openAPI, openImage, openMotion, openVoice, openCode): infrastructure, APIs, compute and distribution. Revenue from subscriptions, per-token/credit consumption and transaction fees is consolidated in the Operating Revenue Pool (an audited contract or segregated account).";

const phaseValueAccrual =
  "The protocol's economic value combines two engines: (A) appreciation of the position in OpenAI, Inc. shares (mark-to-market of the SPV), and (B) net operating surplus of the products. Composite NAV = equity NAV + operating reserves − liabilities. OPEN's market price gravitates toward the composite NAV, modulated by on-chain liquidity.";

const phaseBuyback =
  "30% of the net fees in the Operating Revenue Pool are automatically routed to the BuybackBurn contract — before and after the IPO. The contract executes OPEN buy orders against liquidity pools and sends the tokens to an irreversible burn address. The remainder is reinvested: OpenAI, Inc. equity accumulation, liquidity or growth of the open* ecosystem, per governance.";

const components = [
  ["Treasury Multisig", "On-chain custody of stablecoins/ETH; authorizes transfers to the SPV and ops."],
  ["Equity SPV (off-chain)", "Buys, holds and values OpenAI, Inc. shares; issues holding attestations."],
  ["Operating Revenue Pool", "Consolidates open* product revenue; automatic buyback / reinvestment split."],
  ["BuybackBurn (on-chain)", "Programmatic OPEN buybacks and verifiable burning."],
  ["NAV Oracle", "Aggregates equity NAV (SPV) + operating reserves; publishes the reference price."],
  ["OPEN (ERC-20)", "Economic participation in the protocol treasury, tied to equity and open* revenue."],
] as const;

const allocationEquity =
  "The majority of net capital from new subscriptions is allocated to OpenAI, Inc. equity accumulation.";
const allocationOps = "Operating reserve for APIs, compute and distribution of the open* ecosystem.";
const allocationLiquidity = "Collateral in on-chain pools for OPEN secondary liquidity.";
const allocationBuyback =
  "30% of net fees → BuybackBurn on a continuous basis (pre and post IPO); the rest per governance proposal (equity reinforcement and open* growth).";

const postOpiFlywheel =
  "The IPO does not close the loop: the treasury keeps buying OpenAI, Inc. shares (public and private markets), openChat, openAPI and the other services generate usage revenue, and 30% of those fees is continuously allocated to buying back and burning OPEN.";

const tokenNatureParagraph =
  "OPEN gives you participation in the openAI Protocol treasury, which buys and holds real OpenAI, Inc. shares and operates the open* ecosystem. Get on-chain access today; after the IPO, the treasury keeps accumulating shares and buying back OPEN with revenue from openAPI and the open* services.";

const shortDisclaimer =
  "openAI Protocol operates independently of OpenAI, Inc. OPEN channels investment through the protocol treasury; it is not a share issued by OpenAI, Inc.";

const affiliationNoticeSoft =
  "With OPEN you participate in the treasury that invests in real OpenAI, Inc. shares — on-chain, with liquidity and a flywheel that remains active after the IPO.";

const footerDisclaimer =
  "openAI Protocol is a decentralized ecosystem. OpenAI, OpenAI, Inc. and related trademarks belong to their owners. This website does not constitute an offer of securities or investment advice. Investing involves risk.";

const ecosystemDisclaimer =
  "openChat, openAPI, openImage, openMotion, openVoice and openCode are products of the openAI Protocol ecosystem. ChatGPT, DALL·E, Sora, Whisper and Codex are trademarks of OpenAI, Inc.";

const geoNotice =
  "Service intended for permitted jurisdictions. Check that the use of crypto-assets is allowed in your country.";

const navDisclaimer =
  "The market price may deviate from the published NAV; there is no fixed parity with individual shares.";

const opiContext =
  "Expected IPO · September 2027 · market milestone; the protocol keeps accumulating shares and buying back OPEN";

const equityMicro =
  "The treasury accumulates real OpenAI, Inc. shares before and after the IPO; open* revenue funds more equity and OPEN buybacks.";

const affiliationNotice =
  "openAI Protocol channels investment toward OpenAI, Inc. independently. OpenAI, Inc. is an independent entity and does not operate or endorse the openAI Protocol.";

export const docsEn: Record<string, Doc> = {
  whitepaper: {
    eyebrow: "Whitepaper",
    title: "OPEN Whitepaper",
    meta: "Version 1.2 · Updated in 2026",
    subtitle:
      "OPEN token specification: a treasury backed by OpenAI, Inc. shares, the open* operating layer and the buyback mechanism.",
    hasStats: true,
    stats: [
      { value: "21,000M", label: "Total supply" },
      { value: "30%", label: "Fees to buybacks" },
      { value: "ERC-20", label: "Token standard" },
      { value: "2027", label: "Expected IPO" },
    ],
    sections: [
      { h: "Executive summary", p: [summary, "The design pursues three goals: accumulating — and continuing to accumulate — real OpenAI, Inc. equity (before, during and after its IPO), permanently monetizing the openAI Protocol product ecosystem, and maintaining on-chain liquidity for the OPEN token without centralized custody of the investor's tokens.", postOpiFlywheel, legalBoundaryMarketing + " This document is informational and does not constitute financial advice."] },
      { h: "1. Context and motivation", p: ["High-growth private companies concentrate much of their appreciation in the stages before going public, a period retail investors rarely have access to. By the time the company finally lists, much of the appreciation has already happened and remains reserved for institutional investors and private rounds.", "OPEN proposes an on-chain flywheel: subscribers' capital funds the purchase of real OpenAI, Inc. shares and the operation of open* products that generate recurring revenue. Those flows consolidate into a composite NAV that guides the token's market value."] },
      { h: "2. The OPEN token", p: ["OPEN (OPENPROTOCOL) is a fungible token conforming to the ERC-20 standard, deployed on the Base network. The total supply is fixed and immutable at 21,000,000,000 units; the contract has no mint function, so supply can only stay flat or decrease.", tokenNatureParagraph, legalBoundaryMarketing] },
      {
        h: "3. Treasury mechanism — capital → real shares",
        p: [
          phaseSubscription,
          phaseEquity,
          `Allocation policy (indicative, subject to governance): ${allocationEquity} ${allocationOps} ${allocationLiquidity}`,
          "SPV attestations (holding, custodian, valuation date) are published periodically and feed the NAV Oracle module. OPEN's market price tracks the composite NAV and may deviate from the unit valuation of the equity in the SPV.",
        ],
      },
      {
        h: "4. Operating layer — open* products → revenue",
        p: [
          phaseOperating,
          "The ecosystem's products (openChat, openAPI, openImage, openMotion, openVoice, openCode) bill by subscription, per-token consumption, credit or seat. Each operation emits a verifiable FeeCollected event that feeds the Operating Revenue Pool.",
          phaseValueAccrual,
        ],
      },
      { h: "5. Link to OpenAI, Inc.'s valuation", p: ["The SPV's equity NAV is marked to market using private-round valuations before the IPO and the official quote after listing. The oracle aggregates equity NAV + operating reserves to publish the composite reference NAV.", "After the IPO, the treasury does not liquidate its position: it keeps accumulating shares on public and private markets while openAPI and the open* services generate revenue that funds OPEN buybacks and new equity purchases.", "The anchor is not rigid parity: the on-chain market sets the price at all times, but the composite NAV provides the fundamental signal that guides arbitrage and keeps the token correlated with the underlying assets."] },
      { h: "6. Value accrual", p: [phaseBuyback, `Split policy: ${allocationBuyback}`, "This mechanism converts ecosystem usage and equity appreciation into structural pressure on OPEN, independent of speculative market activity."] },
      { h: "7. Supply distribution", p: ["The 21,000,000,000 OPEN supply is distributed as follows: 9.95% to the public presale (2,089,500,000 OPEN, received at TGE via claim), 40% to on-chain liquidity (8,400,000,000 OPEN, allocated to the liquidity pool at TGE with locked LP), 20% to treasury and ecosystem (4,200,000,000 OPEN, buybacks, burning and ecosystem development), 15% to marketing (3,150,000,000 OPEN, available from TGE), 5% to the team (1,050,000,000 OPEN) and 10.05% to future rounds (2,110,500,000 OPEN, locked).", "The team allocation is locked for 3 years: a 1-year cliff plus linear vesting over the following 2 years, verifiable on-chain."] },
      { h: "8. Liquidity and market", p: ["The 40% of supply allocated to liquidity is deployed in the on-chain pool at TGE, with the LP locked, guaranteeing that any investor can buy or sell OPEN at any time. Presale buyers receive their OPEN at TGE via claim and are not subject to any further lock-up.", "Pool depth and fee parameters are calibrated to minimize slippage for typical trade sizes and to sustain an orderly market during buyback events."] },
      {
        h: "9. Technical architecture",
        p: [
          "System components:",
          ...components.map(([name, role]) => `· ${name}: ${role}`),
          "The on-chain contracts (OPEN, BuybackBurn, TreasuryRouter, governance) are independent, audited and verified on the block explorer. The off-chain SPV and Operating Revenue Pool publish periodic reports linked on-chain via attestation hashes.",
        ],
      },
      { h: "10. Price oracle", p: ["The oracle aggregates equity NAV (SPV attestations), operating reserves and OPEN's market price. It uses time windows and medians to resist one-off manipulation and low-liquidity spikes.", "In case of an anomalous discrepancy between sources, the oracle enters a conservative mode that pauses sensitive parameters until data normalizes."] },
      { h: "11. Governance", p: ["Certain protocol parameters —such as the share of fees allocated to buybacks, the equity/ops allocation policy or liquidity configuration— can be adjusted through on-chain governance, within maximum and minimum ranges hard-coded in the contracts.", "The medium-term goal is to progressively transfer these decisions to OPEN holders, moving toward decentralized administration of the protocol."] },
      { h: "12. Security", p: ["The contracts have been reviewed by independent auditors, with no outstanding critical or high-severity findings. There is also a reward program for responsible vulnerability disclosure.", "The protocol is self-custodial with respect to the investor's OPEN tokens: openAI Protocol does not control your wallet keys. Custody of the off-chain equity rests with the designated SPV; its holdings are audited periodically."] },
      { h: "13. Roadmap", p: ["2026 — Public presale, on-chain liquidity deployment, first equity acquisition via SPV and activation of the buyback mechanism.", "2027 — OpenAI, Inc. IPO: integration of the official quote into the NAV Oracle, scaling of openAPI and the open* services, and continued accumulation of shares in the treasury.", "2028 and beyond — Flywheel in motion: more revenue from API and service usage, more OPEN buybacks and burns, more OpenAI, Inc. equity, and progressive transition of governance to holders."] },
      { h: "14. Third-party trademarks", p: [ecosystemDisclaimer, "References to OpenAI, Inc. products (ChatGPT, DALL·E, Sora, Whisper, Codex) in this document are comparative or descriptive of the underlying asset and imply no license or affiliation."] },
      { h: "15. Legal notice", p: [`This document is informational. ${summary} ${legalBoundary}`, shortDisclaimer, "Nothing herein constitutes an investment offer or financial advice."] },
    ],
  },
  tokenomics: {
    eyebrow: "Tokenomics",
    title: "OPEN Tokenomics",
    meta: "Fixed supply · 21,000,000,000 OPEN",
    subtitle:
      "Supply distribution, lock-up schedules and presale conditions. Tokens purchased in the presale are received at launch (TGE) via claim.",
    hasStats: true,
    stats: [
      { value: "21,000M", label: "Total supply" },
      { value: "9.95%", label: "Public presale" },
      { value: "40%", label: "On-chain liquidity" },
      { value: "5%", label: "Team (locked 3 years)" },
    ],
    sections: [
      {
        h: "The token",
        p: [
          "Name: OPENPROTOCOL. Symbol: OPEN. Network: Base.",
          "Total supply: 21,000,000,000 OPEN, fixed and immutable. The contract has no mint function: supply can only stay flat or decrease.",
        ],
      },
      {
        h: "Supply distribution",
        p: [
          "· Public presale — 9.95% — 2,089,500,000 OPEN — Received at launch (TGE) via claim.",
          "· On-chain liquidity — 40% — 8,400,000,000 OPEN — Allocated to the liquidity pool at TGE, with locked LP.",
          "· Treasury / Ecosystem — 20% — 4,200,000,000 OPEN — Buybacks and burning, ecosystem development.",
          "· Marketing — 15% — 3,150,000,000 OPEN — Available from TGE.",
          "· Team — 5% — 1,050,000,000 OPEN — Locked 3 years: 1-year cliff + 2-year linear vesting, verifiable on-chain.",
          "· Future rounds — 10.05% — 2,110,500,000 OPEN — Locked.",
        ],
      },
      {
        h: "Presale",
        p: [
          "Important notice: tokens purchased in the presale are received at launch (TGE) via claim.",
          "Price: 0.0005 USDC per OPEN.",
          "Hard cap: 1,045,000 USDC. The limit is set in the contract; purchases are automatically rejected once it is reached.",
          "The presale is public and open, with no per-wallet limit. Funds are held in a Safe multisig.",
        ],
      },
      {
        h: "Lock-up schedule",
        p: [
          "Team: locked 3 years in total — 1-year cliff and linear vesting over the following 2 years, verifiable on-chain.",
          "Future rounds: locked.",
          "Liquidity: the on-chain pool's LP is locked from TGE.",
        ],
      },
      {
        h: "Buyback and burn",
        p: [
          "The protocol treasury (20% of supply) funds OPEN buybacks and burning along with ecosystem development. In addition, 30% of ecosystem fees fund periodic buybacks that are permanently and verifiably removed from circulation.",
        ],
      },
      {
        h: "Liquidity",
        p: [
          "40% of the supply goes to the on-chain liquidity pool at TGE, with the LP locked, to guarantee that any investor can buy or sell OPEN at any time.",
        ],
      },
    ],
  },
  docs: {
    eyebrow: "Documentation",
    title: "Developer documentation",
    meta: "API and contract reference · v1",
    subtitle: "Integration guides, protocol contract reference and endpoints to query OPEN price, supply, portfolio and operations.",
    sections: [
      { h: "Introduction", p: ["This documentation covers everything needed to integrate OPEN into an application: wallet connection, reading market data, executing purchases and swaps, and reacting to on-chain events.", "The protocol exposes two complementary surfaces: the smart contracts (to operate directly and without intermediaries) and a data API (for low-latency market and portfolio queries)."] },
      { h: "Getting started", p: ["To operate you need a compatible wallet: MetaMask, Coinbase Wallet, WalletConnect or Rainbow. Connect the wallet to the protocol's EVM network and make sure you have balance for network fees.", "From the front end, the connection uses a standard provider (EIP-1193). Once the wallet is connected, you can read balances, request signatures and send transactions to the protocol contracts."] },
      { h: "Authentication", p: ["Market API reads are public and require no authentication. Operations affecting funds are always authorized with the user's wallet signature; the protocol never asks for private keys or recovery phrases.", "For server integrations (e.g. internal dashboards), read-only API keys with configurable usage limits are issued."] },
      { h: "Protocol contracts", p: ["The system consists of three contracts: the OPEN token (ERC-20), the buyback-and-burn module, and the governance module.", "The token implements the standard ERC-20 interface: balanceOf, transfer, approve, allowance and transferFrom, plus the Transfer and Approval events. The addresses of the three contracts and their ABIs are verified and published on the block explorer.", "We recommend pinning the ABI version in your integration and validating the contract address against the official list to avoid spoofing."] },
      { h: "Buying and swapping", p: ["Purchases execute on-chain from the user's wallet. The typical flow is: approve of the source token (if applicable), simulation of the operation to estimate the received amount and slippage, and sending the transaction.", "The presale accepts USDC, ETH, WETH and cbBTC on the Base network: tokens other than USDC are converted via an aggregator (0x) within the same operation. Funds from other networks (Ethereum, Arbitrum, Solana, Bitcoin…) are also supported and are automatically bridged to USDC on Base before the purchase."] },
      { h: "Market API", p: ["It exposes REST and WebSocket endpoints for real-time price, quote history by range (1D, 1W, 1M, 1Y, all), circulating supply, total supply, volume and market cap.", "Data is served with timestamps and streamed over WebSocket so you can build live charts and tickers without constant polling."] },
      { h: "Portfolio API", p: ["Given a public address, it lets you query per-asset balances, total value, average acquisition cost and the P&L of the OPEN position.", "The operations history returns purchases, sales and swaps with their type, amounts, execution price, fee and timestamp."] },
      { h: "Webhooks and events", p: ["You can subscribe to on-chain events —purchase, sale, swap and buyback/burn— to react to activity in your own application.", "Each event includes the address involved (masked where appropriate), the amounts and the transaction hash, so you can link to the block explorer for verification."] },
      { h: "Rate limits", p: ["The public API applies limits per IP and per key. If you need higher throughput for a production integration, you can request a key with extended limits.", "Responses include headers with the remaining quota so your client can pace its requests."] },
      { h: "Error handling", p: ["The API uses standard HTTP codes and an error body with a readable identifier and a descriptive message. On-chain operations may revert; in that case, the prior simulation indicates the reason (insufficient balance, slippage exceeded, insufficient allowance) before spending network fees."] },
      { h: "Best practices", p: ["Always simulate operations before sending them, show the user the minimum received amount and fees, and validate contract addresses. Never request or store private keys: all authorization must go through the user's wallet signature."] },
    ],
  },
  audit: {
    eyebrow: "Audit",
    title: "Security and audits",
    meta: "Contracts verified on-chain",
    subtitle: "The protocol contracts have been reviewed by independent auditors. The code is open and verifiable.",
    sections: [
      { h: "Scope", p: ["The audit covers the ERC-20 token, the buyback/burn module and the governance module, including access control, balance arithmetic and the burn flows."] },
      { h: "Results", p: ["No outstanding critical or high-severity findings. Medium and low-severity observations were resolved and re-verified. The full report is publicly available."] },
      { h: "Non-custodial", p: ["openAI Protocol does not hold users' funds in custody. OPEN is sent directly to the investor's wallet; only the user controls their private keys."] },
      { h: "Bug bounty", p: ["A bug bounty program exists to incentivize responsible vulnerability disclosure by the security community."] },
    ],
  },
  support: {
    eyebrow: "Support",
    title: "Support center",
    meta: "Average response < 24 h",
    subtitle: "Need help with a purchase, a swap or your wallet? Here are the contact channels and the most frequent questions.",
    sections: [
      { h: "Contact", p: ["Write to soporte@openai.demo or via the in-app chat. The team replies within 24 hours on business days."] },
      { h: "Issues with a purchase", p: ["All purchases are on-chain transactions signed from your wallet: you can check their status on Basescan with the transaction hash. If a bridge from another network is pending, the buy screen shows its status in real time; transfers with an amount different from the indicated one may be delayed or automatically refunded to the origin address."] },
      { h: "Recovering access", p: ["The protocol does not hold your keys: if you lose access to your wallet, you must recover it with your recovery phrase. Never share your seed phrase with anyone, not even with support."] },
      { h: "Service status", p: ["We publish incidents and scheduled maintenance on the status page. On-chain liquidity allows trading even during interface maintenance."] },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms and conditions",
    meta: `Last updated: ${lastUpdated}`,
    subtitle: `Terms of use of the ${protocolName} protocol. By using this interface, you accept these terms.`,
    sections: [
      {
        h: "1. Decentralized nature",
        p: [
          `${protocolName} is a tokenized protocol and ecosystem operated in a decentralized manner. There is no limited company nor a single central operator holding assets in custody or acting as an investment entity.`,
          `The protocol's rules are executed through smart contracts and governance decisions: ${governanceModel}. OPEN token contract (where applicable): ${tokenContractAddress} on ${tokenChain}.`,
          "This website is an interface maintained by ecosystem contributors. OpenAI, Inc. is an independent entity and does not operate or endorse the openAI Protocol.",
        ],
      },
      {
        h: "2. Relationship with OpenAI, Inc. and the OPEN token",
        id: "openai-inc",
        p: [
          "OpenAI, Inc. is the underlying asset to which the protocol allocates capital via treasury and SPV, as described in the documentation.",
          tokenNatureParagraph + " " + legalBoundary,
          "The OpenAI and ChatGPT trademarks and related logos are the property of their owners. Their use on this site is referential or descriptive.",
        ],
      },
      {
        h: "3. Interface and contributors",
        p: [
          "The interface makes it easy to check market data, connect a wallet and request operations with the OPEN token. Protocol contributors may update the frontend, documentation or integrations, subject to governance where applicable.",
          `Designated legal communications: ${contactLegal}. Governance forum: ${governanceUrl}.`,
          "We are not a bank, a centralized payment entity or an investment advisor. We do not store your private keys.",
        ],
      },
      {
        h: "4. On-chain payments and conversions",
        p: [
          "All purchases are paid with crypto-assets (USDC, ETH, WETH or cbBTC on the Base network) and signed from the user's wallet. The interface does not accept card payments or other fiat methods.",
          "If you pay with a token other than USDC, the conversion executes on-chain through a liquidity aggregator (0x) within the same operation. If you bring funds from another network, the bridge is executed by Relay's infrastructure and the USDC is delivered to your own Base wallet.",
          "Conversion costs and network fees are shown before confirming. On-chain transactions are irreversible once confirmed.",
        ],
      },
      {
        h: "5. Eligibility and restricted territories",
        id: "elegibilidad",
        p: [
          "You must be of legal age in your jurisdiction and have legal capacity to contract.",
          `You may not use the service if you reside in or access it from: ${restrictedList}.`,
          geoNotice,
          "You are responsible for checking that the use of crypto-assets and the purchase of tokens is allowed in your country.",
        ],
      },
      {
        h: "6. Risks",
        p: [
          "The value of OPEN may fluctuate. Invest only what you can afford to lose.",
          "Read the Risk information before trading. Nothing on this website constitutes financial, tax or legal advice.",
        ],
      },
      {
        h: "7. Limitation of liability",
        p: [
          "To the maximum extent permitted by law, protocol contributors and interface maintainers are not liable for losses arising from market volatility, smart-contract failures, frontend bugs, third-party failures (wallets, blockchains, payment providers), user error or force majeure.",
          "The protocol is provided \u201cas is\u201d. Community governance may modify parameters; it is your responsibility to stay informed about active proposals.",
        ],
      },
      {
        h: "8. Modifications",
        p: ["We may update these terms. The date of the latest version appears at the top. Continued use of the service implies acceptance of the changes."],
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    meta: `Last updated: ${lastUpdated}`,
    subtitle: `${protocolName} protocol. How data is handled when using this interface.`,
    sections: [
      {
        h: "1. Data controllers",
        p: [
          `${protocolName} is a decentralized ecosystem. For GDPR compliance and privacy inquiries, contact the community-designated channel: ${contactPrivacy} (${operatorName}).`,
          `Jurisdictional reference: ${operatorCountry}. ${operatorAddress}`,
          "On-chain data (wallet addresses, transactions) is public by blockchain design.",
        ],
      },
      {
        h: "2. Data we process",
        p: [
          "Public wallet address, operation history on the platform, language preferences and technical data (IP, device, error logs).",
          "If you sign up or connect a wallet, we may associate your address with your account.",
          "We do not collect card data or perform identity verification (KYC): all payments are crypto-assets signed from your own wallet.",
        ],
      },
      {
        h: "3. Third-party infrastructure",
        p: [
          "To quote conversions and bridges we share with infrastructure providers (0x aggregator, Relay, RPC nodes) only the minimum necessary data: amounts, tokens and the destination public wallet address.",
          "These providers do not receive personally identifying data from us; check their privacy policies for how they handle technical data.",
        ],
      },
      {
        h: "4. Purpose and legal basis",
        p: [
          "Executing operations, displaying your portfolio, preventing fraud, complying with legal obligations and improving the service.",
          "Legal basis: contract performance, legitimate interest and, where applicable, consent.",
        ],
      },
      {
        h: "5. Retention and rights",
        p: [
          "We keep data for as long as necessary to provide the service and comply with regulations. On-chain activity is public and immutable.",
          `You can exercise access, rectification, erasure, objection and portability by writing to ${contactPrivacy}. You may also file a complaint with your country's data protection authority.`,
        ],
      },
    ],
  },
  risks: {
    eyebrow: "Legal",
    title: "Risk information",
    meta: "Read this before investing",
    subtitle: "Investing in OPEN involves risk. Understand it before trading.",
    sections: [
      {
        h: "Volatility",
        p: ["OPEN's price can rise or fall quickly. Past performance does not guarantee future results."],
      },
      {
        h: "Risk of total loss",
        p: ["You could lose all the capital invested. Invest only what you can afford to lose."],
      },
      {
        h: "Technology risk",
        p: [
          "Smart contracts may contain bugs. Losing private keys means irreversible loss of funds. On-chain transactions are generally irreversible.",
        ],
      },
      {
        h: "Conversions and bridges",
        p: [
          "If you pay with a token other than USDC or bring funds from another network, the conversion and the bridge depend on third-party infrastructure (0x aggregator, Relay) and market conditions: the quoted price has limited validity and may change.",
          "Cross-chain transfers with an amount different from the indicated one may be delayed or end up refunded to the origin address. Network fees on the origin chain are non-refundable.",
        ],
      },
      {
        h: "Regulation",
        p: [
          "Crypto-asset regulation varies by country and may change. It is your responsibility to comply with applicable laws, including tax obligations on capital gains.",
        ],
      },
      {
        h: "Exposure to OpenAI, Inc.'s value",
        p: [
          "The protocol treasury may hold shares or instruments linked to OpenAI, Inc. That exposure may be illiquid, subject to lock-ups, or reflected with delay in OPEN's price.",
          "A future OpenAI, Inc. IPO does not by itself guarantee any specific outcome for OPEN holders.",
          "OPEN may deviate from the company's market value due to liquidity, speculation or technical factors.",
        ],
      },
      {
        h: "NAV ↔ market price decoupling",
        p: [
          navDisclaimer,
          "The composite NAV aggregates SPV equity and operating reserves. Attestation delays, SPV illiquidity or on-chain speculation can widen the gap between NAV and OPEN's spot price.",
        ],
      },
      {
        h: "Relationship with OpenAI, Inc.",
        p: [
          "openAI Protocol channels investment toward OpenAI, Inc. independently. OPEN grants no direct shareholder rights nor access to official OpenAI products.",
          `Protocol decisions may change fees, listings or integrations. Follow the votes at ${governanceUrl}.`,
          "Trading OPEN involves smart-contract risk: verify the contract address before interacting.",
        ],
      },
      {
        h: "No advice",
        p: ["This platform does not provide financial, tax or legal advice. Consult an independent professional if you need it."],
      },
    ],
  },
  compliance: {
    eyebrow: "Legal",
    title: "Compliance and copy guide",
    meta: `Last updated: ${lastUpdated}`,
    subtitle: "Mandatory texts, disclaimer zones and pre-launch checklist for the team and partners (exchanges, integrations).",
    sections: [
      {
        h: "Guiding principle",
        p: [
          "Marketing may name OpenAI, Inc. to describe the underlying asset (IPO, valuation, equity in SPV). The operator's identity is openAI Protocol. OPEN represents participation in the protocol treasury.",
          tokenNatureParagraph,
        ],
      },
      {
        h: "Texts per interface zone",
        p: [
          `Footer (affiliation notice): ${affiliationNoticeSoft}`,
          "Hero (micro): —",
          `IPO countdown: ${opiContext}`,
          `Ecosystem / equity: ${equityMicro}`,
          "Value accrual: —",
          `Buy / swap: ${affiliationNoticeSoft}`,
          `Legal footer: ${footerDisclaimer}`,
          `Geo: ${geoNotice}`,
          `Strict legal (receipts, docs): ${shortDisclaimer}`,
        ],
      },
      {
        h: "Allowed marketing",
        p: [
          "· Economic exposure backed by real OpenAI, Inc. shares in the protocol treasury",
          "· Operating revenue of the open* ecosystem as a second value engine",
          "· Factual reference to the company as the SPV's underlying asset",
          "· Mentioning the expected IPO / listing as market context (if verifiable)",
          "· Using \u201cOpenAI, Inc.\u201d in full legal form when speaking about the real company",
          "· Visible disclaimer in every purchase flow",
        ],
      },
      {
        h: "Forbidden marketing",
        p: [
          "· Saying \u201cwe are OpenAI\u201d, \u201cofficial\u201d, \u201cpartner\u201d, \u201cendorsed by\u201d or \u201cpowered by OpenAI\u201d",
          "· Using the OpenAI, Inc. logo or confusing imitations as one's own brand",
          "· Claiming that OPEN = an OpenAI share or that it grants shareholder rights",
          "· Promising guaranteed returns, 1:1 parity with shares or an assured IPO",
          "· Hiding fees, risks or the protocol's independence",
          "· Targeting investors in countries without assessing restrictions (US, etc.)",
        ],
      },
      {
        h: "Consent in operation flows",
        p: [
          "UI checkbox (buy / swap): \u201cI have read and accept the Terms, the Privacy policy and the Risk information.\u201d",
          "Extended reference (legal docs, not UI): crypto — I accept the terms, privacy and risk information. OPEN invests via the protocol treasury; on-chain operations are irreversible.; swap — OPEN reflects the protocol treasury. The on-chain swap is irreversible.",
        ],
      },
      {
        h: "Pre-launch checklist",
        p: [
          "1. Disclaimer in footer, purchase, receipts and legal docs",
          "2. /docs/affiliation and /docs/compliance accessible",
          "3. Logo alt/title = openAI Protocol",
          "4. Own domain and emails (not openai.com)",
          "5. legal.config.ts completed (entity, SPV, contract)",
          "6. Publishable treasury attestations",
          "7. Geo notice visible in purchase flows",
          "8. No promises of returns or a guaranteed IPO",
          "9. External review by a lawyer (trademarks + securities)",
        ],
      },
      {
        h: "Contact",
        p: [
          `Legal: ${contactLegal}. Trademarks: /docs/affiliation. Risks: /docs/risks.`,
          "This guide does not replace legal advice. External review is mandatory before production with real money.",
        ],
      },
    ],
  },
  affiliation: {
    eyebrow: "Legal",
    title: "Trademarks and transparency",
    meta: `Last updated: ${lastUpdated}`,
    subtitle: "How openAI Protocol and OpenAI, Inc. relate to each other.",
    sections: [
      {
        h: "Who we are",
        p: [
          "openAI Protocol channels capital toward real OpenAI, Inc. shares via treasury and SPV, and operates the open* ecosystem with the OPEN token.",
          affiliationNotice,
        ],
      },
      {
        h: "Scope and limits",
        p: [
          "We operate as an independent protocol — not as a subsidiary, partner or official product of OpenAI, Inc.",
          "OPEN is a participation in the protocol treasury, not a share issued directly by OpenAI, Inc.",
          "The OpenAI, ChatGPT, DALL·E, Sora, Whisper and Codex trademarks are cited as references to the underlying asset where appropriate.",
        ],
      },
      {
        h: "Ecosystem nomenclature",
        p: [
          ecosystemDisclaimer,
          "The names openChat, openAPI, openImage, openMotion, openVoice and openCode designate protocol products, not official OpenAI, Inc. services.",
        ],
      },
      {
        h: "Nominative use of OpenAI, Inc.",
        p: [
          "We mention OpenAI, Inc. to describe the underlying asset to which the protocol allocates capital (e.g. before an IPO). That use is descriptive.",
          summary + " " + legalBoundary,
        ],
      },
      {
        h: "Contact and compliance",
        p: [
          `Legal inquiries: ${contactLegal}. Full terms: /docs/terms. Risks: /docs/risks.`,
          "If you are an exchange, integrator or regulator and need written confirmation of non-affiliation, contact us via the designated legal channel.",
        ],
      },
    ],
  },
};
