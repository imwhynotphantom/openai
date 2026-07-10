"use client";

import { memo } from "react";
import Link from "next/link";
import { css } from "@/lib/css";
import { brandLegal } from "@/lib/brand-legal";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { Logo } from "./ui";

function Footer() {
  const { t } = useI18n();

  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: t.footer.colToken,
      links: [
        ["/comprar", t.legal.suggestedCta],
        ["/docs/whitepaper", t.footer.whitepaper],
        ["/docs/tokenomics", t.footer.tokenomics],
      ],
    },
    {
      title: t.footer.colResources,
      links: [
        ["/docs/docs", t.footer.documentation],
        ["/docs/audit", t.footer.audit],
        ["/docs/support", t.footer.support],
      ],
    },
    {
      title: t.footer.colLegal,
      links: [
        ["/docs/terms", t.footer.terms],
        ["/docs/privacy", t.footer.privacy],
        ["/docs/risks", t.legal.risksDocTitle],
        ["/docs/affiliation", t.legal.affiliationDocTitle],
        ["/docs/compliance", t.footer.compliance],
      ],
    },
  ];

  return (
    <footer style={css("border-top:1px solid #ECECEC;margin-top:40px")}>
      <div style={css("max-width:1200px;margin:0 auto;padding:48px 24px 40px")}>
        <div style={css("display:flex;justify-content:space-between;gap:32px;flex-wrap:wrap;margin-bottom:36px")}>
          <div style={css("max-width:300px")}>
            <Link href="/" prefetch title={brandLegal.productBrand} style={css("text-decoration:none;display:flex;align-items:center;gap:10px")}>
              <Logo />
              <span style={css("font:700 19px var(--font-hanken);letter-spacing:-0.04em;color:#0D0D0D")}>Protocol</span>
            </Link>
            <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:12px 0 0")}>
              {t.legal.suggestedTagline}
            </p>
          </div>
          <div style={css("display:flex;gap:56px;flex-wrap:wrap")}>
            {cols.map((col) => (
              <div key={col.title}>
                <div style={css("font:600 13px var(--font-hanken);margin-bottom:12px;color:#0D0D0D")}>{col.title}</div>
                <div style={css("display:flex;flex-direction:column;align-items:flex-start;gap:8px")}>
                  {col.links.map(([href, label]) => (
                    <Link key={href} href={href} prefetch className="footer-link" style={css("text-decoration:none;font:400 14px var(--font-hanken);color:#8A8A94")}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={css("border-top:1px solid #ECECEC;padding-top:20px;font:400 12px/1.5 var(--font-hanken);color:#A8A8AE")}>
          <p style={css("margin:0 0 14px")}>
            {t.legal.affiliationNoticeSoft}{" "}
            <Link href="/docs/affiliation" prefetch className="footer-link" style={css("color:#6B6B76;text-decoration:underline")}>
              {t.legal.affiliationLinkLabel}
            </Link>
          </p>
          <p style={css("margin:0 0 12px;font-family:var(--font-mono);font-size:11px;line-height:1.5")}>{t.legal.footerDisclaimer}</p>
          <p style={css("margin:0;font-family:var(--font-mono);font-size:11px;line-height:1.5")}>{t.legal.geoNotice}</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
