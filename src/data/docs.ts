export interface DocChapter {
  slug: string;
  key: string;
  section: "Getting started" | "Guides" | "Reference";
  title: string;
  intro: string;
}

export const chapters: DocChapter[] = [
  {
    slug: "installation",
    key: "Installation",
    section: "Getting started",
    title: "Installation",
    intro: "Install the core from npm — 2.1 kB gzip, zero dependencies — and optionally a framework adapter."
  },
  {
    slug: "quick-start",
    key: "QuickStart",
    section: "Getting started",
    title: "Quick start",
    intro: "One wrapper component is the entire integration. No skeleton components to write, ever."
  },
  {
    slug: "how-it-works",
    key: "HowItWorks",
    section: "Getting started",
    title: "How it works",
    intro: "Measure, compile, render — skelly derives skeletons from your real layout, so they can never drift."
  },
  {
    slug: "visuals",
    key: "Visuals",
    section: "Guides",
    title: "Visuals",
    intro: "Three loading treatments, switchable per component or set globally. All accessible by default."
  },
  {
    slug: "ssr-and-streaming",
    key: "Ssr",
    section: "Guides",
    title: "SSR & streaming",
    intro: "Skeletons in the first byte of server HTML — before hydration, before JavaScript."
  },
  {
    slug: "whole-page-skeletons",
    key: "Pages",
    section: "Guides",
    title: "Whole-page skeletons",
    intro: "Snapshot entire routes at build time for instant full-page loading states on navigation."
  },
  {
    slug: "learned-skeletons",
    key: "Learned",
    section: "Guides",
    title: "Learned skeletons",
    intro: "Measure the real layout once, remember it, and paint it on every load after — no build step, nothing to regenerate."
  },
  {
    slug: "theming",
    key: "Theming",
    section: "Guides",
    title: "Theming",
    intro: "A handful of CSS custom properties match every skeleton to your design system."
  },
  {
    slug: "api",
    key: "Api",
    section: "Reference",
    title: "API",
    intro: "The complete surface: one function, a handful of options, one build-time helper."
  },
  {
    slug: "cli",
    key: "Cli",
    section: "Reference",
    title: "Skelly CLI",
    intro: "Scaffold fresh templates or initialize Skelly within existing codebases with a single command."
  },
  {
    slug: "presets",
    key: "Presets",
    section: "Guides",
    title: "Generic presets",
    intro: "Scaffold page layouts and preview skeletons before writing your visual components."
  },
  {
    slug: "framework-adapters",
    key: "Adapters",
    section: "Reference",
    title: "Framework adapters",
    intro: "Thin idiomatic wrappers over the vanilla core, each around 0.4 kB."
  }
];

export const agentPrompt = `Add use-skelly to this project and use it for every loading state.

1. Install it:  npm i use-skelly
2. Import the stylesheet once, at the app root:  import "use-skelly/style.css"

3. Find every hand-written skeleton, shimmer or placeholder component, and every
   \`isLoading ? <Skeleton /> : <Content />\` branch.

4. Replace each one with a wrapper around the REAL content:

     import { Skelly } from "use-skelly/react";

     <Skelly name="article-card" loading={isLoading}>
       <ArticleCard data={data} />
     </Skelly>

   The children always render. Skelly measures them and paints a skeleton over the
   top while loading, so there is no second copy of the layout to keep in sync.
   Delete the skeleton components you replace.

5. Give every wrapper a stable, unique \`name\`. That is what makes it learn: the real
   layout is measured once it renders, stored per breakpoint, and replayed on later
   loads — including before that component has mounted. Without a name it falls back
   to a generic shape.

6. A Next.js \`loading.tsx\` or a Suspense fallback has no DOM to measure, because it
   renders instead of the page. Use a preset there:

     export default function Loading() {
       return <Skelly preset="dashboard" />;
     }

   Presets: dashboard | article | feed | profile | generic

7. Mark purely decorative elements — background orbs, glows, gradient blobs — with
   \`data-skelly-ignore\` so they do not become skeleton shapes.

Notes:
- There is no build step, no CLI and no config file. Do not add one.
- Other frameworks: use-skelly/vue, use-skelly/svelte, or skelly(el, options) for
  vanilla JS.
- Docs: https://useskelly.dev/docs`;

export const docCodeSnippets = {
  quickStartCode: `import { Skelly } from 'use-skelly/react'

function Profile({ userId }) {
  const { data, isLoading } = useUser(userId)
  return (
    <Skelly loading={isLoading}>
      <ProfileCard user={data} />
    </Skelly>
  )
}`,
  ssrCode: `// app/dashboard/loading.tsx
import { Skelly } from 'use-skelly/react'

// A preset needs no DOM measurement, so the skeleton
// is rendered into the server HTML itself — it paints
// on first paint, before any JavaScript runs.
export default function Loading() {
  return <Skelly preset="dashboard" visual="shimmer" />
}`,
  ssrMeasuredCode: `// Measured skeletons are client-side: the markup has to
// exist before it can be measured.
<Skelly loading={isLoading}>
  <ProfileCard user={data} />
</Skelly>

// Server-rendered: the layout is known up front.
<Skelly preset="profile" />
<Skelly spec={compiledSpec} />`,
  pagesCode: `// build step
import { snapshot } from 'use-skelly/build'

await snapshot('/dashboard', {
  out: '.skelly/dashboard.json'
})

// runtime — instant full-page skeleton on navigation
router.beforeEach(() => skellyPage('dashboard'))`,
  learnedCode: `import { Skelly } from 'use-skelly/react'

// Give the layout a name and it starts learning.
function ArticleCard({ id }) {
  const { data, isLoading } = useArticle(id)

  return (
    <Skelly name="article-card" loading={isLoading}>
      <Article data={data} />
    </Skelly>
  )
}

// 1st load  — nothing learned yet, generic skeleton
// 2nd load  — the real layout, measured from your own DOM
// after an edit — re-measured on the next render, never stale`,
  learnedExportCode: `// In the browser (a dev route, or your e2e suite):
import { exportLearnedSpecs } from 'use-skelly'

copy(JSON.stringify(exportLearnedSpecs(), null, 2))
// -> { "article-card@1280": [ ... ], "article-card@768": [ ... ] }

// Commit it, then seed every first-time visitor from the server:
// app/layout.tsx
import { SkellySpecs } from 'use-skelly/react'
import specs from './skelly-specs.json'

export default function RootLayout({ children }) {
  return (
    <html><body>
      <SkellySpecs specs={specs}>{children}</SkellySpecs>
    </body></html>
  )
}`,
  themingCode: `:root {
  --skelly-base: #E4E2DC;
  --skelly-highlight: #F5F4F0;
  --skelly-radius: 5px;
  --skelly-speed: 1.4s;

  /* structure: "surface" backing plates */
  --skelly-surface: rgba(28, 28, 26, 0.03);
  --skelly-surface-border: rgba(28, 28, 26, 0.08);

  /* visual: "optimistic" */
  --skelly-optimistic: rgba(79, 70, 229, 0.16);
}`,
  cliCreateCode: `npx skelly create my-awesome-app --next
cd my-awesome-app
npm run dev`,
  cliInitCode: `npx skelly init`,
  presetsCode: `// Use presets to scaffold layouts when children are undesigned or empty
import { Skelly } from 'use-skelly/react';

function Dashboard() {
  return (
    <Skelly loading={true} preset="dashboard">
      <DashboardContent />
    </Skelly>
  );
}

// Available presets: 'dashboard' | 'article' | 'feed' | 'profile' | 'generic'`,
  reactAdapterCode: `import { Skelly } from 'use-skelly/react';
import 'use-skelly/style.css';

function Profile({ isLoading, data }) {
  return (
    <Skelly loading={isLoading}>
      <ProfileCard user={data} />
    </Skelly>
  );
}`,
  vueAdapterCode: `<!-- Using Custom Directive -->
<div v-skelly="isLoading">
  <profile-card :user="data" />
</div>

<!-- Using Wrapper Component -->
<Skelly :loading="isLoading">
  <profile-card :user="data" />
</Skelly>

<script setup>
import { vSkelly, Skelly } from 'use-skelly/vue';
import 'use-skelly/style.css';
</script>`,
  svelteAdapterCode: `<script>
  import { skelly, Skelly } from 'use-skelly/svelte';
  import 'use-skelly/style.css';
  export let isLoading = true;
</script>

<!-- Using Svelte Action -->
<div use:skelly={{ loading: isLoading, visual: 'shimmer' }}>
  <slot />
</div>

<!-- Using Wrapper Component -->
<Skelly loading={isLoading}>
  <slot />
</Skelly>`,
  vanillaAdapterCode: `import { skelly } from 'use-skelly';
import 'use-skelly/style.css';

const element = document.querySelector('.profile-container');
const release = skelly(element, {
  visual: 'shimmer',
  rows: 4
});

// When loading is finished:
release();`,
  specJsonOutputCode: `[
  { "x": 0, "y": 10, "w": 380, "h": 22, "type": "block" },
  { "x": 0, "y": 42, "w": 240, "h": 14, "type": "block" },
  { "x": 0, "y": 74, "w": 44, "h": 44, "r": "50%", "type": "image" },
  { "x": 56, "y": 80, "w": "95%", "h": 10, "type": "text" },
  { "x": 56, "y": 98, "w": "88%", "h": 10, "type": "text" }
]`
};
