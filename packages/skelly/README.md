# use-skelly

Skeleton screens that learn your UI. A zero-dependency, layout-driven skeleton state library.

---

**use-skelly** measures your actual rendered HTML elements (text lines, avatars, images, tables, grid blocks) and compiles them into a pixel-accurate skeleton overlay — then remembers what it measured, so the next load paints your real layout instead of a guess. 

Instead of writing custom skeleton loading states for every single component, simply wrap your subtree and let `use-skelly` do the work.

- **Zero configuration**: Derive skeletons dynamically from your markup.
- **Minimal layout shift**: Placeholders are built from the real elements' geometry, so the swap from skeleton to content moves as little as possible.
- **Learns your layout**: Name a region and it is measured once it renders, then replayed on later loads — no build step, nothing to regenerate.
- **Server renderable**: A `preset`, an explicit `spec`, or committed layouts render as real HTML, so a route fallback paints before any JavaScript runs.
- **Lightweight**: core `4.1 kB` min+gzip; React adapter `1.7 kB`, Vue `0.9 kB`, Svelte `0.6 kB`, stylesheet `0.6 kB`.

> **First load is generic.** A layout has to be seen before it can be replayed, so the very
> first visit falls back to a built-in shape unless you give it a `preset`, an explicit
> `spec`, or seed it with `<SkellySpecs>`.

For complete documentation and guides, visit [useskelly.dev](https://useskelly.dev).

---

## 🛠️ Installation

```bash
npm install use-skelly
```

Import global keyframe animations in your root styles file:

```css
import "use-skelly/style.css";
```

---

## 🚀 Quick Start (React / Next.js)

```tsx
import { Skelly } from "use-skelly/react";

function UserProfile({ isLoading, userData }) {
  return (
    <Skelly name="user-profile" loading={isLoading} visual="shimmer">
      <div className="profile-card">
        <img src={userData.avatar} className="avatar" />
        <h2>{userData.name}</h2>
        <p>{userData.bio}</p>
      </div>
    </Skelly>
  );
}
```

---

## 🧠 Skeletons that learn

A measured skeleton is only available once the markup it measures has rendered — which is
never the case at the moment you need it. Give a layout a `name` and that gap closes:

```tsx
<Skelly name="article-card" loading={isLoading}>
  <Article data={data} />
</Skelly>
```

skelly measures the real content when it appears, stores it per viewport bucket, and replays
it the next time that layout is loading — including before the component has ever mounted.

- **1st load** — nothing learned yet, generic skeleton
- **2nd load** — your actual layout, measured from your own DOM
- **after an edit** — re-measured on the next render, so it cannot go stale

That last point is the whole argument against snapshotting at build time. A build artifact
needs a headless browser, a CLI pass, and the discipline to re-run it whenever markup
changes; when someone forgets, the skeleton is quietly wrong. A learned layout is overwritten
by the next successful render.

### Breakpoints

Layouts are stored per viewport bucket — `[0, 480, 768, 1024, 1280, 1536]` by default — so a
layout learned on a desktop is never replayed on a phone. Each width learns itself the first
time someone visits at that size. Override with `breakpoints`:

```javascript
skelly(el, { name: "article-card", breakpoints: [0, 640, 1024] });
```

### Storage

Layouts live in `localStorage` under `skelly:learned:v2`, capped at 120 entries with the
oldest evicted first. Pass `storage` for a different store, or `storage: null` to keep them
in memory only. Nothing leaves the browser.

### Learning API

| Export | Purpose |
| --- | --- |
| `learnLayout(element, { name })` | Measure what is on screen now and store it |
| `recallSpec(name, options?)` | The layout learned for this name at this viewport, or `null` |
| `exportLearnedSpecs()` | Everything learned, as `{ "name@breakpoint": spec }` |
| `importLearnedSpecs(specs, options?)` | Merge exported layouts back in |
| `clearLearnedSpecs(options?)` | Drop every learned layout, in memory and storage |
| `breakpointFor(width, breakpoints?)` | The bucket a given viewport width falls into |
| `learnedKey(name, options?)` | The storage key for a name at the current viewport |

### Seeding the first visit

Export what your browser learned, commit it, and render it from the server so new visitors
get real skeletons too:

```tsx
import { exportLearnedSpecs } from "use-skelly";
copy(JSON.stringify(exportLearnedSpecs(), null, 2));
```

```tsx
// app/layout.tsx
import { SkellySpecs } from "use-skelly/react";
import specs from "./skelly-specs.json";

<SkellySpecs specs={specs}>{children}</SkellySpecs>
```

The layouts ship in the HTML, and each browser replaces them with its own measurements.

---

## ⚡ Server rendering & `loading.tsx`

A skeleton whose layout is known without touching the DOM is rendered on the server as real
elements, so it ships in the initial HTML and paints on first paint — no JavaScript required.
That is what makes `<Skelly>` work as a Next.js route fallback:

```tsx
// app/dashboard/loading.tsx
import { Skelly } from "use-skelly/react";

export default function Loading() {
  return <Skelly preset="dashboard" visual="shimmer" />;
}
```

Three cases need no measurement and all three are server rendered: an explicit `spec`, a
`preset`, and a container with no children (which resolves to the generic skeleton).

A **measured** skeleton cannot be — measuring means reading geometry off real markup, and in a
`loading.tsx` the page it would measure has not rendered; the fallback renders instead of it.
Those mount after hydration, which is right for a client-side loading state and wrong for a
route fallback. So wrap real children when the DOM exists, and reach for a preset or a
compiled spec when it does not:

```tsx
<Skelly loading={isLoading}><ProfileCard user={data} /></Skelly>  // measured, client-side
<Skelly preset="profile" />                                       // server rendered
```

Standalone skeletons reserve their own height. Spec items are absolutely positioned, so with no
real content underneath the overlay joins normal flow and carries the spec's extent rather than
collapsing and painting over whatever follows.

---

## 🎛️ Tuning the compile

`skelly()` walks your markup and decides what each element is. A few options steer that:

```javascript
skelly(el, {
  visual: "shimmer",     // "shimmer" | "pulse" | "optimistic" | "static"
  structure: "leaves",   // "leaves" (default) | "surface"
  media: "block",        // "block" | "dominant-color" | "blurhash"
  cache: true            // re-measure on every mount when false
});
```

Decoration is skipped rather than painted: anything blurred, and `aria-hidden` elements
lifted out of flow with no text of their own — a background orb, a glow, a hairline ring.
An `aria-hidden` icon sitting in flow beside a label is still content. For anything the
heuristics miss, mark it `data-skelly-ignore`:

```html
<div class="decorative-gradient" data-skelly-ignore></div>
```

**`structure`** decides what happens to cards, panels and sections — elements that carry a
background or border but exist to hold other things.

- `"leaves"` (default): a structural parent that contains measurable content emits nothing of
  its own, so the skeleton reads as its contents — the way you would hand-write it.
- `"surface"`: the parent is kept as a flat, unanimated backing plate behind its children,
  preserving the card outline. Style it with `--skelly-surface` and `--skelly-surface-border`.

Compiled layouts are cached per container, keyed on its markup and its measured box. Because a
spec is absolute pixel geometry, call `clearSpecCache()` after anything that changes geometry
without changing markup — a webfont landing, a theme swap, a container resize:

```javascript
import { skelly, clearSpecCache } from "use-skelly";

document.fonts.ready.then(clearSpecCache);
```

---

## 🟢 Framework Adapters

`use-skelly` provides native wrappers for all major web frameworks:

### React / Next.js
```tsx
import { Skelly } from "use-skelly/react";
```

### Vue 3 (Directive & Component)
```vue
<script setup>
import { vSkelly, Skelly } from "use-skelly/vue";
</script>

<template>
  <!-- Object form carries options; `v-skelly="isLoading"` still works -->
  <div v-skelly="{ loading: isLoading, name: 'profile-card' }">
    <ProfileCard />
  </div>
</template>
```

### Svelte (Action & Component)
```svelte
<script>
  import { skelly, Skelly } from "use-skelly/svelte";
  export let isLoading = true;
</script>

<div use:skelly={{ loading: isLoading, name: 'profile-card', visual: 'shimmer' }}>
  <slot />
</div>
```

### Vanilla JavaScript
```javascript
import { skelly, learnLayout } from "use-skelly";

const card = document.querySelector("#card");
const release = skelly(card, { name: "card", visual: "shimmer" });

// Once content is fetched and painted, drop the skeleton and learn the real layout.
release();
learnLayout(card, { name: "card" });
```

The React adapter calls `learnLayout` for you when `loading` goes false. In vanilla, Vue and
Svelte you call it yourself at the point the real content is on screen.

---

## 📄 License

MIT © [Sidhanshu Monga](https://github.com/sidhanshumonga)
