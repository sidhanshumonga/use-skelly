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
    default: "skelly — Skeleton screens that learn your UI",
    template: "%s | skelly"
  },
  description: "Skeleton loaders measured from your real DOM at runtime, then remembered — so the next load paints your actual layout. No build step, no headless browser, no JSON to regenerate. React, Next.js, Vue, Svelte and vanilla JS.",
  keywords: ["skeleton screens", "skeleton loader", "self-learning skeleton", "skeleton loader without build step", "automatic skeleton loader", "react loading state", "nextjs loading.tsx skeleton", "layout-driven loader", "vue skeleton", "svelte loading", "layout shift", "CLS", "web performance", "RSC", "suspense fallback"],
  openGraph: {
    title: "skelly — Skeleton screens that learn your UI",
    description: "Measured from your real DOM, then remembered. Pixel-accurate skeletons with no build step and nothing to regenerate.",
    url: "https://useskelly.dev",
    siteName: "skelly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "skelly — Skeleton screens that learn your UI",
    description: "Measured from your real DOM, then remembered. Pixel-accurate skeletons with no build step and nothing to regenerate.",
  },
  alternates: {
    canonical: "https://useskelly.dev",
  },
  robots: {
    index: true,
    follow: true,
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "skelly",
  alternateName: "use-skelly",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Skeleton loaders measured from your real DOM at runtime and remembered, so the next load paints your actual layout without a build step.",
  url: "https://useskelly.dev",
  license: "https://opensource.org/licenses/MIT",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
