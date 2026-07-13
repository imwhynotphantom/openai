"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { css } from "@/lib/css";
import { fmtUSD, fmtN, ACCENT } from "@/lib/format";
import { useApp } from "@/lib/store";
import { assetMeta } from "@/lib/content";
import { formatAddress } from "@/lib/wagmi/format-address";
import { useWalletHoldings } from "@/hooks/useWalletHoldings";
import { useWalletDisconnect } from "@/hooks/useWalletDisconnect";
import { useLivePrices } from "@/hooks/useLivePrices";
import { useOpenPrice } from "@/hooks/useOpenPrice";
import { useReferralStats, REFERRAL_MIN_USD } from "@/hooks/useReferralStats";
import { useDepositPurchase, type DepositPurchaseStatus } from "@/hooks/useDepositPurchase";
import { AddOpenToWallet } from "@/components/AddOpenToWallet";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { tf } from "@/lib/i18n/config";

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const openMeta = assetMeta.OPEN;

function ReferralCard({ address }: { address: string }) {
  const app = useApp();
  const router = useRouter();
  const { t } = useI18n();
  const tp = t.portfolio;
  const stats = useReferralStats();

  if (!stats.available) return null;

  const referralLink =
    (typeof window !== "undefined" ? window.location.origin : "") + "/?ref=" + address;
  const minLabel = fmtUSD(REFERRAL_MIN_USD);
  const currentLabel = fmtUSD(Math.min(stats.contributedUSD, REFERRAL_MIN_USD));
  const progressPct = Math.min(100, (stats.contributedUSD / REFERRAL_MIN_USD) * 100);

  return (
    <div style={css("background:#fff;border:1px solid #ECECEC;border-radius:20px;overflow:hidden;margin-top:24px")}>
      <div style={css("padding:18px 22px;border-bottom:1px solid #F0F0F1;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap")}>
        <span style={css("font:600 16px var(--font-hanken)")}>{tp.referralTitle}</span>
        <span style={css("font:600 12px var(--font-hanken);color:" + ACCENT + ";background:#EDF7F3;padding:4px 10px;border-radius:999px")}>+3%</span>
      </div>

      {stats.isEligible ? (
        <div style={css("padding:22px")}>
          <p style={css("font:400 14px/1.5 var(--font-hanken);color:#6B6B76;margin:0 0 16px")}>{tp.referralSubtitle}</p>
          <div style={css("font:500 12px var(--font-hanken);color:#8A8A94;margin-bottom:6px")}>{tp.referralYourLink}</div>
          <div style={css("display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:18px")}>
            <code style={css("flex:1;min-width:220px;font:500 13px var(--font-mono);color:#0D0D0D;background:#F7F7F8;border:1px solid #ECECEC;border-radius:10px;padding:11px 14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{referralLink}</code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(referralLink).then(() => app.toastMsg(tp.referralCopied));
              }}
              style={css("appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:10px;padding:11px 18px;font:600 14px var(--font-hanken);flex-shrink:0")}
            >
              {tp.referralCopy}
            </button>
          </div>
          <div style={css("display:flex;gap:28px;flex-wrap:wrap;margin-bottom:14px")}>
            <div>
              <div style={css("font:500 12px var(--font-hanken);color:#8A8A94")}>{tp.referralStatReferrals}</div>
              <div style={css("font:600 22px var(--font-mono)")}>{stats.count}</div>
            </div>
            <div>
              <div style={css("font:500 12px var(--font-hanken);color:#8A8A94")}>{tp.referralStatEarned}</div>
              <div style={css("font:600 22px var(--font-mono)")}>{fmtN(stats.earnedOpen, 0)}</div>
            </div>
          </div>
          <p style={css("font:400 12px/1.5 var(--font-hanken);color:#A8A8AE;margin:0")}>{tp.referralEarnNote}</p>
        </div>
      ) : (
        <div style={css("padding:22px")}>
          <div style={css("display:flex;align-items:center;gap:8px;margin-bottom:8px")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A8A94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span style={css("font:600 15px var(--font-hanken)")}>{tp.referralLockedTitle}</span>
          </div>
          <p style={css("font:400 14px/1.5 var(--font-hanken);color:#6B6B76;margin:0 0 16px")}>
            {tf(tp.referralLockedBody, { min: minLabel, current: currentLabel })}
          </p>
          <div style={css("margin-bottom:6px;font:500 12px var(--font-mono);color:#8A8A94")}>
            {tf(tp.referralProgressLabel, { min: minLabel, current: currentLabel })}
          </div>
          <div style={css("height:6px;background:#F0F0F1;border-radius:3px;overflow:hidden;margin-bottom:18px")}>
            <div style={{ height: "100%", width: progressPct + "%", background: ACCENT, borderRadius: 3 }} />
          </div>
          <button
            type="button"
            onClick={() => router.push("/comprar")}
            style={css("appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:12px 22px;font:600 15px var(--font-hanken)")}
          >
            {tp.referralLockedCta}
          </button>
        </div>
      )}
    </div>
  );
}

function PresaleAssetRow({
  presale,
  openPrice,
  totalBase,
}: {
  presale: DepositPurchaseStatus;
  openPrice: number;
  totalBase: number;
}) {
  const { t } = useI18n();
  const tp = t.portfolio;
  const confirmedValue = presale.openEstimated * openPrice;
  const pct = totalBase > 0 ? (confirmedValue / totalBase) * 100 : 100;

  return (
    <>
      {presale.openEstimated > 0 ? (
        <AssetRow
          name={openMeta.name}
          color={openMeta.color}
          sym={openMeta.sym}
          amount={tf(tp.presaleOpenAmount, { amount: fmtN(presale.openEstimated, 0) })}
          sublabel={tp.presaleStatusReserved}
          value={fmtUSD(confirmedValue)}
          pct={pct.toFixed(1) + "%"}
          width={pct.toFixed(1) + "%"}
        />
      ) : null}
      {presale.pending > 0 ? (
        <AssetRow
          name={openMeta.name}
          color={openMeta.color}
          sym={openMeta.sym}
          amount={tf(tp.presaleOpenPendingAmount, { amount: fmtN(presale.pendingOpenEstimated, 0) })}
          sublabel={tp.presaleStatusPending}
          value="—"
          pct="—"
          width="0%"
          muted
        />
      ) : null}
      {presale.credited > 0 ? (
        <p style={css("padding:0 22px 14px;font:400 12.5px var(--font-hanken);color:#8A8A94;margin:0")}>
          {tf(tp.presaleUsdcContributed, { usdc: fmt(presale.credited) })}
        </p>
      ) : null}
    </>
  );
}

function AssetRow({
  name,
  color,
  sym,
  amount,
  sublabel,
  value,
  pct,
  width,
  muted,
}: {
  name: string;
  color: string;
  sym: string;
  amount: string;
  sublabel?: string;
  value: string;
  pct: string;
  width: string;
  muted?: boolean;
}) {
  return (
    <div style={css("padding:16px 22px;border-bottom:1px solid #F4F4F5;display:flex;align-items:center;gap:14px")}>
      <span
        style={{
          ...css("flex:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font:600 13px var(--font-mono)"),
          background: color,
          opacity: muted ? 0.65 : 1,
        }}
      >
        {sym}
      </span>
      <div style={css("flex:1")}>
        <div style={css("font:600 15px var(--font-hanken)")}>{name}</div>
        <div style={css("font:400 13px var(--font-mono);color:#8A8A94")}>{amount}</div>
        {sublabel ? (
          <div style={css("font:500 11px var(--font-hanken);color:#9A5B00;background:#FFF7ED;display:inline-block;margin-top:6px;padding:3px 8px;border-radius:999px")}>
            {sublabel}
          </div>
        ) : null}
        {!muted ? (
          <div style={css("height:4px;background:#F0F0F1;border-radius:2px;margin-top:8px;overflow:hidden")}>
            <div style={{ height: "100%", width, background: color }} />
          </div>
        ) : null}
      </div>
      <div style={css("text-align:right")}>
        <div style={css("font:600 15px var(--font-mono)")}>{value}</div>
        <div style={css("font:400 12px var(--font-mono);color:#8A8A94")}>{pct}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={css("padding:12px 22px 8px;font:600 11px var(--font-hanken);color:#8A8A94;text-transform:uppercase;letter-spacing:0.05em;background:#FAFAFA;border-bottom:1px solid #F0F0F1")}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const app = useApp();
  const router = useRouter();
  const { t } = useI18n();
  const tp = t.portfolio;
  const disconnectWallet = useWalletDisconnect();
  const { price: openPrice } = useOpenPrice();
  const live = useLivePrices();
  const { address, isConnected, holdings, isLoading } = useWalletHoldings();
  const { status: presale, loading: presaleLoading, hasPresale } = useDepositPurchase();

  const priceOf = (ticker: string) => (ticker === "OPEN" ? openPrice : live.priceOf(ticker));

  const onChainTotal = holdings.reduce((acc, h) => acc + h.amount * priceOf(h.ticker), 0);
  const presaleTotal = presale ? presale.openEstimated * openPrice : 0;
  const combinedTotal = onChainTotal + presaleTotal;

  const onChainRows = holdings
    .filter((h) => h.amount > 0)
    .map((h) => {
      const val = h.amount * priceOf(h.ticker);
      const pct = combinedTotal > 0 ? (val / combinedTotal) * 100 : 0;
      const meta = assetMeta[h.ticker] ?? { name: h.name, color: "#8A8A94", sym: h.ticker[0] ?? "?" };
      return {
        ticker: h.ticker,
        name: meta.name,
        color: meta.color,
        sym: meta.sym,
        amount: fmtN(h.amount, h.decimals) + " " + h.ticker,
        value: fmtUSD(val),
        pct: pct.toFixed(1) + "%",
        width: pct.toFixed(1) + "%",
      };
    });

  const hasOnChainAssets = onChainRows.length > 0;
  const loading = isLoading || presaleLoading;
  const showFullConnectScreen = !isConnected && !hasPresale && !presaleLoading;

  const totalLabel = hasPresale && isConnected
    ? tp.totalValueCombined
    : hasPresale
      ? tp.totalValuePresale
      : tp.totalValue;

  const totalDisplay = loading
    ? "…"
    : hasPresale
      ? fmtUSD(combinedTotal)
      : isConnected
        ? fmtUSD(onChainTotal)
        : "—";

  if (showFullConnectScreen) {
    return (
      <main style={css("max-width:1100px;margin:0 auto;padding:40px 24px")}>
        <div style={css("display:flex;flex-direction:column;align-items:center;text-align:center;padding:80px 24px")}>
          <span style={css("width:64px;height:64px;border-radius:18px;background:#F4F4F5;display:flex;align-items:center;justify-content:center;margin-bottom:22px")}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8A8A94" strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="13" rx="3" />
              <path d="M16 12h3" />
            </svg>
          </span>
          <h2 style={css("font:600 26px var(--font-hanken);letter-spacing:-0.03em;margin:0 0 8px")}>{tp.connectTitle}</h2>
          <p style={css("font:400 16px var(--font-hanken);color:#6B6B76;margin:0 0 24px;max-width:380px")}>{tp.connectBody}</p>
          <button
            onClick={app.openWallet}
            style={css("appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:14px 28px;font:600 16px var(--font-hanken)")}
          >
            {t.nav.connectWallet}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={css("max-width:1100px;margin:0 auto;padding:40px 24px")}>
      <div style={css("display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:28px")}>
        <div>
          <div style={css("display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap")}>
            <h2 style={css("font:600 26px var(--font-hanken);letter-spacing:-0.03em;margin:0")}>{tp.myWallet}</h2>
            {isConnected && address ? (
              <>
                <button
                  type="button"
                  title={tp.copyAddressTitle}
                  onClick={() => {
                    void navigator.clipboard?.writeText(address).then(() => app.toastMsg(t.common.addressCopied));
                  }}
                  style={css("appearance:none;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:6px;font:500 12px var(--font-mono);color:#6B6B76;background:#F4F4F5;padding:5px 10px;border-radius:999px")}
                >
                  {formatAddress(address)}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                <button onClick={disconnectWallet} style={css("appearance:none;border:none;background:none;cursor:pointer;font:500 13px var(--font-hanken);color:#D14343")}>
                  {tp.disconnect}
                </button>
              </>
            ) : null}
          </div>
          <div style={css("font:500 13px var(--font-hanken);color:#8A8A94")}>{totalLabel}</div>
          <div style={css("display:flex;align-items:baseline;gap:12px;flex-wrap:wrap")}>
            <span style={css("font:600 42px var(--font-mono);letter-spacing:-0.03em")}>{totalDisplay}</span>
            {hasPresale && presale && presale.openEstimated > 0 ? (
              <span style={css("font:500 14px var(--font-hanken);color:#5C5C66")}>
                {tf(tp.totalOpenSummary, { open: fmtN(presale.openEstimated, 0) })}
              </span>
            ) : null}
          </div>
        </div>
        <div style={css("display:flex;gap:10px;flex-wrap:wrap")}>
          {!isConnected ? (
            <button
              onClick={app.openWallet}
              style={css("appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:12px 22px;font:600 15px var(--font-hanken)")}
            >
              {t.nav.connectWallet}
            </button>
          ) : null}
          <button onClick={() => router.push("/comprar")} style={css("appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:12px 22px;font:600 15px var(--font-hanken)")}>
            {t.home.buyShort}
          </button>
          <button
            onClick={() => router.push("/comprar?modo=recibir")}
            title={tp.depositTitle}
            style={css("appearance:none;cursor:pointer;background:#fff;color:#0D0D0D;border:1px solid #DADADD;border-radius:12px;padding:12px 22px;font:600 15px var(--font-hanken)")}
          >
            {tp.deposit}
          </button>
          {isConnected ? <AddOpenToWallet /> : null}
        </div>
      </div>

      <div data-2col style={css("display:grid;grid-template-columns:1.4fr 1fr;gap:24px;align-items:start")}>
        <div style={css("background:#fff;border:1px solid #ECECEC;border-radius:20px;overflow:hidden")}>
          <div style={css("padding:18px 22px;border-bottom:1px solid #F0F0F1;font:600 16px var(--font-hanken)")}>{tp.assetsTitle}</div>

          {hasPresale && presale ? (
            <>
              <SectionLabel>{tp.presaleSection}</SectionLabel>
              <PresaleAssetRow presale={presale} openPrice={openPrice} totalBase={combinedTotal || presaleTotal} />
              <div style={css("padding:0 22px 16px")}>
                <Link href="/mi-compra" style={css("font:600 13px var(--font-hanken);color:#0D0D0D;text-decoration:underline")}>
                  {tp.presaleViewDetail}
                </Link>
              </div>
            </>
          ) : null}

          {isConnected ? (
            <>
              {hasPresale ? <SectionLabel>{tp.walletSection}</SectionLabel> : null}
              {hasOnChainAssets ? (
                onChainRows.map((h) => (
                  <AssetRow
                    key={h.ticker}
                    name={h.name}
                    color={h.color}
                    sym={h.sym}
                    amount={h.amount}
                    value={h.value}
                    pct={h.pct}
                    width={h.width}
                  />
                ))
              ) : (
                <div style={css("padding:32px 22px;text-align:center;font:400 14px/1.5 var(--font-hanken);color:#A8A8AE")}>
                  {loading ? tp.loadingBalances : hasPresale ? tp.walletEmptyWithPresale : <>{tp.emptyLine1}<br />{tp.emptyLine2}</>}
                </div>
              )}
            </>
          ) : (
            <div style={css("padding:28px 22px;border-top:1px solid #F4F4F5")}>
              <p style={css("font:600 15px var(--font-hanken);color:#0D0D0D;margin:0 0 6px")}>{tp.connectInlineTitle}</p>
              <p style={css("font:400 14px/1.5 var(--font-hanken);color:#6B6B76;margin:0 0 14px")}>{tp.connectInlineBody}</p>
              <button
                onClick={app.openWallet}
                style={css("appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:12px 20px;font:600 14px var(--font-hanken)")}
              >
                {t.nav.connectWallet}
              </button>
            </div>
          )}
        </div>

        <div style={css("background:#fff;border:1px solid #ECECEC;border-radius:20px;overflow:hidden")}>
          {isConnected && address ? (
            <>
              <div style={css("padding:18px 22px;border-bottom:1px solid #F0F0F1;font:600 16px var(--font-hanken)")}>{tp.movementsTitle}</div>
              <div style={css("padding:28px 22px;text-align:center")}>
                <p style={css("font:400 14px/1.5 var(--font-hanken);color:#6B6B76;margin:0 0 16px")}>{tp.movementsBody}</p>
                <a
                  href={`https://basescan.org/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  style={css("display:inline-flex;align-items:center;gap:8px;text-decoration:none;background:#fff;color:#0D0D0D;border:1px solid #DADADD;border-radius:12px;padding:12px 18px;font:600 14px var(--font-hanken)")}
                >
                  {tp.viewBasescan}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                  </svg>
                </a>
                <p style={css("font:400 12px/1.5 var(--font-hanken);color:#A8A8AE;margin:16px 0 0")}>{tp.movementsNote}</p>
              </div>
            </>
          ) : (
            <>
              <div style={css("padding:18px 22px;border-bottom:1px solid #F0F0F1;font:600 16px var(--font-hanken)")}>{tp.presaleDetailTitle}</div>
              <div style={css("padding:28px 22px")}>
                <p style={css("font:400 14px/1.5 var(--font-hanken);color:#6B6B76;margin:0 0 16px")}>{tp.presaleDetailBody}</p>
                <Link
                  href="/mi-compra"
                  style={css("display:inline-flex;align-items:center;gap:8px;text-decoration:none;background:#0D0D0D;color:#fff;border-radius:12px;padding:12px 18px;font:600 14px var(--font-hanken)")}
                >
                  {tp.presaleViewDetail}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {isConnected && address ? <ReferralCard address={address} /> : null}
    </main>
  );
}
