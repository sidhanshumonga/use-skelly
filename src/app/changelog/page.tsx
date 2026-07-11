import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "skelly — Changelog",
  description: "Release notes and version history for skelly. Every release, newest first.",
};

interface ChangeItem {
  label: string;
  content: string;
  color: string;
  bg: string;
}

interface Release {
  version: string;
  date: string;
  isLatest: boolean;
  title: string;
  changes: ChangeItem[];
}

function getReleases(): Release[] {
  try {
    const filePath = path.resolve(process.cwd(), "CHANGELOG.md");
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const sections = content.split("\n## ").slice(1);

    return sections.map((sec, idx) => {
      const lines = sec.trim().split("\n");
      const headerLine = lines[0]; // e.g. "v2.4.0 - June 28, 2026"
      const [version, date] = headerLine.split(" - ");

      let title = "";
      const changes: ChangeItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("### ")) {
          title = line.replace("### ", "").trim();
        } else if (line.startsWith("- ")) {
          const match = line.match(/^-\s*\[(.*?)\]\s*(.*)$/);
          if (match) {
            const type = match[1];
            const text = match[2];
            let color = "#8A8880";
            let bg = "rgba(28,28,26,.05)";
            
            if (type === "new") {
              color = "#1F8A5B";
              bg = "rgba(31,138,91,.08)";
            } else if (type === "fix") {
              color = "#8A6D1F";
              bg = "rgba(138,109,31,.08)";
            } else if (type === "perf") {
              color = "#4F46E5";
              bg = "rgba(79,70,229,.07)";
            } else if (type === "breaking") {
              color = "#B0483A";
              bg = "rgba(176,72,58,.08)";
            }

            changes.push({
              label: type,
              content: text,
              color,
              bg,
            });
          } else {
            changes.push({
              label: "update",
              content: line.replace("- ", "").trim(),
              color: "#8A8880",
              bg: "rgba(28,28,26,.05)",
            });
          }
        }
      }

      return {
        version: version.trim(),
        date: date ? date.trim() : "",
        isLatest: idx === 0,
        title,
        changes,
      };
    });
  } catch (e) {
    console.error("Failed to parse CHANGELOG.md", e);
    return [];
  }
}

export default function ChangelogPage() {
  const releases = getReleases();

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
          {releases.length === 0 ? (
            <div style={{ color: "#8A8880", fontStyle: "italic" }}>No release history found.</div>
          ) : (
            releases.map((rel, index) => (
              <div
                key={rel.version}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr",
                  gap: "28px",
                  paddingBottom: "48px",
                  position: "relative",
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
                    background: "rgba(28,28,26,.08)",
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
                    borderRadius: "8px",
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
                      borderRadius: "99px",
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
                          height: "fit-content",
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
            ))
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "64px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(28,28,26,.09)",
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
