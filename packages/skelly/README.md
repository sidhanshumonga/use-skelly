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
