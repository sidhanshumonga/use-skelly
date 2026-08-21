# use-skelly

Skeletons that draw themselves. A zero-dependency, layout-driven skeleton state library.

---

**use-skelly** measures your actual rendered HTML elements (text lines, avatars, images, tables, grid blocks) and compiles them into a pixel-accurate skeleton overlay. 

Instead of writing custom skeleton loading states for every single component, simply wrap your subtree and let `use-skelly` do the work.

- **Zero configuration**: Derive skeletons dynamically from your markup.
- **Zero layout shift (CLS)**: Placeholders occupy the exact dimensions of your real elements, guaranteeing layout stability.
- **SSR & Streaming ready**: Pre-compile route layout specs at build time and render skeletons in the first byte of server HTML.
- **Extremely lightweight**: Core is only `2.1 kB` minified + gzipped; framework adapters are `~0.4 kB` each.

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
    <Skelly loading={isLoading} visual="shimmer">
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
  <div v-skelly="isLoading">
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

<div use:skelly={{ loading: isLoading, visual: 'shimmer' }}>
  <slot />
</div>
```

### Vanilla JavaScript
```javascript
import { skelly } from "use-skelly";

const release = skelly(document.querySelector("#card"), {
  visual: "shimmer"
});

// When done:
release();
```

---

## 📄 License

MIT © [Skelly Team](https://github.com/sidhanshumonga/use-skelly)
