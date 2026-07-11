import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "skelly — Skeletons that draw themselves.",
  description: "skelly reads your rendered UI and generates pixel-accurate loading states for it — components, pages, images, text, tables. Shimmer, pulse, or optimistic. On the server too.",
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
