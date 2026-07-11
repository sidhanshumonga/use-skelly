import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "skelly — Changelog",
  description: "Release notes and version history for skelly. Every release, newest first.",
};

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.4.0",
      date: "June 28, 2026",
      isLatest: true,
      title: "Optimistic mode & blurhash media",
      changes: [
        { type: "new", label: "new", content: 'visual="optimistic" — render expected data shapes, reconcile when real data arrives.', color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "new", label: "new", content: 'media: "blurhash" — image areas render a blurhash while loading.', color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "fix", label: "fix", content: "Table skeletons no longer over-count rows inside virtualized lists.", color: "#8A6D1F", bg: "rgba(138,109,31,.08)" }
      ]
    },
    {
      version: "v2.3.0",
      date: "May 9, 2026",
      isLatest: false,
      title: "Svelte adapter & smaller core",
      changes: [
        { type: "new", label: "new", content: "skelly/svelte — component + use:skelly action.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "perf", label: "perf", content: "Core down from 2.6 kB to 2.1 kB gzip — spec compiler rewritten.", color: "#4F46E5", bg: "rgba(79,70,229,.07)" },
        { type: "fix", label: "fix", content: 'Shimmer direction now follows dir="rtl".', color: "#8A6D1F", bg: "rgba(138,109,31,.08)" }
      ]
    },
    {
      version: "v2.2.0",
      date: "March 21, 2026",
      isLatest: false,
      title: "Whole-page snapshots",
      changes: [
        { type: "new", label: "new", content: "snapshot() build helper — full-route skeletons for instant navigation states.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "new", label: "new", content: "options.rows for tables and lists.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" }
      ]
    },
    {
      version: "v2.1.0",
      date: "February 2, 2026",
      isLatest: false,
      title: "Vue adapter & theming tokens",
      changes: [
        { type: "new", label: "new", content: "skelly/vue — component + v-skelly directive.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "new", label: "new", content: "--skelly-* CSS custom properties for theming.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "fix", label: "fix", content: "Respect prefers-reduced-motion in nested iframes.", color: "#8A6D1F", bg: "rgba(138,109,31,.08)" }
      ]
    },
    {
      version: "v2.0.0",
      date: "December 12, 2025",
      isLatest: false,
      title: "SSR rewrite",
      changes: [
        { type: "breaking", label: "breaking", content: "Skeleton specs now compile at build time; the runtime measure() API was removed.", color: "#B0483A", bg: "rgba(176,72,58,.08)" },
        { type: "new", label: "new", content: "Streaming SSR: skeletons inlined into server HTML, painted in the first byte.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" },
        { type: "new", label: "new", content: "React Server Components support in skelly/react.", color: "#1F8A5B", bg: "rgba(31,138,91,.08)" }
      ]
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* ============ CHANGELOG ============ */}
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 40px 96px", width: "100%" }}>
        <h1 style={{ margin: "0 0 10px", fontSize: "42px", letterSpacing: "-0.03em", fontWeight: 700 }}>
          Changelog
        </h1>
        <p style={{ margin: "0 0 56px", fontSize: "16.5px", color: "#55534C", lineHeight: 1.6 }}>
          Every release, newest first. skelly follows semver.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {releases.map((rel, index) => (
            <div
              key={rel.version}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: "28px",
                paddingBottom: "48px",
                position: "relative"
              }}
            >
              {/* Vertical line connector */}
              {index < releases.length - 1 && (
                <div style={{
                  position: "absolute",
                  left: "170px",
                  top: "8px",
                  bottom: 0,
                  width: "1px",
                  background: "rgba(28,28,26,.08)"
                }} />
              )}
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "15px",
                  fontWeight: 600,
                  background: rel.isLatest ? "#1C1C1A" : "rgba(28,28,26,.06)",
                  color: rel.isLatest ? "#fff" : "#1C1C1A",
                  padding: "4px 12px",
                  borderRadius: "8px"
                }}>
                  {rel.version}
                </span>
                <span style={{ fontSize: "12.5px", color: "#8A8880" }}>{rel.date}</span>
                {rel.isLatest && (
                  <span style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "10.5px",
                    color: "#4F46E5",
                    background: "rgba(79,70,229,.07)",
                    border: "1px solid rgba(79,70,229,.18)",
                    padding: "2px 8px",
                    borderRadius: "99px"
                  }}>
                    latest
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingLeft: "24px" }}>
                <div style={{ fontWeight: 600, fontSize: "17px" }}>{rel.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px", color: "#3A3833", lineHeight: 1.6 }}>
                  {rel.changes.map((item, chIndex) => (
                    <div key={chIndex} style={{ display: "flex", gap: "10px" }}>
                      <span style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "10.5px",
                        color: item.color,
                        background: item.bg,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        flex: "none",
                        height: "fit-content"
                      }}>
                        {item.label}
                      </span>
                      <span>
                        {item.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "64px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(28,28,26,.09)"
        }}>
          <Link href="/" style={{ fontSize: "14.5px", fontWeight: 600 }}>
            ← Back to home
          </Link>
          <Link href="/docs" style={{ fontSize: "14.5px", fontWeight: 600 }}>
            Read the docs →
          </Link>
        </div>
      </main>
    </div>
  );
}
