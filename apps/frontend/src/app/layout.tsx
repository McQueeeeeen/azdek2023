import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import GlobalAnalyticsTracker from "@/components/global-analytics-tracker";
import ToastHost from "@/components/ui/toast-host";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

export const metadata: Metadata = {
  title: "Adzek2023 - Household Store",
  description: "Adzek household products e-commerce",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
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
