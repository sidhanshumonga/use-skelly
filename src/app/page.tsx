import Link from "next/link";
import Navbar from "@/components/Navbar";
import BenchmarkRunner from "@/components/BenchmarkRunner";
import CopyInstallButton from "@/components/CopyInstallButton";
import MorphingDemoCard from "@/components/MorphingDemoCard";
import FrameworkCodeTabs from "@/components/FrameworkCodeTabs";

export default function Home() {

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* ============ HERO ============ */}
      <header style={{
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        gap: "64px",
        alignItems: "center",
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "88px 40px 96px",
        width: "100%"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ marginBottom: "-8px" }}>
            <a 
              href="https://www.producthunt.com/products/skelly?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-skelly" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: "inline-block" }}
            >
              <img 
                alt="Skelly - Skeletons that draw themselves — from your own UI | Product Hunt" 
                width="190" 
                height="41" 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1194574&amp;theme=light&amp;t=1783987263505" 
                style={{ 
                  display: "block",
                  borderRadius: "6px"
                }}
              />
            </a>
          </div>

          <h1 style={{
            margin: 0,
            fontSize: "58px",
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            fontWeight: 700,
            textWrap: "balance"
          }}>
            Skeletons that draw themselves.
          </h1>
          <p style={{
            margin: 0,
            fontSize: "19px",
            lineHeight: 1.55,
            color: "#55534C",
            maxWidth: "46ch",
            textWrap: "pretty"
          }}>
            skelly reads your rendered UI and generates pixel-accurate loading states for it — components, pages, images, text, tables. Shimmer, pulse, or optimistic. On the server too.
          </p>
          
          <div id="install" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CopyInstallButton command="npm i use-skelly" />
            <Link href="/docs" style={{
              fontSize: "14.5px",
              fontWeight: 600,
              padding: "13px 18px"
            }}>
              Read the docs →
            </Link>
          </div>

          <div style={{
            display: "flex",
            gap: "22px",
            fontSize: "13px",
            color: "#8A8880",
            fontFamily: "var(--font-jetbrains-mono), monospace"
          }}>
            <span>2.1 kB gzip</span>
            <span>·</span>
            <span>zero deps</span>
            <span>·</span>
            <span>MIT</span>
          </div>
        </div>

        {/* Live morphing demo */}
        <MorphingDemoCard />
      </header>

      {/* ============ HOW ============ */}
      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 40px 96px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "26px",
            background: "#fff",
            border: "1px solid rgba(28,28,26,.08)",
            borderRadius: "14px"
          }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12px", color: "#4F46E5" }}>
              01 — wrap
            </div>
            <div style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "13.5px",
              color: "#3A3833",
              background: "#F5F4F0",
              padding: "12px 14px",
              borderRadius: "8px",
              lineHeight: 1.6
            }}>
              &lt;Skelly loading={"{isLoading}"}&gt;<br />
              &nbsp;&nbsp;&lt;ProfileCard /&gt;<br />
              &lt;/Skelly&gt;
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#55534C", lineHeight: 1.55 }}>
              Wrap anything — a button, a table, an entire page.
            </p>
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "26px",
            background: "#fff",
            border: "1px solid rgba(28,28,26,.08)",
            borderRadius: "14px"
          }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12px", color: "#4F46E5" }}>
              02 — analyze
            </div>
            <div style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "13.5px",
              color: "#3A3833",
              background: "#F5F4F0",
              padding: "12px 14px",
              borderRadius: "8px",
              lineHeight: 1.6
            }}>
              ▸ 1 avatar (circle)<br />
              ▸ 3 text lines (61–100%)<br />
              ▸ 1 image block
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#55534C", lineHeight: 1.55 }}>
              skelly measures the real layout — shapes, radii, line lengths.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "26px",
            background: "#fff",
            border: "1px solid rgba(28,28,26,.08)",
            borderRadius: "14px"
          }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12px", color: "#4F46E5" }}>
              03 — render
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              background: "#F5F4F0",
              padding: "14px",
              borderRadius: "8px"
            }}>
              <div style={{
                height: "11px",
                width: "70%",
                borderRadius: "5px",
                background: "linear-gradient(90deg, #E4E2DC 25%, #F0EEE8 50%, #E4E2DC 75%)",
                backgroundSize: "200% 100%",
                animation: "skShimmer 1.4s linear infinite"
              }} />
              <div style={{
                height: "11px",
                borderRadius: "5px",
                background: "linear-gradient(90deg, #E4E2DC 25%, #F0EEE8 50%, #E4E2DC 75%)",
                backgroundSize: "200% 100%",
                animation: "skShimmer 1.4s linear infinite"
              }} />
              <div style={{
                height: "11px",
                width: "45%",
                borderRadius: "5px",
                background: "linear-gradient(90deg, #E4E2DC 25%, #F0EEE8 50%, #E4E2DC 75%)",
                backgroundSize: "200% 100%",
                animation: "skShimmer 1.4s linear infinite"
              }} />
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#55534C", lineHeight: 1.55 }}>
              A matching skeleton renders instantly — client or server.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" style={{
        background: "#fff",
        borderTop: "1px solid rgba(28,28,26,.07)",
        borderBottom: "1px solid rgba(28,28,26,.07)",
        padding: "88px 40px",
        width: "100%"
      }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-0.03em", fontWeight: 700 }}>
            Every loading state. One API.
          </h2>
          <p style={{ margin: "0 0 44px", fontSize: "16.5px", color: "#55534C", maxWidth: "56ch" }}>
            Pick a visual per component or set one globally. All of them respect{" "}
            <span style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "14.5px",
              background: "#F5F4F0",
              padding: "1px 6px",
              borderRadius: "5px"
            }}>
              prefers-reduced-motion
            </span>.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "22px",
              border: "1px solid rgba(28,28,26,.08)",
              borderRadius: "14px",
              background: "#FAFAF8"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{
                  height: "10px",
                  width: "80%",
                  borderRadius: "5px",
                  background: "linear-gradient(90deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
                  backgroundSize: "200% 100%",
                  animation: "skShimmer 1.4s linear infinite"
                }} />
                <div style={{
                  height: "10px",
                  width: "55%",
                  borderRadius: "5px",
                  background: "linear-gradient(90deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
                  backgroundSize: "200% 100%",
                  animation: "skShimmer 1.4s linear infinite"
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Shimmer</div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                  GPU-composited sweep. The classic.
                </div>
              </div>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "22px",
              border: "1px solid rgba(28,28,26,.08)",
              borderRadius: "14px",
              background: "#FAFAF8"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{
                  height: "10px",
                  width: "80%",
                  borderRadius: "5px",
                  background: "#E4E2DC",
                  animation: "skPulse 1.6s ease infinite"
                }} />
                <div style={{
                  height: "10px",
                  width: "55%",
                  borderRadius: "5px",
                  background: "#E4E2DC",
                  animation: "skPulse 1.6s ease infinite"
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Pulse</div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                  Quieter. Great for dense tables.
                </div>
              </div>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "22px",
              border: "1px solid rgba(28,28,26,.08)",
              borderRadius: "14px",
              background: "#FAFAF8"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{ height: "10px", width: "80%", borderRadius: "5px", background: "rgba(79,70,229,.16)" }} />
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#4F46E5" }}>
                  &quot;Untitled draft&quot; ✓ saved
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Optimistic</div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                  Render expected data, reconcile on arrival.
                </div>
              </div>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "22px",
              border: "1px solid rgba(28,28,26,.08)",
              borderRadius: "14px",
              background: "#FAFAF8"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#8A8880" }}>
                  HTML → <span style={{ color: "#4F46E5" }}>skeleton inlined</span>
                </div>
                <div style={{
                  height: "10px",
                  width: "70%",
                  borderRadius: "5px",
                  background: "linear-gradient(90deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
                  backgroundSize: "200% 100%",
                  animation: "skShimmer 1.4s linear infinite"
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>SSR / streaming</div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                  Skeletons in the first byte. No hydration flash.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginTop: "18px" }}>
            <div style={{ padding: "22px", border: "1px solid rgba(28,28,26,.08)", borderRadius: "14px", background: "#FAFAF8" }}>
              <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Whole pages</div>
              <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                Route-level snapshots generate full-page skeletons at build time.
              </div>
            </div>
            <div style={{ padding: "22px", border: "1px solid rgba(28,28,26,.08)", borderRadius: "14px", background: "#FAFAF8" }}>
              <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Text-aware</div>
              <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                Line count and ragged-edge widths match your real copy.
              </div>
            </div>
            <div style={{ padding: "22px", border: "1px solid rgba(28,28,26,.08)", borderRadius: "14px", background: "#FAFAF8" }}>
              <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Images &amp; media</div>
              <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                Aspect-ratio-locked blocks. Optional dominant-color fill.
              </div>
            </div>
            <div style={{ padding: "22px", border: "1px solid rgba(28,28,26,.08)", borderRadius: "14px", background: "#FAFAF8" }}>
              <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Tables &amp; lists</div>
              <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.5 }}>
                Row-count hints; sticky headers stay real while cells load.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FRAMEWORKS ============ */}
      <section id="frameworks" style={{ maxWidth: "1180px", margin: "0 auto", padding: "88px 40px", width: "100%" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-0.03em", fontWeight: 700 }}>
          Your framework. Or none.
        </h2>
        <p style={{ margin: "0 0 32px", fontSize: "16.5px", color: "#55534C" }}>
          The core is vanilla — 2.1 kB, framework-agnostic. Thin adapters where you want idioms.
        </p>

        <FrameworkCodeTabs />
      </section>

      {/* ============ COMPARISON ============ */}
      <section style={{
        background: "#fff",
        borderTop: "1px solid rgba(28,28,26,.07)",
        borderBottom: "1px solid rgba(28,28,26,.07)",
        padding: "88px 40px",
        width: "100%"
      }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 44px", fontSize: "36px", letterSpacing: "-0.03em", fontWeight: 700 }}>
            Stop hand-rolling gray boxes.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div style={{ padding: "30px", border: "1px solid rgba(28,28,26,.1)", borderRadius: "14px", background: "#FAFAF8" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12.5px", color: "#8A8880", marginBottom: "18px" }}>
                {"// hand-rolled skeletons"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "15px", color: "#55534C", lineHeight: 1.5 }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>One skeleton component per real component — forever out of sync</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Redesign a card, forget its skeleton, ship the layout jump</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Client-only — blank page until hydration</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Every dev invents their own shade of gray</span>
                </div>
              </div>
            </div>

            <div style={{ padding: "30px", border: "1px solid rgba(28,28,26,.1)", borderRadius: "14px", background: "#FAFAF8" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12.5px", color: "#8A8880", marginBottom: "18px" }}>
                {"// compile-time json registry"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "15px", color: "#55534C", lineHeight: 1.5 }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Requires running a CLI build command every time you change code</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Commits massive JSON coordinate files directly into Git history</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Shifts/breaks on layout sizing if not continuously rebuilt</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#B4B2AA", flex: "none" }}>✕</span>
                  <span>Cannot placeholder empty or undesigned page layouts</span>
                </div>
              </div>
            </div>

            <div style={{
              padding: "30px",
              border: "1.5px solid rgba(79,70,229,.35)",
              borderRadius: "14px",
              background: "linear-gradient(180deg, rgba(79,70,229,.045), rgba(79,70,229,0))",
              boxShadow: "0 8px 28px rgba(79,70,229,.08)"
            }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12.5px", color: "#4F46E5", marginBottom: "18px" }}>
                {"// skelly (dynamic runtime)"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px", fontSize: "15px", color: "#3A3833", lineHeight: 1.5 }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#4F46E5", flex: "none" }}>✓</span>
                  <span>Zero config: measures real layouts dynamically at runtime</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#4F46E5", flex: "none" }}>✓</span>
                  <span>No compile scripts or massive JSON code-generation files</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#4F46E5", flex: "none" }}>✓</span>
                  <span>Self-healing: naturally handles responsive viewport shifts</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ color: "#4F46E5", flex: "none" }}>✓</span>
                  <span>Ready-made presets to placeholder layouts instantly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENCHMARKS ============ */}
      <section id="benchmarks" style={{ maxWidth: "1180px", margin: "0 auto", padding: "88px 40px", width: "100%" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "36px", letterSpacing: "-0.03em", fontWeight: 700 }}>
          Small enough to not think about.
        </h2>
        <p style={{ margin: "0 0 40px", fontSize: "16.5px", color: "#55534C" }}>
          Bundle size, minified + gzip. Core only; adapters add ~0.4 kB.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 70px", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", fontWeight: 600 }}>skelly</span>
            <div style={{ height: "26px", borderRadius: "6px", background: "rgba(28,28,26,.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "8%", borderRadius: "6px", background: "linear-gradient(90deg,#4F46E5,#8B7CF0)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>
              2.1 kB
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 70px", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", color: "#55534C" }}>
              react-loading-x
            </span>
            <div style={{ height: "26px", borderRadius: "6px", background: "rgba(28,28,26,.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "34%", borderRadius: "6px", background: "#C9C7BF" }} />
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#8A8880" }}>
              8.9 kB
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 70px", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", color: "#55534C" }}>
              placeholder-ui
            </span>
            <div style={{ height: "26px", borderRadius: "6px", background: "rgba(28,28,26,.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "52%", borderRadius: "6px", background: "#C9C7BF" }} />
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#8A8880" }}>
              13.6 kB
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 70px", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", color: "#55534C" }}>
              hand-rolled (avg)
            </span>
            <div style={{ height: "26px", borderRadius: "6px", background: "rgba(28,28,26,.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", borderRadius: "6px", background: "#C9C7BF" }} />
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px", color: "#8A8880" }}>
              26+ kB
            </span>
          </div>
        </div>

        <BenchmarkRunner />

        <div style={{ display: "flex", gap: "40px", marginTop: "44px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em" }}>0 ms</div>
            <div style={{ fontSize: "13.5px", color: "#8A8880" }}>layout shift (CLS) introduced</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em" }}>&lt; 1 ms</div>
            <div style={{ fontSize: "13.5px", color: "#8A8880" }}>analysis per component, cached</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em" }}>100%</div>
            <div style={{ fontSize: "13.5px", color: "#8A8880" }}>GPU-composited animations</div>
          </div>
        </div>
      </section>

      {/* ============ CTA + FOOTER ============ */}
      <section style={{ background: "#1C1C1A", color: "#E8E6E0", padding: "88px 40px 0", marginTop: "auto", width: "100%" }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "22px",
          textAlign: "center",
          paddingBottom: "80px"
        }}>
          <h2 style={{ margin: 0, fontSize: "42px", letterSpacing: "-0.03em", fontWeight: 700, color: "#fff" }}>
            Ship the skeleton, not the spinner.
          </h2>
          <CopyInstallButton command="npm i use-skelly" variant="dark" />
        </div>

        <footer style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 0 28px",
          borderTop: "1px solid rgba(255,255,255,.1)",
          fontSize: "13px",
          color: "#8A8880"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "5px", border: "1.5px solid #8A8880" }} />
            <span>skelly — MIT license</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href="https://github.com/sidhanshumonga/use-skelly" target="_blank" rel="noopener noreferrer" style={{ color: "#8A8880" }}>
              GitHub
            </a>
            <Link href="/docs" style={{ color: "#8A8880" }}>
              Docs
            </Link>
            <Link href="/changelog" style={{ color: "#8A8880" }}>
              Changelog
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
