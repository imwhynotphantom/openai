import type { Metadata } from "next";
import { Suspense } from "react";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { WalletSync } from "@/components/providers/WalletSync";
import { ReferralCapture } from "@/components/providers/ReferralCapture";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { MobileDock } from "@/components/MobileNav";
import { WalletModal, Toast } from "@/components/Modals";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { RTL_LOCALES } from "@/lib/i18n/config";
import { loadDictionary } from "@/lib/i18n/load";
import { getRequestLocale } from "@/lib/i18n/server";

const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-hanken", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dict = await loadDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const dict = await loadDictionary(locale);

  return (
    <html lang={locale} dir={RTL_LOCALES.has(locale) ? "rtl" : "ltr"} className={`${hanken.variable} ${mono.variable}`}>
      <body>
        <LocaleProvider initialLocale={locale} initialDict={dict}>
          <AppProvider>
            <Web3Provider>
              <WalletSync />
              <Suspense fallback={null}>
                <ReferralCapture />
              </Suspense>
              <div data-pad style={{ minHeight: "100vh", background: "#fff" }}>
                <Header />
                <Marquee />
                {children}
                <Footer />
                <MobileDock />
              </div>
              <WalletModal />
              <Toast />
            </Web3Provider>
          </AppProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
