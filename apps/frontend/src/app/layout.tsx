import "./globals.css";
import "@fontsource/inter/index.css";
import { ReactNode } from "react";
import GlobalAnalyticsTracker from "@/components/global-analytics-tracker";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

export const metadata = {
  title: "Azdek — Интернет-магазин",
  description: "Интернет-магазин бытовой химии Azdek",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <GlobalAnalyticsTracker />
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
