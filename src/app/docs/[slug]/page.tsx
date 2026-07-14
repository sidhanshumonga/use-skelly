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

function getGithubIssueUrl(pageTitle: string, slug: string) {
  const repoUrl = "https://github.com/sidhanshumonga/use-skelly/issues/new";
  const title = encodeURIComponent(`[Docs] Issue on ${pageTitle}`);
  const body = encodeURIComponent(
    `### Documented Page\n/docs/${slug}\n\n### What is wrong or could be improved?\n[Describe the issue or typo here]\n\n### Suggested correction (optional)\n[Provide suggestion]`
  );
  return `${repoUrl}?title=${title}&body=${body}`;
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

            {/* Compiled Spec JSON Output Showcase */}
            <div style={{ marginTop: "18px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 10px", color: "#1C1C1A" }}>The Compiled Spec Output (JSON)</h2>
              <p style={{ margin: "0 0 16px", fontSize: "14.5px", lineHeight: 1.6, color: "#55534C" }}>
                When the compilation phase finishes, the layout tree is translated into a lightweight, inspectable array of coordinate specifications:
              </p>
              <CodeBlock filename="skeleton.json" language="json" code={docCodeSnippets.specJsonOutputCode} />
              <p style={{ margin: "0", fontSize: "14.5px", lineHeight: 1.6, color: "#55534C" }}>
                Each item inside the specification array maps to a target element bounds:
              </p>
              <ul style={{ margin: "12px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14.5px", color: "#55534C" }}>
                <li><code>x</code> / <code>y</code>: The left and top coordinates relative to the parent wrapping boundary.</li>
                <li><code>w</code> / <code>h</code>: The measured width and height dimensions of the shape.</li>
                <li><code>r</code>: Optional border-radius property (e.g. <code>50%</code> for circular profiles).</li>
                <li><code>type</code>: Element content category, mapping to <code>text</code>, <code>image</code>, or generic <code>block</code> structures.</li>
              </ul>
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
            <p style={{ margin: 0 }}>
              Skelly supports server-side rendering (SSR) and React Server Components (RSC) out of the box. By integrating our Next.js configuration wrapper, you can inline layout coordinate specifications directly into the initial HTML response.
            </p>
            <CodeBlock filename="next.config.js" language="js" code={docCodeSnippets.ssrCode} />
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>How it achieves Zero-CLS SSR</h2>
            <p style={{ margin: 0 }}>
              During build time, Skelly compiles layout structures to static files. When a server-side request arrives:
            </p>
            <ul style={{ margin: "8px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>The server fetches the pre-compiled layout coordinates for the target route.</li>
              <li>The exact pixel-perfect skeleton rectangles are generated as inline inline-CSS shapes inside the server HTML.</li>
              <li>Skeletons render in the **first byte** before any client Javascript runs or hydration begins, eliminating layout jumps.</li>
            </ul>
          </div>
        )}

        {slug === "whole-page-skeletons" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              For route transitions, full page redirects, or dashboard initializations, you can snapshot entire layouts to serve full-page skeleton screens instantly.
            </p>
            <CodeBlock filename="build.js" language="js" code={docCodeSnippets.pagesCode} />
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>Snapshot Lifecycle</h2>
            <p style={{ margin: 0 }}>
              1. **Capture**: During your build pipeline, the <code>snapshot()</code> script boots a headless browser, hits your target routes, and outputs layout JSON arrays.
            </p>
            <p style={{ margin: 0 }}>
              2. **Pre-render**: Import the generated JSON file inside your root entry layouts (like Next.js <code>loading.tsx</code>) to display the full page skeleton instantly on navigations.
            </p>
          </div>
        )}

        {slug === "theming" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              Skelly elements are styled using standard CSS custom properties. By redefining these variables in your root stylesheet, they automatically inherit your brand theme (including dark mode configurations).
            </p>
            <CodeBlock filename="globals.css" language="css" code={docCodeSnippets.themingCode} />
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>CSS Variable tokens</h2>
            <ul style={{ margin: "8px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><code>--skelly-base</code>: The main background color of the skeleton placeholder shapes (e.g. <code>#E4E2DC</code>).</li>
              <li><code>--skelly-highlight</code>: The swipe gradient flash color used for shimmer animations (e.g. <code>#F5F4F0</code>).</li>
              <li><code>--skelly-radius</code>: Global border-radius mapping applied to block shapes.</li>
              <li><code>--skelly-speed</code>: The cycle duration of shimmer or pulse animations (e.g. <code>1.4s</code>).</li>
            </ul>
          </div>
        )}

        {slug === "api" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ margin: "0 0 8px" }}>
              Below is the comprehensive API reference for the core Skelly module. It includes initialization configurations, options types, and build-time options.
            </p>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px", color: "#4F46E5" }}>
                skelly(element: HTMLElement | null, options?: SkellyOptions) =&gt; () =&gt; void
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Replaces the targeted container elements content with a pixel-accurate skeleton overlay. It returns a callback function: <code>release()</code>. Call this release callback as soon as data loading is finished to fade out the skeleton and restore the real component tree.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.visual
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Specifies the skeleton animation style. Accepts <code>&quot;shimmer&quot;</code> (gradient sweep), <code>&quot;pulse&quot;</code> (opacity fade), <code>&quot;optimistic&quot;</code> (reconcile layout values), or <code>&quot;static&quot;</code> (solid color block). Defaults to <code>&quot;shimmer&quot;</code>.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.preset
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Accepts <code>&quot;dashboard&quot; | &quot;article&quot; | &quot;feed&quot; | &quot;profile&quot; | &quot;generic&quot;</code>. Pre-draws a template layout immediately, ideal for when children subtrees are empty during initial server mounts.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.rows
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Configures the number of loading rows to display. Useful for table and list layouts when you want to mock extra content lines while fetching data. Defaults to the measured line count.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px" }}>
                options.media
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Defines image rendering styles. Accepts <code>&quot;block&quot;</code> (gray background), <code>&quot;dominant-color&quot;</code> (fades in the dominant color of the source image), or <code>&quot;blurhash&quot;</code>. Defaults to <code>&quot;block&quot;</code>.
              </div>
            </div>

            <div style={{ padding: "18px 22px", border: "1px solid rgba(28,28,26,.09)", borderRadius: "14px", background: "#fff" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14.5px", fontWeight: 600, marginBottom: "5px", color: "#4F46E5" }}>
                snapshot(route: string, options?: SnapshotOptions) =&gt; Promise&lt;SkellySpec[]&gt;
              </div>
              <div style={{ fontSize: "14.5px", color: "#55534C", lineHeight: 1.6 }}>
                Runs a headless Chromium process during build time, navigates to the target route, measures container layout tree bounds, and emits the coordinate specifications JSON file.
              </div>
            </div>
          </div>
        )}

        {slug === "presets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              Skelly comes bundled with pre-configured layout blueprints (Presets). If your components or page subtrees are completely empty, unstyled, or still in development, presets let you render immediate skeletons with zero custom markup.
            </p>
            <CodeBlock filename="Scaffold.jsx" language="react" code={docCodeSnippets.presetsCode} />
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>Available blueprints</h2>
            <ul style={{ margin: "8px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li><code>generic</code>: A standard layout consisting of a block title and four ragged text rows.</li>
              <li><code>dashboard</code>: A structural admin panel template (sidebar, topbar, stats widgets, and card grids).</li>
              <li><code>article</code>: An editor profile layout with titles, author avatars, and image media placeholders.</li>
              <li><code>feed</code>: A timeline feed preview mapping social card listings and activity updates.</li>
              <li><code>profile</code>: A standard profile layout containing header covers, circular icons, names, and bio metadata.</li>
            </ul>

            <p style={{ margin: "16px 0 0", fontWeight: 600 }}>
              Try selecting a preset layout below to preview the responsive skeleton overlay:
            </p>
            <PresetDemo />
          </div>
        )}

        {slug === "cli" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: 0 }}>
              Skelly includes a lightweight, zero-dependency command-line utility. The CLI can bootstrap fresh projects from templates or automate integrating skeleton styling sheets into existing repositories.
            </p>
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>Scaffold a fresh project</h2>
            <p style={{ margin: 0 }}>
              Run the following command to boot an interactive scaffolding prompt. It will bootstrap a fresh, optimized Next.js App Router project preconfigured with Skelly loading routes and adapters:
            </p>
            <CodeBlock filename="terminal" language="sh" code={docCodeSnippets.cliCreateCode} />
            
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "16px 0 8px", color: "#1C1C1A" }}>Integrate into existing codebase</h2>
            <p style={{ margin: 0 }}>
              To auto-configure Skelly inside an existing codebase:
            </p>
            <CodeBlock filename="terminal" language="sh" code={docCodeSnippets.cliInitCode} />
            <p style={{ margin: 0 }}>
              The installer will auto-detect your project manager (npm, pnpm, yarn, bun) and framework (Next.js, Vite), install the package, inject style rules into your global CSS stylesheets, and create initial loading indicators.
            </p>
          </div>
        )}

        {slug === "framework-adapters" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>React Adapter (use-skelly/react)</h3>
              <p style={{ margin: 0 }}>
                Includes the <code>&lt;Skelly&gt;</code> container wrapper, <code>&lt;Skelly.Suspense&gt;</code> boundaries, and the <code>useSkelly()</code> hook. RSC-compatible.
              </p>
              <CodeBlock filename="Profile.jsx" language="react" code={docCodeSnippets.reactAdapterCode} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>Vue Adapter (use-skelly/vue)</h3>
              <p style={{ margin: 0 }}>
                Provides the custom directive <code>v-skelly</code> and the <code>&lt;Skelly&gt;</code> wrapper component.
              </p>
              <CodeBlock filename="Profile.vue" language="html" code={docCodeSnippets.vueAdapterCode} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>Svelte Adapter (use-skelly/svelte)</h3>
              <p style={{ margin: 0 }}>
                Provides the Svelte action <code>use:skelly</code> and a Svelte container element wrapper component.
              </p>
              <CodeBlock filename="Profile.svelte" language="html" code={docCodeSnippets.svelteAdapterCode} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(28,28,26,.08)", paddingTop: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 4px", color: "#1C1C1A" }}>Vanilla JavaScript Core (use-skelly)</h3>
              <p style={{ margin: 0 }}>
                The core layout-measurement compiler. Works anywhere in the DOM.
              </p>
              <CodeBlock filename="app.js" language="js" code={docCodeSnippets.vanillaAdapterCode} />
            </div>
          </div>
        )}
      </div>

      {/* Report Docs Issue CTA */}
      <div style={{
        marginTop: "64px",
        paddingTop: "16px",
        borderTop: "1px solid rgba(28,28,26,.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "13px",
        color: "#8A8880",
        fontFamily: "var(--font-instrument-sans), system-ui, sans-serif"
      }}>
        <span>Last updated July 2026</span>
        <a
          href={getGithubIssueUrl(cur.title, cur.slug)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#4F46E5",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: 500
          }}
          className="hover-underline"
        >
          Suggest an edit or report a docs issue ↗
        </a>
      </div>

      {/* ============ PREV / NEXT PAGINATION ============ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "24px", width: "100%" }}>
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
