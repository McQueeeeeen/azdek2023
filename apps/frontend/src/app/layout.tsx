import "./globals.css";
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import ToastHost from "@/components/ui/toast-host";
import GlobalAnalyticsTracker from "@/components/global-analytics-tracker";

export const metadata: Metadata = {
  title: "Adzek - Натуральная бытовая химия",
  description: "Совершенство чистоты в гармонии с природой. Инновационные эко-продукты для вашего дома.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.tailwind = {
                config: {
                  theme: {
                    extend: {
                      colors: {
                        'primary': '#0058bc',
                        'primary-container': '#0070eb',
                        'secondary': '#006e1c',
                        'secondary-container': '#91f78e',
                        'tertiary': '#505e67',
                        'error': '#ba1a1a',
                        'on-surface': '#191c1e',
                        'on-surface-variant': '#414755',
                        'surface-variant': '#e0e3e5',
                        'outline': '#717786',
                      }
                    }
                  }
                }
              };
            `,
          }}
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" defer />
      </head>
      <body className="bg-background text-on-surface antialiased">
        <GlobalAnalyticsTracker />
        <ToastHost />
        <div className="flex flex-col min-h-screen">
          <SiteHeader />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
          </main>
          <SiteFooter />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-on-surface-variant">Загружаем...</p>
      </div>
    </div>
  );
}
