import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "skelly/style.css";

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
    default: "skelly — Skeletons that draw themselves.",
    template: "%s | skelly"
  },
  description: "skelly reads your rendered UI and generates pixel-accurate loading states for it — components, pages, images, text, tables. Shimmer, pulse, or optimistic. On the server too.",
  keywords: ["skeleton loader", "react loading state", "nextjs loading", "vue skeleton", "svelte loading", "layout shift", "CLS", "web performance", "RSC"],
  openGraph: {
    title: "skelly — Skeletons that draw themselves.",
    description: "Generate pixel-accurate skeleton loaders from your real component markup layout automatically.",
    url: "https://useskelly.dev",
    siteName: "skelly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "skelly — Skeletons that draw themselves.",
    description: "Generate pixel-accurate skeleton loaders from your real component markup layout automatically.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "var(--font-instrument-sans), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
