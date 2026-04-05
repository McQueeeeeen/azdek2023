import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Script from "next/script";
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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <Script id="tailwind-config" strategy="beforeInteractive">
          {`
            window.tailwind = window.tailwind || {};
            window.tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    "on-surface-variant": "#414755",
                    "primary-container": "#0070eb",
                    "surface-container": "#eceef0",
                    "secondary-fixed-dim": "#78dc77",
                    "surface-container-highest": "#e0e3e5",
                    "primary": "#0058bc",
                    "primary-fixed": "#d8e2ff",
                    "error": "#ba1a1a",
                    "tertiary-container": "#687780",
                    "on-secondary-fixed-variant": "#005313",
                    "surface-container-low": "#f2f4f6",
                    "on-tertiary-fixed": "#0f1d25",
                    "surface-tint": "#005bc1",
                    "on-background": "#191c1e",
                    "inverse-surface": "#2d3133",
                    "surface-container-high": "#e6e8ea",
                    "primary-fixed-dim": "#adc6ff",
                    "tertiary-fixed": "#d6e5ef",
                    "on-secondary-fixed": "#002204",
                    "outline": "#717786",
                    "on-tertiary-container": "#fbfcff",
                    "on-error-container": "#93000a",
                    "secondary": "#006e1c",
                    "secondary-container": "#91f78e",
                    "on-primary-fixed": "#001a41",
                    "inverse-primary": "#adc6ff",
                    "outline-variant": "#c1c6d7",
                    "on-primary-fixed-variant": "#004493",
                    "on-error": "#ffffff",
                    "on-secondary": "#ffffff",
                    "tertiary-fixed-dim": "#bac9d3",
                    "on-surface": "#191c1e",
                    "error-container": "#ffdad6",
                    "tertiary": "#505e67",
                    "surface-variant": "#e0e3e5",
                    "on-primary": "#ffffff",
                    "surface-dim": "#d8dadc",
                    "on-tertiary": "#ffffff",
                    "surface-bright": "#f7f9fb",
                    "secondary-fixed": "#94f990",
                    "background": "#f7f9fb",
                    "on-primary-container": "#fefcff",
                    "on-tertiary-fixed-variant": "#3b4951",
                    "inverse-on-surface": "#eff1f3",
                    "on-secondary-container": "#00731e",
                    "surface-container-lowest": "#ffffff",
                    "surface": "#f7f9fb"
                  },
                  borderRadius: {
                    DEFAULT: "0.25rem",
                    lg: "0.5rem",
                    xl: "1.5rem",
                    full: "9999px"
                  },
                  fontFamily: {
                    headline: ["Manrope"],
                    body: ["Inter"],
                    label: ["Inter"]
                  }
                }
              }
            };
          `}
        </Script>
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      </head>
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
