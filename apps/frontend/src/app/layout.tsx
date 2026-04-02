import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Manrope, Newsreader } from "next/font/google";
import GlobalAnalyticsTracker from "@/components/global-analytics-tracker";
import ScrollReveal from "@/components/scroll-reveal";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import ToastHost from "@/components/ui/toast-host";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Azdek - Интернет-магазин",
  description: "Интернет-магазин бытовой химии Azdek",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        <GlobalAnalyticsTracker />
        <ScrollReveal />
        <ToastHost />
        <div className="app-shell">
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}