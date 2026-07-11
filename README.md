<div align="center">
  <h1>skelly</h1>
  <p>Skeletons that draw themselves.</p>
  <p>
    <a href="https://github.com/sidhanshumonga/use-skelly/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/sidhanshumonga/use-skelly?style=flat-square" alt="license" />
    </a>
    <img src="https://img.shields.io/badge/gzipped-2.1_kB-4F46E5?style=flat-square" alt="gzipped size" />
    <img src="https://img.shields.io/badge/dependencies-zero-success?style=flat-square" alt="dependencies" />
  </p>
</div>

---

**Skelly** is a zero-dependency, layout-driven skeleton loader library. Instead of writing custom skeleton loading components for every layout, Skelly measures your actual rendered HTML elements (text lines, avatars, images, tables, grid blocks) and compiles them into a pixel-accurate skeleton overlay.

- **Zero configuration**: Wrap your component subtree and let Skelly derive the loaders.
- **Zero layout shift (CLS)**: The skeleton occupies the exact dimensions of your real elements, guaranteeing seamless transitions when data arrives.
- **SSR & Streaming ready**: Pre-compile route layout snapshots at build time to render skeleton loaders in the first byte of server HTML.
- **Extremely lightweight**: Core is only `2.1 kB` minified + gzipped; framework adapters are `~0.4 kB` each.

---

## 📂 Project Structure

This repository is organized as a monorepo containing both the core package and its documentation website:

* [`/packages/skelly`](file:///Users/sidhanshu/Github/use-skelly/packages/skelly): Source code for the npm utility package.
  * `src/index.ts`: The core layout calculation engine and generic preset wireframes.
  * `src/react.tsx`: React hooks, wrapper components, and suspense boundaries.
  * `src/vue.ts`: Vue 3 directives (`v-skelly`) and components.
  * `src/svelte.ts`: Svelte actions (`use:skelly`) and adapters.
  * `src/next.ts` & `src/build.ts`: Next.js config wrappers and build-time snapshot layout extraction scripts.
* [`/src`](file:///Users/sidhanshu/Github/use-skelly/src): Next.js App Router website codebase hosting the landing page, live benchmark tests, and dynamic markdown documentation pages.

---

## 🛠️ Getting Started

### 1. Installation

Install the package via npm:

```bash
npm install skelly-js
```

Import global keyframe animations in your root styles file:

```css
import "skelly-js/style.css";
```

### 2. Usage in React / Next.js

```tsx
import { Skelly } from "skelly-js/react";

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

## 🤝 Open Source Contributions

We welcome contributions of all forms: bug fixes, adapters for new frameworks, feature suggestions, or documentation improvements!

### Local Development Setup

To run this monorepo locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sidhanshumonga/use-skelly.git
   cd use-skelly
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Skelly Package**:
   Compile the library and generate TypeScript declarations inside the `dist` directory:
   ```bash
   npm run build
   ```

4. **Launch the Documentation Website**:
   Start the Next.js dev server on `http://localhost:3000`:
   ```bash
   npm run dev
   ```

### Contribution Guidelines

* **Keep it Lightweight**: Skelly is built to be a fast, zero-dependency engine. Avoid adding external runtime dependencies.
* **Write Type-Safe Code**: All core files and adapters must be fully typed in TypeScript.
* **Verify Builds**: Before submitting a Pull Request, ensure that lint and build tests pass cleanly:
  ```bash
  npm run lint
  npm run build
  ```
