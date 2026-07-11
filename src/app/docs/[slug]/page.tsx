import { notFound } from "next/navigation";
import Link from "next/link";
import { chapters, docCodeSnippets } from "@/data/docs";
import PresetDemo from "@/components/PresetDemo";
import type { Metadata } from "next";

const CodeBlock = ({ filename, language, code }: { filename: string; language: string; code: string }) => (
  <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(28,28,26,.12)", margin: "16px 0 24px" }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 16px",
      background: "#2A2925",
      fontFamily: "var(--font-jetbrains-mono), monospace",
      fontSize: "11px",
      color: "#8A8880"
    }}>
      <span>{filename}</span>
      <span>{language}</span>
    </div>
    <pre style={{
      margin: 0,
      background: "#1C1C1A",
      color: "#E8E6E0",
      fontFamily: "var(--font-jetbrains-mono), monospace",
      fontSize: "13.5px",
      lineHeight: 1.8,
      padding: "18px 22px",
      overflowX: "auto"
    }}>{code}</pre>
  </div>
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chapters.find((c) => c.slug === slug);
  if (!chapter) return {};

  return {
    title: `${chapter.title} — skelly`,
    description: chapter.intro,
    openGraph: {
      title: `${chapter.title} — skelly`,
      description: chapter.intro,
      url: `https://useskelly.dev/docs/${slug}`,
    }
  };
}

export async function generateStaticParams() {
  return chapters.map((ch) => ({
    slug: ch.slug,
  }));
}

export default async function DocsChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const activeIndex = chapters.findIndex((c) => c.slug === slug);

  if (activeIndex === -1) {
    notFound();
  }

  const cur = chapters[activeIndex];
  const total = chapters.length;
  const numStr = String(activeIndex + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  const chapterKicker = `Chapter ${numStr} of ${totalStr}`;

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 0 }}>
      {/* Chapter header */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingBottom: "36px",
        borderBottom: "1px solid rgba(28,28,26,.08)",
        marginBottom: "36px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "12px",
          color: "#8A8880"
        }}>
          <span style={{ color: "#4F46E5" }}>{chapterKicker}</span>
          <span>·</span>
          <span>{cur.section}</span>
        </div>
        <h1 style={{
          margin: 0,
          fontSize: "42px",
          letterSpacing: "-0.03em",
          fontWeight: 700,
          lineHeight: 1.08
        }}>
          {cur.title}
        </h1>
        <p style={{
          margin: 0,
          fontSize: "17px",
          color: "#55534C",
          lineHeight: 1.6,
          maxWidth: "58ch",
          textWrap: "pretty"
        }}>
          {cur.intro}
        </p>
      </div>

      {/* Chapter content router */}
      <div style={{ fontSize: "15.5px", color: "#3A3833", lineHeight: 1.65 }}>
        {slug === "installation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(28,28,26,.12)" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 16px",
                background: "#2A2925",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "11px",
                color: "#8A8880"
              }}>
                <span>terminal</span>
                <span>sh</span>
              </div>
              <pre style={{
                margin: 0,
                background: "#1C1C1A",
                color: "#E8E6E0",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "13.5px",
                lineHeight: 1.9,
                padding: "18px 22px",
                overflowX: "auto"
              }}>
                <span style={{ color: "#8A8880", userSelect: "none" }}>$</span> npm i skelly
              </pre>
            </div>
            <p style={{ margin: 0 }}>
              Core is <strong>2.1 kB gzip</strong> with zero dependencies. Framework adapters ship as separate entry points —{" "}
              <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", background: "#F0EEE8", padding: "1px 6px", borderRadius: "5px" }}>skelly/react</code>,{" "}
              <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", background: "#F0EEE8", padding: "1px 6px", borderRadius: "5px" }}>skelly/vue</code>,{" "}
              <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", background: "#F0EEE8", padding: "1px 6px", borderRadius: "5px" }}>skelly/svelte</code>{" "}
              — and add ~0.4 kB each.
            </p>
            <div style={{
              display: "flex",
              gap: "12px",
              padding: "16px 18px",
              borderRadius: "12px",
              background: "rgba(79,70,229,.06)",
              border: "1px solid rgba(79,70,229,.15)",
              fontSize: "14.5px",
              color: "#3A3833",
              lineHeight: 1.6
            }}>
              <span style={{ color: "#4F46E5", flex: "none", fontWeight: 600 }}>tip</span>
              <span>TypeScript types are built in — no <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>@types/skelly</code> needed.</span>
            </div>
          </div>
        )}

        {slug === "quick-start" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              Wrap any subtree. While <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13.5px", background: "#F0EEE8", padding: "1px 6px", borderRadius: "5px" }}>loading</code> is true, skelly renders a skeleton with the exact same geometry as the wrapped content.
            </p>
            <CodeBlock filename="Profile.jsx" language="react" code={docCodeSnippets.quickStartCode} />
            <p style={{ margin: 0 }}>
              That&apos;s the whole integration. skelly measures avatars, text lines, images, buttons, and table cells from the child&apos;s actual rendered layout — no configuration, no skeleton components to write.
            </p>
          </div>
        )}

        {slug === "how-it-works" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px", padding: "22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{
                flex: "none",
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "rgba(79,70,229,.08)",
                color: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "14px",
                fontWeight: 600
              }}>1</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "5px" }}>Measure</div>
                <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                  On first render — or at build time for SSR — skelly walks the subtree and records each element&apos;s box, border radius, and content type: text, image, or block.
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "16px", padding: "22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{
                flex: "none",
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "rgba(79,70,229,.08)",
                color: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "14px",
                fontWeight: 600
              }}>2</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "5px" }}>Compile</div>
                <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                  Measurements compile to a compact skeleton spec — roughly 100 bytes per component — cached and reused across renders and sessions.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", padding: "22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{
                flex: "none",
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "rgba(79,70,229,.08)",
                color: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "14px",
                fontWeight: 600
              }}>3</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "5px" }}>Render</div>
                <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                  While loading, the spec renders as shimmer, pulse, or optimistic placeholders in the same box — zero layout shift when real content arrives.
                </div>
              </div>
            </div>
          </div>
        )}

        {slug === "visuals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
              <div style={{ padding: "20px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  <div style={{
                    height: "9px",
                    width: "85%",
                    borderRadius: "5px",
                    background: "linear-gradient(90deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
                    backgroundSize: "200% 100%",
                    animation: "skShimmer 1.4s linear infinite"
                  }} />
                  <div style={{
                    height: "9px",
                    width: "60%",
                    borderRadius: "5px",
                    background: "linear-gradient(90deg, #E4E2DC 25%, #F5F4F0 50%, #E4E2DC 75%)",
                    backgroundSize: "200% 100%",
                    animation: "skShimmer 1.4s linear infinite"
                  }} />
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12.5px", color: "#4F46E5" }}>
                  visual=&quot;shimmer&quot;
                </div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.55 }}>
                  Default. GPU-composited gradient sweep.
                </div>
              </div>

              <div style={{ padding: "20px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  <div style={{
                    height: "9px",
                    width: "85%",
                    borderRadius: "5px",
                    background: "#E4E2DC",
                    animation: "skPulse 1.6s ease infinite"
                  }} />
                  <div style={{
                    height: "9px",
                    width: "60%",
                    borderRadius: "5px",
                    background: "#E4E2DC",
                    animation: "skPulse 1.6s ease infinite"
                  }} />
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12.5px", color: "#4F46E5" }}>
                  visual=&quot;pulse&quot;
                </div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.55 }}>
                  Opacity fade. Calmer for dense UIs.
                </div>
              </div>

              <div style={{ padding: "20px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  <div style={{ height: "9px", width: "85%", borderRadius: "5px", background: "rgba(79,70,229,.16)" }} />
                  <div style={{ fontSize: "10.5px", fontFamily: "var(--font-jetbrains-mono), monospace", color: "#4F46E5" }}>
                    &quot;Untitled draft&quot; ✓
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "12.5px", color: "#4F46E5" }}>
                  visual=&quot;optimistic&quot;
                </div>
                <div style={{ fontSize: "13.5px", color: "#55534C", lineHeight: 1.55 }}>
                  Renders expected data, reconciles on arrival.
                </div>
              </div>
            </div>
            
            <div style={{
              display: "flex",
              gap: "12px",
              padding: "16px 18px",
              borderRadius: "12px",
              background: "rgba(79,70,229,.06)",
              border: "1px solid rgba(79,70,229,.15)",
              fontSize: "14.5px",
              color: "#3A3833",
              lineHeight: 1.6
            }}>
              <span style={{ color: "#4F46E5", flex: "none", fontWeight: 600 }}>a11y</span>
              <span>All visuals respect <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>prefers-reduced-motion</code>, falling back to a static fill. Skeleton regions are announced as <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>aria-busy</code>.</span>
            </div>
          </div>
        )}

        {slug === "ssr-and-streaming" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <CodeBlock filename="next.config.js" language="js" code={docCodeSnippets.ssrCode} />
            <p style={{ margin: 0 }}>
              Skeleton specs are generated at build time and inlined into the server HTML, so skeletons paint <strong>in the first byte</strong> — before hydration, before any JS executes. The skeleton is plain HTML + CSS; no client runtime is needed to display it.
            </p>
            <p style={{ margin: 0 }}>
              Works with React Server Components, streaming SSR, and islands architectures.
            </p>
          </div>
        )}

        {slug === "whole-page-skeletons" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              Snapshot an entire route at build time. Ideal for route transitions and hard navigations where the whole page loads at once.
            </p>
            <CodeBlock filename="build.js" language="js" code={docCodeSnippets.pagesCode} />
          </div>
        )}

        {slug === "theming" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              One set of tokens controls every skeleton. Set them once to match your design system.
            </p>
            <CodeBlock filename="globals.css" language="css" code={docCodeSnippets.themingCode} />
          </div>
        )}

        {slug === "api" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                skelly(element, options?)
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Core function. Replaces <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>element</code>&apos;s content with a skeleton; returns a <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>release()</code> function that restores it.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.visual
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>&quot;shimmer&quot; | &quot;pulse&quot; | &quot;optimistic&quot; | &quot;static&quot;</code> — default <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>&quot;shimmer&quot;</code>.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.rows
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                For tables and lists: number of placeholder rows to render while data loads. Defaults to the measured count.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.media
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                <code style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "13px" }}>&quot;block&quot; | &quot;dominant-color&quot; | &quot;blurhash&quot;</code> — how image areas render while loading.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                snapshot(route, options?)
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Build-time helper. Renders a route headlessly and emits its full-page skeleton spec.
              </div>
            </div>
          </div>
        )}

        {slug === "presets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              If a page is not yet designed or is empty during cold starts, you can render a pre-defined skeleton layout using Skelly presets. This allows developers to scaffold visual structures instantly.
            </p>
            <CodeBlock filename="Scaffold.jsx" language="react" code={docCodeSnippets.presetsCode} />
            <p style={{ margin: 0 }}>
              Try selecting a preset layout below to see how Skelly draws the loading state:
            </p>
            <PresetDemo />
          </div>
        )}

        {slug === "cli" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              Skelly comes with a built-in zero-dependency command line interface to automate setting up skeleton layouts in React, Next.js, and Vite projects.
            </p>
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>Scaffold a fresh project</h2>
            <p style={{ margin: 0 }}>
              Run the following command to bootstrap a brand new Next.js App Router project pre-configured with route-level Skelly loading files:
            </p>
            <CodeBlock filename="terminal" language="sh" code={docCodeSnippets.cliCreateCode} />
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>Integrate into existing codebase</h2>
            <p style={{ margin: 0 }}>
              To install Skelly, inject styles, and set up generic fallback skeletons automatically inside your existing project:
            </p>
            <CodeBlock filename="terminal" language="sh" code={docCodeSnippets.cliInitCode} />
          </div>
        )}

        {slug === "framework-adapters" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>React Adapter (skelly/react)</h3>
              <p style={{ margin: 0 }}>
                Includes the <code>&lt;Skelly&gt;</code> container wrapper, <code>&lt;Skelly.Suspense&gt;</code> boundaries, and the <code>useSkelly()</code> hook. RSC-compatible.
              </p>
              <CodeBlock filename="Profile.jsx" language="react" code={docCodeSnippets.reactAdapterCode} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>Vue Adapter (skelly/vue)</h3>
              <p style={{ margin: 0 }}>
                Provides the custom directive <code>v-skelly</code> and the <code>&lt;Skelly&gt;</code> wrapper component.
              </p>
              <CodeBlock filename="Profile.vue" language="html" code={docCodeSnippets.vueAdapterCode} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>Svelte Adapter (skelly/svelte)</h3>
              <p style={{ margin: 0 }}>
                Provides the Svelte action <code>use:skelly</code> and a Svelte container element wrapper component.
              </p>
              <CodeBlock filename="Profile.svelte" language="html" code={docCodeSnippets.svelteAdapterCode} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>Vanilla JavaScript Core (skelly)</h3>
              <p style={{ margin: 0 }}>
                The core layout-measurement compiler. Works anywhere in the DOM.
              </p>
              <CodeBlock filename="app.js" language="js" code={docCodeSnippets.vanillaAdapterCode} />
            </div>
          </div>
        )}
      </div>

      {/* ============ PREV / NEXT PAGINATION ============ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "48px", width: "100%" }}>
        {activeIndex > 0 ? (
          <Link
            href={`/docs/${chapters[activeIndex - 1].slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "5px",
              textAlign: "left",
              padding: "18px 22px",
              border: "1px solid rgba(28,28,26,.1)",
              borderRadius: "14px",
              background: "#fff",
              cursor: "pointer",
              fontFamily: "var(--font-instrument-sans), system-ui, sans-serif",
              transition: "border-color .15s, box-shadow .15s",
              color: "inherit"
            }}
            className="hover-card"
          >
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#8A8880" }}>
              ← previous
            </span>
            <span style={{ fontSize: "15.5px", fontWeight: 600, color: "#1C1C1A" }}>
              {chapters[activeIndex - 1].title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {activeIndex < total - 1 ? (
          <Link
            href={`/docs/${chapters[activeIndex + 1].slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "5px",
              textAlign: "right",
              padding: "18px 22px",
              border: "1px solid rgba(28,28,26,.1)",
              borderRadius: "14px",
              background: "#fff",
              cursor: "pointer",
              fontFamily: "var(--font-instrument-sans), system-ui, sans-serif",
              transition: "border-color .15s, box-shadow .15s",
              color: "inherit"
            }}
            className="hover-card"
          >
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#8A8880" }}>
              next →
            </span>
            <span style={{ fontSize: "15.5px", fontWeight: 600, color: "#1C1C1A" }}>
              {chapters[activeIndex + 1].title}
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "5px",
              textAlign: "right",
              padding: "18px 22px",
              border: "1px solid rgba(28,28,26,.1)",
              borderRadius: "14px",
              background: "#fff",
              fontFamily: "var(--font-instrument-sans), system-ui, sans-serif",
              transition: "border-color .15s, box-shadow .15s",
              color: "inherit"
            }}
            className="hover-card"
          >
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "11px", color: "#8A8880" }}>
              done →
            </span>
            <span style={{ fontSize: "15.5px", fontWeight: 600, color: "#1C1C1A" }}>
              Back to home
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}
