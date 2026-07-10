"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { css } from "@/lib/css";
import { fmtUSD, fmtN, ACCENT } from "@/lib/format";
import { buildSeries } from "@/lib/series";
import { useMarket } from "@/lib/market";
import { useWalletHoldings } from "@/hooks/useWalletHoldings";
import { useOpenPrice } from "@/hooks/useOpenPrice";
import { Chart } from "../Chart";
import { Hov } from "../ui";
import { ecosystemNames, tokenWhyIcons, hubPos, tkSegData } from "@/lib/content";
import { tf } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { LegalMicro } from "../LegalMicro";

const series = buildSeries();

function Countdown() {
  const { now } = useMarket();
  const { t } = useI18n();
  let diff = Math.max(0, new Date("2027-09-15T09:00:00Z").getTime() - now);
  const dd = Math.floor(diff / 86400000); diff -= dd * 86400000;
  const hh = Math.floor(diff / 3600000); diff -= hh * 3600000;
  const mm = Math.floor(diff / 60000); diff -= mm * 60000;
  const ss = Math.floor(diff / 1000);
  const cell = (v: string, u: string, accent?: boolean) => (
    <div style={css("text-align:center")}>
      <span style={{ ...css("font:500 32px var(--font-mono);letter-spacing:-0.02em"), color: accent ? ACCENT : "#0D0D0D" }}>{v}</span>
      <span style={css("font:500 11px var(--font-hanken);color:#A8A8AE;margin-left:3px")}>{u}</span>
    </div>
  );
  const sep = <span style={css("font:300 22px var(--font-mono);color:#D8D8DC")}>:</span>;
  return (
    <section style={css("max-width:1200px;margin:0 auto;padding:24px 24px")}>
      <div style={css("border:1px solid #ECECEC;border-radius:18px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px")}>
        <div>
          <div style={css("font:600 11px var(--font-mono);letter-spacing:0.06em;color:#9A9AA0;text-transform:uppercase;margin-bottom:5px")}>{t.home.nextMilestone}</div>
          <div style={css("font:400 14px var(--font-hanken);color:#8A8A94")}>{t.legal.opiContext}</div>
          <div style={css("font:400 13px/1.45 var(--font-hanken);color:#9A9AA0;margin-top:8px;max-width:520px")}>{t.legal.postOpiFlywheel}</div>
        </div>
        <div style={css("display:flex;align-items:baseline;gap:10px")}>
          {cell(String(dd), "d")}{sep}
          {cell(String(hh).padStart(2, "0"), "h")}{sep}
          {cell(String(mm).padStart(2, "0"), "m")}{sep}
          {cell(String(ss).padStart(2, "0"), "s", true)}
        </div>
      </div>
    </section>
  );
}

function Activity() {
  const { activity, now } = useMarket();
  const { t } = useI18n();
  const relTime = (ts: number) => {
    const sec = Math.max(1, Math.round((now - ts) / 1000));
    return sec < 60 ? tf(t.home.timeAgoSec, { n: sec }) : tf(t.home.timeAgoMin, { n: Math.floor(sec / 60) });
  };
  return (
    <section style={css("max-width:1200px;margin:0 auto;padding:24px 24px")}>
      <div style={css("border:1px solid #ECECEC;border-radius:18px;padding:8px 8px 4px")}>
        <div style={css("display:flex;align-items:center;justify-content:space-between;padding:12px 14px 10px;flex-wrap:wrap;gap:6px")}>
          <div style={css("display:flex;align-items:center;gap:8px")}>
            <span style={css("width:7px;height:7px;border-radius:50%;background:" + ACCENT)} />
            <span style={css("font:600 13px var(--font-hanken);color:#0D0D0D")}>{t.home.activityTitle}</span>
            <span style={css("font:400 12px var(--font-hanken);color:#9A9AA0")}>{t.home.activitySubtitle}</span>
          </div>
          <span style={css("font:500 11px var(--font-mono);color:#A8A8AE")}>{t.common.liveLower}</span>
        </div>
        {activity.map((a) => (
          <div key={a.id} style={css("display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid #F4F4F5")}>
            <span style={css("flex:none;width:28px;height:28px;border-radius:8px;background:#F4F4F5;display:flex;align-items:center;justify-content:center;font:600 11px var(--font-mono);color:#8A8A94")}>{a.action === "bought" ? "↗" : "⇄"}</span>
            <span style={css("flex:1;font:400 13px var(--font-hanken);color:#5C5C66")}>
              <span style={css("font-family:var(--font-mono);color:#0D0D0D")}>{a.addr}</span> {a.action === "bought" ? t.home.activityBought : t.home.activitySwapped} {a.amt} OPEN
            </span>
            <span style={css("font:400 11px var(--font-mono);color:#A8A8AE")}>{relTime(a.ts)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Donut() {
  const { t } = useI18n();
  const C = 2 * Math.PI * 80;
  let acc = 0;
  const segs = tkSegData.map(({ pct, color }, i) => {
    const seg = {
      label: t.content.tkSegs[i] ?? "",
      pct: pct.toLocaleString(t.numberLocale) + "%",
      color,
      dash: ((C * pct) / 100).toFixed(2) + " " + C.toFixed(2),
      offset: ((-C * acc) / 100).toFixed(2),
    };
    acc += pct;
    return seg;
  });
  return (
    <section style={css("max-width:1200px;margin:0 auto;padding:48px 24px")}>
      <div data-2col style={css("display:grid;grid-template-columns:0.9fr 1.1fr;gap:48px;align-items:center;background:#0D0D0D;border-radius:28px;padding:48px")}>
        <div style={css("display:flex;flex-direction:column;align-items:center")}>
          <div style={css("position:relative;width:220px;height:220px")}>
            <svg viewBox="0 0 200 200" width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#1E1E1E" strokeWidth="26" />
              {segs.map((d, i) => (
                <circle key={i} cx="100" cy="100" r="80" fill="none" stroke={d.color} strokeWidth="26" strokeDasharray={d.dash} strokeDashoffset={d.offset} />
              ))}
            </svg>
            <div style={css("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center")}>
              <span style={css("font:600 24px var(--font-mono);color:#fff;letter-spacing:-0.02em")}>21.000M</span>
              <span style={css("font:500 11px var(--font-mono);color:#8A8A94;text-transform:uppercase;letter-spacing:0.06em")}>{t.home.tokenomicsTotal}</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ ...css("font:600 13px var(--font-mono);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:14px"), color: ACCENT }}>{t.home.tokenomicsEyebrow}</div>
          <h2 style={css("font:600 34px var(--font-hanken);letter-spacing:-0.035em;margin:0 0 14px;color:#fff")}>{t.home.tokenomicsTitle}</h2>
          <p style={css("font:400 16px/1.55 var(--font-hanken);color:#B8B8BD;margin:0 0 22px;max-width:460px")}>{t.home.tokenomicsBody}</p>
          <div style={css("display:flex;flex-direction:column;gap:10px;margin-bottom:22px")}>
            {segs.map((d, i) => (
              <div key={i} style={css("display:flex;align-items:center;gap:12px")}>
                <span style={{ ...css("flex:none;width:11px;height:11px;border-radius:3px"), background: d.color }} />
                <span style={css("flex:1;font:500 14px var(--font-hanken);color:#E4E4E6")}>{d.label}</span>
                <span style={css("font:600 14px var(--font-mono);color:#fff")}>{d.pct}</span>
              </div>
            ))}
          </div>
          <div style={css("display:inline-flex;align-items:center;gap:10px;background:#1A1A1A;border:1px solid #2A2A2A;border-radius:12px;padding:12px 16px")}>
            <span style={{ ...css("font:600 22px var(--font-mono)"), color: ACCENT }}>30%</span>
            <span style={css("font:400 13px/1.4 var(--font-hanken);color:#B8B8BD;max-width:240px")}>{t.home.tokenomicsBurn}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  const { t } = useI18n();
  return (
    <section style={css("max-width:1200px;margin:0 auto;padding:48px 24px")}>
      <div data-2col style={css("display:grid;grid-template-columns:0.85fr 1.15fr;gap:48px;align-items:start")}>
        <div>
          <div style={{ ...css("font:600 13px var(--font-mono);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:14px"), color: ACCENT }}>{t.home.faqEyebrow}</div>
          <h2 style={css("font:600 34px var(--font-hanken);letter-spacing:-0.035em;margin:0 0 16px")}>{t.home.faqTitle}</h2>
          <p style={css("font:400 16px/1.55 var(--font-hanken);color:#6B6B76;margin:0")}>{t.home.faqSubtitle}</p>
        </div>
        <div style={css("border-top:1px solid #ECECEC")}>
          {t.content.faq.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={css("border-bottom:1px solid #ECECEC")}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={css("appearance:none;cursor:pointer;width:100%;background:none;border:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0;text-align:left")}>
                  <span style={css("font:600 17px var(--font-hanken);letter-spacing:-0.01em;color:#0D0D0D")}>{q}</span>
                  <span style={{ ...css("flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:400 18px var(--font-hanken);transition:transform .2s ease"), background: isOpen ? ACCENT : "#F4F4F5", color: isOpen ? "#fff" : "#8A8A94", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </button>
                <div style={{ overflow: "hidden", transition: "max-height .28s ease, opacity .2s ease", maxHeight: isOpen ? 420 : 0, opacity: isOpen ? 1 : 0 }}>
                  <p style={css("font:400 15px/1.6 var(--font-hanken);color:#5C5C66;margin:0;padding:0 0 22px;max-width:560px")}>{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { openBalance, isConnected } = useWalletHoldings();
  const { price, change } = useOpenPrice();
  const router = useRouter();
  const { t } = useI18n();
  const pos = change >= 0;
  const changeStr = (pos ? "+" : "") + change.toFixed(2) + "%";
  const changeColor = pos ? ACCENT : "#D14343";
  const heroStats = [
    { value: "0,0005 USDC", label: t.home.heroStatPresalePrice },
    { value: "1.045.000 USDC", label: t.home.heroStatCap },
    { value: "21.000M", label: t.home.heroStatSupply },
    { value: "40%", label: t.home.heroStatLiquidity },
  ];
  const hubNodes = ecosystemNames.map((name, i) => ({
    name,
    real: t.content.hubMeta[i]?.[0] ?? "",
    tag: t.content.hubMeta[i]?.[1] ?? "",
    pos: hubPos[i]!,
  }));

  return (
    <main>
      {/* hero */}
      <section data-hero-section style={css("max-width:1200px;margin:0 auto;padding:72px 24px 40px")}>
        <div data-hero style={css("display:grid;grid-template-columns:1.05fr 0.95fr;gap:56px;align-items:center")}>
          <div>
            <div data-hero-badges style={css("display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:22px")}>
              <span style={{ ...css("display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:999px"), background: "color-mix(in srgb, var(--accent) 11%, #fff)" }}>
                <span style={css("width:6px;height:6px;border-radius:50%;background:" + ACCENT)} />
                <span style={{ ...css("font:600 12px var(--font-mono);letter-spacing:0.04em;text-transform:uppercase"), color: ACCENT }}>{t.legal.heroBadge.split(" · ")[0]}</span>
              </span>
              <span style={css("display:inline-flex;align-items:center;padding:7px 13px;border-radius:999px;border:1px solid #E2E2E4")}>
                <span style={css("font:600 12px var(--font-mono);letter-spacing:0.03em;color:#6B6B76;text-transform:uppercase")}>{t.legal.heroBadge.split(" · ")[1]}</span>
              </span>
            </div>
            <h1 data-h1 style={css("font:600 64px/1.0 var(--font-hanken);letter-spacing:-0.045em;margin:0 0 22px;max-width:600px")}>{t.legal.heroHeadline}</h1>
            <p data-hero-sub style={css("font:400 19px/1.55 var(--font-hanken);color:#5C5C66;max-width:520px;margin:0 0 32px;text-wrap:pretty")}>{t.legal.heroSubheadline}</p>
            <div data-hero-actions style={css("display:flex;gap:12px;flex-wrap:wrap")}>
              <Hov as="button" onClick={() => router.push("/comprar")} style="appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:15px 26px;font:600 16px var(--font-hanken);letter-spacing:-0.01em" hover="background:#000">{t.legal.suggestedCta}</Hov>
              <Hov as="button" onClick={() => router.push("/swap")} style="appearance:none;cursor:pointer;background:#fff;color:#0D0D0D;border:1px solid #DADADD;border-radius:12px;padding:15px 26px;font:600 16px var(--font-hanken);letter-spacing:-0.01em" hover="border-color:#0D0D0D">{t.home.swapFromWallet}</Hov>
            </div>
            <div data-hero-trust style={css("display:flex;align-items:center;gap:18px;margin-top:28px;flex-wrap:wrap")}>
              <span style={css("font:500 13px var(--font-mono);color:#8A8A94")}>{t.home.trustNoCustody}</span>
              <span style={css("font:500 13px var(--font-mono);color:#8A8A94")}>{t.home.trustLiquidity}</span>
              <span style={css("font:500 13px var(--font-mono);color:#8A8A94")}>{t.home.trustAudited}</span>
            </div>
          </div>
          <div data-hero-card style={css("background:#fff;border:1px solid #ECECEC;border-radius:24px;padding:26px;box-shadow:0 24px 60px -28px rgba(13,13,13,0.18)")}>
            <div style={css("display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px")}>
              <div>
                <div style={css("font:500 13px var(--font-mono);color:#8A8A94;margin-bottom:6px")}>OPEN / USD</div>
                <div style={css("display:flex;align-items:baseline;gap:10px")}>
                  <span style={css("font:600 38px var(--font-mono);letter-spacing:-0.02em")}>{fmtUSD(price)}</span>
                  <span style={{ ...css("font:600 15px var(--font-mono)"), color: changeColor }}>{changeStr}</span>
                </div>
              </div>
              <span style={{ ...css("display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px"), background: "color-mix(in srgb, var(--accent) 11%, #fff)" }}>
                <span style={{ ...css("width:6px;height:6px;border-radius:50%;background:" + ACCENT), animation: "blink 2s infinite" }} />
                <span style={{ ...css("font:600 11px var(--font-mono)"), color: ACCENT }}>{t.common.live}</span>
              </span>
            </div>
            <Chart series={series["1M"]} price={price} height={130} gradId="gSpark" />
            <div data-hero-card-actions style={css("display:flex;gap:10px;margin-top:18px")}>
              <button onClick={() => router.push("/comprar")} style={css("flex:1;appearance:none;cursor:pointer;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:13px;font:600 15px var(--font-hanken)")}>{t.home.buyShort}</button>
              <button onClick={() => router.push("/mercado")} style={css("flex:1;appearance:none;cursor:pointer;background:#F4F4F5;color:#0D0D0D;border:none;border-radius:12px;padding:13px;font:600 15px var(--font-hanken)")}>{t.home.viewChart}</button>
            </div>
          </div>
        </div>
        <div data-stats style={css("display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#ECECEC;border:1px solid #ECECEC;border-radius:18px;overflow:hidden;margin-top:56px")}>
          {heroStats.map((st, i) => (
            <div key={i} style={css("background:#fff;padding:24px 26px")}>
              <div style={css("font:600 26px var(--font-mono);letter-spacing:-0.02em;margin-bottom:6px")}>{st.value}</div>
              <div style={css("font:500 13px var(--font-hanken);color:#8A8A94")}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Countdown />
      <Activity />

      {/* token explanation + value accrual + hub */}
      <section style={css("max-width:1200px;margin:0 auto;padding:48px 24px")}>
        <h2 style={css("font:600 38px var(--font-hanken);letter-spacing:-0.035em;margin:0 0 16px;max-width:680px")}>{t.legal.ecosystemTitle}</h2>
        <div data-2col style={css("display:grid;grid-template-columns:1.05fr 0.95fr;gap:40px;align-items:start;margin-bottom:40px")}>
          <p style={css("font:400 18px/1.6 var(--font-hanken);color:#5C5C66;margin:0;text-wrap:pretty")}>{t.legal.ecosystemLead}</p>
          <div style={css("display:flex;flex-direction:column;gap:12px")}>
            {t.content.tokenWhy.map((w, i) => (
              <div key={i} style={css("display:flex;gap:14px;align-items:flex-start;background:#F7F7F8;border-radius:14px;padding:16px 18px")}>
                <span style={{ ...css("flex:none;width:30px;height:30px;border-radius:9px;background:#fff;border:1px solid #ECECEC;display:flex;align-items:center;justify-content:center"), color: ACCENT }}>{tokenWhyIcons[i]}</span>
                <div><div style={css("font:600 15px var(--font-hanken);margin-bottom:2px")}>{w.title}</div><div style={css("font:400 13px/1.45 var(--font-hanken);color:#6B6B76")}>{w.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <LegalMicro zone="ecosystem" />
        <div style={{ ...css("font:600 11px var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;margin-top:32px"), color: ACCENT }}>{t.home.valueAccrualEyebrow}</div>
        <h3 style={css("font:600 27px var(--font-hanken);letter-spacing:-0.025em;margin:0 0 16px;max-width:700px")}>{t.legal.valueTitle}</h3>
        <p style={css("font:400 18px/1.6 var(--font-hanken);color:#5C5C66;max-width:700px;margin:0 0 8px;text-wrap:pretty")}>{t.legal.valueLead}</p>
        <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:18px")}>
          {t.home.valueChips.map((chip, i) => (
            <span key={i} style={css("display:inline-flex;align-items:center;gap:8px")}>
              <span style={css("font:600 13px var(--font-hanken);color:#0D0D0D;background:#F4F4F5;border-radius:999px;padding:8px 14px")}>{chip}</span>
              <span style={css("color:#C8C8CE;font-size:14px")}>→</span>
            </span>
          ))}
          <span style={{ ...css("display:inline-flex;align-items:center;gap:6px;font:600 13px var(--font-hanken);border-radius:999px;padding:8px 14px"), color: ACCENT, background: "color-mix(in srgb, var(--accent) 11%, #fff)" }}>{t.home.valueChipResult} <span style={{ fontSize: 13 }}>↗</span></span>
        </div>
        <p style={css("font:400 13px/1.5 var(--font-hanken);color:#9A9AA0;max-width:700px;margin:16px 0 32px")}>{t.home.valueMechanism}</p>
        <div style={css("font:600 23px var(--font-hanken);letter-spacing:-0.02em;color:#0D0D0D;margin-bottom:8px")}>{t.home.servicesTitle}</div>

        <div data-hub style={{ ...css("position:relative;width:100%;margin:18px auto 0"), maxWidth: 600, aspectRatio: "600/520" }}>
          <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <g style={{ stroke: "#E2E2E4", strokeWidth: 1.5 }}>
              <line x1="300" y1="260" x2="300" y2="58" /><line x1="300" y1="260" x2="505" y2="150" /><line x1="300" y1="260" x2="505" y2="370" /><line x1="300" y1="260" x2="300" y2="462" /><line x1="300" y1="260" x2="95" y2="370" /><line x1="300" y1="260" x2="95" y2="150" />
            </g>
            <g style={{ stroke: "var(--accent,#0E8C6A)", strokeWidth: 2, strokeDasharray: "3 9", strokeLinecap: "round" }}>
              {[["300", "58", "0s"], ["505", "150", ".15s"], ["505", "370", ".3s"], ["300", "462", ".45s"], ["95", "370", ".6s"], ["95", "150", ".75s"]].map(([x, y, delay], i) => (
                <line key={i} x1="300" y1="260" x2={x} y2={y} style={{ animation: `flow 1.1s linear infinite ${delay}` }} />
              ))}
            </g>
          </svg>
          <div data-hubcenter style={css("position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:132px;height:132px;border-radius:50%;background:#0D0D0D;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 14px 36px -14px rgba(13,13,13,0.5)")}>
            <span style={{ ...css("position:absolute;inset:-1px;border-radius:50%;border:2px solid var(--accent,#0E8C6A)"), animation: "hubring 2.4s ease-out infinite" }} />
            <span style={css("font:700 26px var(--font-hanken);letter-spacing:-0.03em;color:#fff")}>OPEN</span>
            <span style={css("display:flex;align-items:center;gap:5px;margin-top:3px")}><span style={css("width:5px;height:5px;border-radius:50%;background:" + ACCENT)} /><span style={css("font:600 10px var(--font-mono);letter-spacing:0.06em;color:#9A9AA0;text-transform:uppercase")}>{t.home.hubSync}</span></span>
          </div>
          {hubNodes.map((n, i) => (
            <div key={i} style={css(n.pos)}>
              <Hov data-hubcard style="background:#fff;border:1px solid #E6E6E8;border-radius:14px;padding:11px 14px;text-align:center;box-shadow:0 8px 22px -16px rgba(13,13,13,0.3);min-width:138px" hover="border-color:#0D0D0D">
                <div data-hn style={css("font:600 15px var(--font-hanken);letter-spacing:-0.01em;color:#0D0D0D")}>{n.name}</div>
                <div data-hr style={css("font:400 11px var(--font-hanken);color:#9A9AA0;margin:1px 0 4px")}>{n.real}</div>
                <div data-ht style={{ ...css("font:600 11px var(--font-mono)"), color: ACCENT }}>{n.tag}</div>
              </Hov>
            </div>
          ))}
        </div>

        <div data-eco style={css("display:grid;grid-template-columns:repeat(3,1fr);gap:16px")}>
          {ecosystemNames.map((name, i) => (
            <Hov key={i} style="background:#fff;border:1px solid #ECECEC;border-radius:18px;padding:24px" hover="border-color:#CFCFD3">
              <div style={css("font:600 18px var(--font-hanken);letter-spacing:-0.02em;margin-bottom:8px")}>{name}</div>
              <div style={css("font:400 14px/1.5 var(--font-hanken);color:#6B6B76")}>{t.content.ecosystem[i]}</div>
            </Hov>
          ))}
        </div>
        <p style={css("font:400 12px/1.5 var(--font-mono);color:#A8A8AE;margin:16px 0 0;max-width:900px")}>{t.legal.ecosystemDisclaimer}</p>
      </section>

      <Donut />

      {/* desktop + mobile */}
      <section style={css("max-width:1200px;margin:0 auto;padding:48px 24px")}>
        <div data-msg style={css("display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;background:#F7F7F8;border-radius:28px;padding:48px")}>
          <div>
            <div style={{ ...css("font:600 13px var(--font-mono);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:14px"), color: ACCENT }}>{t.home.desktopMobileEyebrow}</div>
            <h2 style={css("font:600 34px var(--font-hanken);letter-spacing:-0.035em;margin:0 0 16px")}>{t.home.desktopMobileTitle}</h2>
            <p style={css("font:400 17px/1.55 var(--font-hanken);color:#5C5C66;margin:0 0 24px")}>{t.home.desktopMobileBody}</p>
            <div style={css("display:flex;flex-direction:column;gap:14px")}>
              {t.content.steps.map((st, i) => (
                <div key={i} style={css("display:flex;gap:14px;align-items:flex-start")}>
                  <span style={css("flex:none;width:28px;height:28px;border-radius:8px;background:#0D0D0D;color:#fff;display:flex;align-items:center;justify-content:center;font:600 13px var(--font-mono)")}>{i + 1}</span>
                  <div><div style={css("font:600 16px var(--font-hanken)")}>{st.title}</div><div style={css("font:400 14px var(--font-hanken);color:#6B6B76")}>{st.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={css("display:flex;justify-content:center")}>
            <div style={css("width:280px;height:560px;background:#0D0D0D;border-radius:42px;padding:11px;box-shadow:0 30px 70px -30px rgba(0,0,0,0.4)")}>
              <div style={css("width:100%;height:100%;background:#fff;border-radius:32px;overflow:hidden;display:flex;flex-direction:column")}>
                <div style={css("padding:18px 18px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #F0F0F1")}>
                  <span style={css("font:700 16px var(--font-hanken);letter-spacing:-0.04em")}>open<span style={{ color: ACCENT }}>AI</span></span>
                  <span style={css("width:24px;height:24px;border-radius:50%;background:#F4F4F5")} />
                </div>
                <div style={css("padding:18px;flex:1")}>
                  <div style={css("font:500 12px var(--font-mono);color:#8A8A94")}>{t.home.phoneBalance}</div>
                  <div style={css("font:600 30px var(--font-mono);letter-spacing:-0.02em;margin:4px 0 2px")}>{isConnected ? fmtN(openBalance, 2) : "0.00"}</div>
                  <div style={{ ...css("font:600 13px var(--font-mono)"), color: ACCENT }}>{changeStr} {t.home.phoneToday}</div>
                  <div style={css("background:#F7F7F8;border-radius:14px;padding:14px;margin-top:18px")}>
                    <div style={css("font:500 12px var(--font-mono);color:#8A8A94;margin-bottom:6px")}>{t.home.phonePayWith}</div>
                    <div style={css("font:600 22px var(--font-mono)")}>500.00</div>
                  </div>
                  <div style={css("display:flex;justify-content:center;margin:6px 0")}><span style={css("width:30px;height:30px;border-radius:50%;background:#F0F0F1;display:flex;align-items:center;justify-content:center;color:#8A8A94")}>↓</span></div>
                  <div style={{ ...css("border-radius:14px;padding:14px"), background: "color-mix(in srgb, var(--accent) 9%, #fff)" }}>
                    <div style={css("font:500 12px var(--font-mono);color:#8A8A94;margin-bottom:6px")}>{t.home.phoneReceive}</div>
                    <div style={{ ...css("font:600 22px var(--font-mono)"), color: ACCENT }}>{fmtN((500 * 0.99) / price, 2)}</div>
                  </div>
                </div>
                <div style={css("padding:0 18px 18px")}><button onClick={() => router.push("/comprar")} style={css("width:100%;appearance:none;cursor:pointer;border:none;background:#0D0D0D;color:#fff;border-radius:12px;padding:13px;text-align:center;font:600 15px var(--font-hanken)")}>{t.legal.suggestedCta}</button></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq />
    </main>
  );
}
