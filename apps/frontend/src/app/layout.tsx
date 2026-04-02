import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import GlobalAnalyticsTracker from "@/components/global-analytics-tracker";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import ToastHost from "@/components/ui/toast-host";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
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
      <body className={`${GeistSans.variable} ${inter.variable}`}>
        <GlobalAnalyticsTracker />
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
