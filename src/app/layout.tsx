import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "use-skelly/style.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useskelly.dev"),
  title: {
    default: "skelly — Dynamic skeleton screens for your UI",
    template: "%s | skelly"
  },
  description: "Zero-configuration, pixel-perfect skeleton screens auto-extracted from your real DOM at runtime. Zero layout shift, SSR-ready skeleton loader for React, Vue, Svelte, and Vanilla JS.",
  keywords: ["skeleton screens", "skeleton loader", "react loading state", "automatic skeleton loader", "layout-driven loader", "nextjs loading", "vue skeleton", "svelte loading", "layout shift", "CLS", "web performance", "RSC"],
  openGraph: {
    title: "skelly — Dynamic skeleton screens for your UI",
    description: "Zero-configuration, pixel-perfect skeleton screens auto-extracted from your real DOM. Zero layout shift, SSR-ready.",
    url: "https://useskelly.dev",
    siteName: "skelly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "skelly — Dynamic skeleton screens for your UI",
    description: "Zero-configuration, pixel-perfect skeleton screens auto-extracted from your real DOM. Zero layout shift, SSR-ready.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "var(--font-instrument-sans), system-ui, sans-serif" }}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KS4J1R6NP9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KS4J1R6NP9');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
