# use-skelly — agent guide

Skeleton loaders measured from the real DOM at runtime and remembered, so the next load
paints the actual layout instead of a guess. Zero dependencies. No build step, no CLI pass,
no generated JSON to keep in sync.

This file is the short, authoritative version for coding agents. Full docs: https://useskelly.dev

## Install

```bash
npm i use-skelly
```

Import the stylesheet exactly once, at the app root (`app/layout.tsx`, `main.tsx`, `index.css`):

```ts
import "use-skelly/style.css";
```

Without it, skeleton elements render with no size or animation.

## The one pattern that matters

Wrap the **real content**. Do not write a separate skeleton component.

```tsx
import { Skelly } from "use-skelly/react";

<Skelly name="article-card" loading={isLoading}>
  <ArticleCard data={data} />
</Skelly>
```

Children always render; skelly hides them and paints a skeleton over the top. That is why
there is no second copy of the layout to drift out of sync.

`name` turns on learning: the real layout is measured once it renders, stored per viewport
breakpoint, and replayed on later loads. Give every wrapper a stable, unique name.

## Migrating an existing codebase

1. Find hand-written skeleton/shimmer/placeholder components and every
   `isLoading ? <Skeleton /> : <Content />` branch.
2. Replace each with a `<Skelly name="..." loading={...}>` wrapper around the real content.
3. **Delete the skeleton component you replaced.** Leaving it behind defeats the point.
4. Mark purely decorative elements `data-skelly-ignore`.

`npx skelly init` does the install and stylesheet wiring for you. It is idempotent — it
checks before writing, so re-running it is safe.

## Where there is no DOM to measure

A Next.js `loading.tsx` or a Suspense fallback renders *instead of* the page, so there is
nothing to measure. Use a preset — presets need no measurement and render on the server,
so they paint before any JavaScript runs:

```tsx
// app/dashboard/loading.tsx
import { Skelly } from "use-skelly/react";

export default function Loading() {
  return <Skelly preset="dashboard" />;
}
```

Presets: `dashboard` · `article` · `feed` · `profile` · `generic`

The first-ever visit to a learned layout is also generic, since nothing has been measured
yet. To serve real layouts on a first visit, export what a browser learned and render it
from the server:

```tsx
// app/layout.tsx
import { SkellySpecs } from "use-skelly/react";
import specs from "./skelly-specs.json"; // from exportLearnedSpecs()

<SkellySpecs specs={specs}>{children}</SkellySpecs>
```

## API

### Entry points

| Import | Exports |
| --- | --- |
| `use-skelly` | `skelly`, `measureLayout`, `learnLayout`, `recallSpec`, `exportLearnedSpecs`, `importLearnedSpecs`, `clearLearnedSpecs`, `clearSpecCache`, `breakpointFor`, `learnedKey`, `resolveStaticSpec`, `specExtent`, `compileItemProps`, `PRESETS`, `PRESET_NAMES`, `DEFAULT_BREAKPOINTS` |
| `use-skelly/react` | `Skelly`, `useSkelly`, `SkellySpecs`, `SkellySuspense` |
| `use-skelly/vue` | `Skelly`, `vSkelly` |
| `use-skelly/svelte` | `skelly` (action), `Skelly` |
| `use-skelly/next` | `withSkelly` |
| `use-skelly/build` | `snapshot` |
| `use-skelly/style.css` | required stylesheet |

### Options

```ts
skelly(element, {
  name: "article-card",   // stable id — turns on learning
  visual: "shimmer",      // "shimmer" | "pulse" | "optimistic" | "static"
  preset: "dashboard",    // built-in layout; no measurement needed
  spec: [...],            // exact layout; skips measurement entirely
  structure: "leaves",    // "leaves" (default) | "surface"
  media: "block",         // "block" | "dominant-color" | "blurhash"
  rows: 4,                // text rows in the generic skeleton only
  radius: "8px",          // force one radius on every shape
  cache: true,            // false re-measures on every mount
  breakpoints: [0, 480, 768, 1024, 1280, 1536],
  storage: null           // null = in memory only; defaults to localStorage
});
```

`skelly()` returns a release function. Call it when loading ends.

### Other frameworks

```ts
// Vanilla — learning is manual
import { skelly, learnLayout } from "use-skelly";
const release = skelly(el, { name: "card" });
release();
learnLayout(el, { name: "card" });   // once the real content is on screen

// Vue — object form carries options
// <div v-skelly="{ loading: isLoading, name: 'card' }">

// Svelte
// <div use:skelly={{ loading: isLoading, name: 'card' }}>
```

The React adapter calls `learnLayout` for you when `loading` goes false. Vanilla, Vue and
Svelte do not — call it yourself at the point the real content is on screen.

## Styling

Seven CSS custom properties, overridable anywhere:

```css
:root {
  --skelly-base: #E4E2DC;
  --skelly-highlight: #F5F4F0;
  --skelly-radius: 5px;
  --skelly-speed: 1.4s;
  --skelly-surface: rgba(28, 28, 26, 0.03);
  --skelly-surface-border: rgba(28, 28, 26, 0.08);
  --skelly-optimistic: rgba(79, 70, 229, 0.16);
}
```

## Rules and gotchas

- **Do not add a build step, CLI pass or config file.** There isn't one. Measurement happens
  at runtime; `withSkelly()` only sets an env flag and passes webpack through.
- **Do not keep the old skeleton components** after wrapping. Delete them.
- **Do not wrap in a `loading.tsx` and expect measurement.** Use a preset there.
- **Decoration is skipped automatically** — anything blurred, and `aria-hidden` elements
  lifted out of flow with no text. For anything missed, add `data-skelly-ignore`.
- **A structural parent emits nothing of its own** when it contains measurable content, so
  cards read as their contents. Pass `structure: "surface"` to keep the card outline as a
  flat backing plate.
- **Learned layouts live in the browser**, per viewport breakpoint. They never leave it, and
  the server cannot read them — seed first visits with `<SkellySpecs>` instead.
- **The first load of any layout is generic.** A layout has to be seen before it can be
  replayed.
