import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import HeaderWrapper from "@/components/header-wrapper";

export const metadata: Metadata = {
  title: "Adzek — натуральная бытовая химия из Казахстана",
  description:
    "Экологичные средства для дома: безопасно для семьи, бережно к природе, с производством и доставкой по Казахстану.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru-KZ">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HeaderWrapper />
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
