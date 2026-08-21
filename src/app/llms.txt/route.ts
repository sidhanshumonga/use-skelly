import { chapters, agentPrompt } from "@/data/docs";

export const dynamic = "force-static";

const SITE = "https://useskelly.dev";

/**
 * https://llmstxt.org — a single plain-text fetch that gives an agent the whole
 * working surface of the library, instead of making it scrape rendered pages.
 *
 * Generated from the same chapter list the docs navigation uses, so it cannot
 * drift out of sync with the site.
 */
function buildLlmsTxt(): string {
  const sections = new Map<string, string[]>();

  chapters.forEach(chapter => {
    const lines = sections.get(chapter.section) || [];
    lines.push(`- [${chapter.title}](${SITE}/docs/${chapter.slug}): ${chapter.intro}`);
    sections.set(chapter.section, lines);
  });

  const docLinks = Array.from(sections.entries())
    .map(([section, lines]) => `## ${section}\n\n${lines.join("\n")}`)
    .join("\n\n");

  return `# use-skelly

> Skeleton loaders measured from your real DOM at runtime and remembered, so the next
> load paints your actual layout instead of a guess. No build step, no headless browser,
> no generated JSON to keep in sync. Works with React, Next.js, Vue, Svelte and vanilla JS.

The package is \`use-skelly\` on npm. MIT licensed. The core is zero-dependency.

## What makes it different

Most auto-skeleton tools snapshot your DOM at build time with a headless browser and
commit the result. That artifact is silently wrong the moment someone edits a component
and forgets to regenerate it. skelly measures at runtime instead: give a layout a
\`name\` and the real markup is measured once it renders, stored per viewport breakpoint,
and replayed on later loads — including before that component has ever mounted. Every
successful render overwrites what was stored, so a learned layout cannot go stale.

## Install

\`\`\`bash
npm i use-skelly
\`\`\`

Import the stylesheet once at the app root:

\`\`\`ts
import "use-skelly/style.css";
\`\`\`

## Core usage

\`\`\`tsx
import { Skelly } from "use-skelly/react";

// Wraps the real content. Children always render; skelly measures them and paints a
// skeleton over the top while loading. There is no second copy of the layout.
<Skelly name="article-card" loading={isLoading}>
  <ArticleCard data={data} />
</Skelly>
\`\`\`

A Next.js \`loading.tsx\` or a Suspense fallback renders *instead of* the page, so there
is no DOM to measure. Use a preset there — presets are server rendered, so they land in
the HTML and paint before any JavaScript runs:

\`\`\`tsx
export default function Loading() {
  return <Skelly preset="dashboard" />;
}
\`\`\`

## Options

- \`name\`: stable identity for a layout. Enables learning; stored per breakpoint.
- \`loading\`: defaults to true, so \`<Skelly />\` works as a standalone fallback.
- \`visual\`: "shimmer" (default) | "pulse" | "optimistic" | "static"
- \`preset\`: "dashboard" | "article" | "feed" | "profile" | "generic"
- \`spec\`: an explicit SkellySpec[] instead of measuring
- \`structure\`: "leaves" (default) | "surface" — whether a card with content inside
  emits nothing of its own, or stays as a flat backing plate behind its children
- \`media\`: "block" (default) | "dominant-color" | "blurhash"
- \`rows\`: number of text rows in the generic skeleton
- \`radius\`: override every item's border radius
- \`cache\`: false to re-measure on every mount
- \`breakpoints\`: viewport buckets for learned layouts (default 0/480/768/1024/1280/1536)
- \`storage\`: where learned layouts persist; null keeps them in memory only

## Exports

From \`use-skelly\`:
\`skelly(element, options)\` returns a release function ·
\`measureLayout(container, options)\` ·
\`learnLayout(element, options)\` ·
\`recallSpec(name, options)\` ·
\`exportLearnedSpecs()\` · \`importLearnedSpecs(specs)\` · \`clearLearnedSpecs()\` ·
\`clearSpecCache()\` · \`breakpointFor(width)\` · \`learnedKey(name)\` ·
\`resolveStaticSpec(options, hasContent)\` · \`specExtent(specs)\` ·
\`compileItemProps(item, options)\` · \`PRESETS\` · \`PRESET_NAMES\`

From \`use-skelly/react\`: \`Skelly\`, \`useSkelly\`, \`SkellySpecs\`, \`SkellySuspense\`
From \`use-skelly/vue\`: \`Skelly\`, \`vSkelly\`
From \`use-skelly/svelte\`: \`skelly\` (action), \`Skelly\`
From \`use-skelly/next\`: \`withSkelly\`
From \`use-skelly/build\`: \`snapshot(route, options)\`

## Attributes

- \`data-skelly-ignore\`: never measure this element. Decoration is skipped automatically
  — anything blurred, and aria-hidden elements lifted out of flow with no text of their
  own — but use this for whatever the heuristics miss.

## Theming

CSS custom properties: \`--skelly-base\`, \`--skelly-highlight\`, \`--skelly-radius\`,
\`--skelly-speed\`, \`--skelly-surface\`, \`--skelly-surface-border\`, \`--skelly-optimistic\`.

## Gotchas

- A measured skeleton needs the markup to exist. In a route fallback it does not, so use
  a preset, an explicit spec, or a learned layout.
- Learned layouts live in the browser, so a first-time visitor has none. Export them with
  \`exportLearnedSpecs()\`, commit the JSON, and render \`<SkellySpecs specs={...}>\` in your
  root layout to seed them from the server.
- There is no CLI build step for measurement and no config file. Do not add one.

${docLinks}

## Prompt for coding agents

${agentPrompt}
`;
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
