"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const isDocs = pathname.startsWith("/docs");
  const isChangelog = pathname.startsWith("/changelog");

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: "64px",
      background: "rgba(250, 250, 248, 0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(28, 28, 26, 0.07)"
    }}>
      {/* Brand logo container */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {pathname === "/" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "26px",
              height: "26px",
              borderRadius: "7px",
              background: "linear-gradient(120deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
              backgroundSize: "200% 100%",
              animation: "skShimmer 2.2s linear infinite",
              border: "1.5px solid #1C1C1A"
            }} />
            <span style={{ fontWeight: 700, fontSize: "17px", letterSpacing: "-0.02em" }}>skelly</span>
          </div>
        ) : (
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#1C1C1A" }}>
            <div style={{
              width: "26px",
              height: "26px",
              borderRadius: "7px",
              background: "linear-gradient(120deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
              backgroundSize: "200% 100%",
              animation: "skShimmer 2.2s linear infinite",
              border: "1.5px solid #1C1C1A"
            }} />
            <span style={{ fontWeight: 700, fontSize: "17px", letterSpacing: "-0.02em" }}>skelly</span>
          </Link>
        )}

        {/* Dynamic subpage tag */}
        {isDocs && (
          <span style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "#8A8880",
            background: "rgba(28, 28, 26, 0.05)",
            padding: "2px 7px",
            borderRadius: "99px"
          }}>
            docs
          </span>
        )}
        {isChangelog && (
          <span style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "11px",
            color: "#8A8880",
            background: "rgba(28, 28, 26, 0.05)",
            padding: "2px 7px",
            borderRadius: "99px"
          }}>
            changelog
          </span>
        )}
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "26px" }}>
        {pathname === "/" ? (
          <>
            <Link href="/docs" className="nav-link">Docs</Link>
            <a href="https://github.com/sidhanshumonga/use-skelly" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub ↗</a>
            <Link href="/docs/installation" className="nav-btn">Get started</Link>
          </>
        ) : isDocs ? (
          <>
            <Link href="/" className="nav-link">Home</Link>
            <a href="https://github.com/sidhanshumonga/use-skelly" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub ↗</a>
          </>
        ) : (
          <>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/docs" className="nav-link">Docs</Link>
            <a href="https://github.com/sidhanshumonga/use-skelly" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub ↗</a>
          </>
        )}
      </div>
    </nav>
  );
}
