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
    slug: "theming",
    key: "Theming",
    section: "Guides",
    title: "Theming",
    intro: "Four CSS custom properties match every skeleton to your design system."
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

export const docCodeSnippets = {
  quickStartCode: `import { Skelly } from 'skelly-js/react'

function Profile({ userId }) {
  const { data, isLoading } = useUser(userId)
  return (
    <Skelly loading={isLoading}>
      <ProfileCard user={data} />
    </Skelly>
  )
}`,
  ssrCode: `import { withSkelly } from 'skelly-js/next'

export default withSkelly({
  // skeleton specs generated at build,
  // inlined into server HTML
})`,
  pagesCode: `// build step
import { snapshot } from 'skelly-js/build'

await snapshot('/dashboard', {
  out: '.skelly/dashboard.json'
})

// runtime — instant full-page skeleton on navigation
router.beforeEach(() => skellyPage('dashboard'))`,
  themingCode: `:root {
  --skelly-base: #E4E2DC;
  --skelly-highlight: #F5F4F0;
  --skelly-radius: 5px;
  --skelly-speed: 1.4s;
}`,
  cliCreateCode: `npx skelly create my-awesome-app --next
cd my-awesome-app
npm run dev`,
  cliInitCode: `npx skelly init`,
  presetsCode: `// Use presets to scaffold layouts when children are undesigned or empty
import { Skelly } from 'skelly-js/react';

function Dashboard() {
  return (
    <Skelly loading={true} preset="dashboard">
      <DashboardContent />
    </Skelly>
  );
}

// Available presets: 'dashboard' | 'article' | 'feed' | 'profile' | 'generic'`,
  reactAdapterCode: `import { Skelly } from 'skelly-js/react';
import 'skelly-js/style.css';

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
import { vSkelly, Skelly } from 'skelly-js/vue';
import 'skelly-js/style.css';
</script>`,
  svelteAdapterCode: `<script>
  import { skelly, Skelly } from 'skelly-js/svelte';
  import 'skelly-js/style.css';
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
  vanillaAdapterCode: `import { skelly } from 'skelly-js';
import 'skelly-js/style.css';

const element = document.querySelector('.profile-container');
const release = skelly(element, {
  visual: 'shimmer',
  rows: 4
});

// When loading is finished:
release();`
};
