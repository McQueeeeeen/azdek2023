import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import GlobalAnalyticsTracker from "@/components/global-analytics-tracker";
import ScrollReveal from "@/components/scroll-reveal";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import ToastHost from "@/components/ui/toast-host";

export const metadata: Metadata = {
  title: "Adzek2023 - Online Store",
  description: "Online household chemicals store Adzek2023",
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
