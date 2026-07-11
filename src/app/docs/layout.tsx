"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { chapters } from "@/data/docs";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const currentSlug = pathname.split("/").pop() || "installation";

  // Find current chapter index
  const currentChIndex = chapters.findIndex((c) => c.slug === currentSlug);
  const activeIndex = currentChIndex !== -1 ? currentChIndex : 0;

  // Calculate progress
  const totalChapters = chapters.length;
  const progressPct = Math.round(((activeIndex + 1) / totalChapters) * 100) + "%";
  const progressLabel = `${activeIndex + 1} / ${totalChapters} chapters`;

  // Group chapters by section for the sidebar
  const sections = [
    {
      label: "Getting started",
      items: chapters.filter((c) => c.section === "Getting started"),
    },
    {
      label: "Guides",
      items: chapters.filter((c) => c.section === "Guides"),
    },
    {
      label: "Reference",
      items: chapters.filter((c) => c.section === "Reference"),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr",
        gap: "64px",
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "48px 40px 96px",
        alignItems: "start",
        width: "100%"
      }}>
        {/* Sidebar */}
        <aside style={{ position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {sections.map((sec) => (
            <div key={sec.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "10.5px",
                color: "#8A8880",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                padding: "0 12px 8px"
              }}>
                {sec.label}
              </div>
              {sec.items.map((item) => {
                const globalIndex = chapters.findIndex((c) => c.slug === item.slug);
                const isActive = item.slug === currentSlug;
                const numStr = String(globalIndex + 1).padStart(2, "0");

                return (
                  <Link
                    key={item.slug}
                    href={`/docs/${item.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "left",
                      fontFamily: "var(--font-instrument-sans), system-ui, sans-serif",
                      fontSize: "14px",
                      padding: "7px 12px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background .15s",
                      background: isActive ? "#1C1C1A" : "transparent",
                      color: isActive ? "#fff" : "#55534C",
                      fontWeight: isActive ? 600 : 400
                    }}
                    className={!isActive ? "hover-bg-grey" : ""}
                  >
                    <span style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "11px",
                      color: isActive ? "#8B7CF0" : "#B4B2AA"
                    }}>
                      {numStr}
                    </span>
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Progress Card */}
          <div style={{
            margin: "4px 12px 0",
            padding: "14px",
            border: "1px solid var(--sidebar-border)",
            borderRadius: "12px",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ fontSize: "12.5px", color: "#8A8880", lineHeight: 1.5 }}>Reading progress</div>
            <div style={{ height: "5px", borderRadius: "99px", background: "rgba(28,28,26,.07)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                borderRadius: "99px",
                background: "linear-gradient(90deg, #4F46E5, #8B7CF0)",
                transition: "width .35s ease",
                width: progressPct
              }} />
            </div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#8A8880" }}>
              {progressLabel}
            </div>
          </div>
        </aside>

        {/* Dynamic page content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
