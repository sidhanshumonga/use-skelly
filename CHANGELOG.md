# Changelog

## v0.4.1 - August 21, 2026
### Measuring Through Skelly's Own Hidden State
- [fixed] `measureLayout()` skipped entire subtrees once a skeleton was mounted. Skelly hides real content with `visibility: hidden`, which every descendant inherits, so the guard meant to ignore genuinely hidden elements could not tell them apart from the ones skelly had just hidden — and returned nothing. A container is now marked while skelly is hiding it, and inside that subtree an element is measured on its geometry rather than its inherited visibility. Outside a mount the guard is unchanged: an author's hidden element is still skipped.
- [fixed] A nested `<Skelly>` whose ancestor was already showing a skeleton measured nothing at all, for the same reason. Nested mounts now measure correctly.
- [new] Browser regression suite at `test/regression.html`, served by `npm run test:browser`. Sixteen assertions covering the visibility guard, mounting with `loading` already true, nested mounts, teardown, and the learning loop. Layout measurement cannot be tested in jsdom — every element reports a zero-sized box — so the suite runs against a real browser and reports a machine-readable result on `window.__skellyRegression`.

## v0.4.0 - August 21, 2026
### Skeletons That Learn Your Layout
- [new] Give a layout a `name` and skelly learns it. The real content is measured once it renders, stored per viewport breakpoint, and replayed the next time that layout is loading — including before the component has ever mounted, which is exactly where a measured skeleton could not help before. First load is generic, every load after is your actual layout.
- [new] A learned layout is overwritten by the next successful render, so it cannot go stale the way a build-time snapshot does. Edit a component and the correction happens the first time anyone looks at it — no CLI to re-run, no artifact to regenerate, no headless browser to install.
- [new] `<SkellySpecs specs={...}>` supplies committed layouts to everything beneath it and inlines the same payload for the client. Layouts render on the server, so a first-time visitor gets real skeletons in the HTML rather than a generic placeholder — and each browser then replaces them with its own measurements.
- [new] `learnLayout()`, `recallSpec()`, `exportLearnedSpecs()`, `importLearnedSpecs()`, `clearLearnedSpecs()`, `breakpointFor()` and `learnedKey()` are exported for vanilla use and for moving learned layouts between browsers.
- [new] Learned layouts are bucketed by viewport (`0/480/768/1024/1280/1536`, overridable via `breakpoints`), so a desktop measurement never replays on a phone. Storage is pluggable via `storage`, or `storage: null` to stay in memory. Nothing leaves the browser.
- [fixed] Learning is measured synchronously in the effect rather than inside `requestAnimationFrame`. A page opened in a background tab is never sent frames, so the rAF callback never ran and nothing was ever learned there. A second reading is taken once `document.fonts.ready` resolves, since webfonts change text metrics after first layout.
- [improved] The `name` option is threaded through the Vue adapter, and reading a learned layout goes through `useSyncExternalStore` so it cannot desynchronise hydration.
- [improved] Site and docs rewritten around the learning model, with a new "Learned skeletons" guide, expanded API reference, canonical URL, `SoftwareApplication` structured data and refreshed metadata.

## v0.3.0 - August 20, 2026
### Skeletons In The First Byte
- [new] Skeletons whose layout needs no DOM measurement are now rendered on the server as real elements, so they arrive in the initial HTML and paint before any JavaScript runs. This covers an explicit `spec`, any `preset`, and a container with no children. Previously `<Skelly>` server-rendered to an empty `<div>` and the skeleton only appeared after hydration — which meant a Next.js `loading.tsx` showed nothing at all during the window a route fallback exists to cover.
- [fixed] A standalone skeleton no longer overflows its container. Every spec item is absolutely positioned, so a preset over an empty container gave it no height and painted across whatever followed — the CLI-scaffolded `loading.tsx` reserved 80px for a 145px skeleton. With no real content underneath, the overlay now joins normal flow and carries the spec's extent, reserving exactly the space it occupies.
- [improved] `<Skelly>` with no children resolves to the generic skeleton without a pointless measure pass, in both the React and vanilla paths.
- [new] `resolveStaticSpec()`, `specExtent()` and `compileItemProps()` are exported, so the imperative mount and server rendering compile a spec through exactly one code path.
- [fixed] Documentation credited `withSkelly()` with inlining specs into server HTML. It does not — it sets an environment flag and passes `webpack` through. The SSR guide now describes the mechanism that actually renders skeletons on the server, and which skeletons can and cannot use it.

## v0.2.0 - August 20, 2026
### Skeletons That Read Like Skeletons
- [fixed] Parent containers no longer swallow their children. A card, panel or section with a background or border used to emit a full-size `block` *and* recurse into its children, painting both with an identical gradient at an identical phase — the whole component read as one solid rectangle. Structural parents now emit nothing of their own when their subtree contributes content.
- [new] `structure: "surface"` option keeps the card outline as a flat, unanimated backing plate behind its children, for layouts that need the scaffolding to stay visible.
- [fixed] CSS gradients (`bg-gradient-to-*` and friends) are no longer misclassified as `type: "image"`. Only a real `url()` source counts as media; gradient-backed elements stay structural.
- [fixed] Inline `<svg>` was never detected as media — `tagName` is lowercase for SVG elements, so the `"SVG"` comparison never matched. Media detection is now case-insensitive and also covers `<video>`, `<canvas>`, `<picture>` and `<iframe>`.
- [fixed] Text line geometry is measured against the content box instead of the border box. A padded element such as a button no longer renders one skeleton line per padding band.
- [fixed] Ragged last lines are derived from a seeded hash of the element path rather than `Math.random()`, so repeated measurements and `snapshot()` output are reproducible.
- [fixed] Text sitting directly on the container is now hidden while loading. Only element children were being hidden, leaving loose text nodes painted underneath the skeleton.
- [fixed] Mounting onto a container that already has a skeleton replaces it instead of stacking a second overlay and permanently hiding its children.
- [fixed] The container is only promoted to `position: relative` when it is actually `static`, so an absolutely or fixed positioned container no longer jumps on mount.
- [fixed] `npx skelly create` and `npx skelly init` scaffolded a `loading.tsx` that omitted the required `loading` prop, failing type-check on a freshly generated project. `loading` now defaults to `true` on the React and Vue wrappers, and the templates pass it explicitly.
- [fixed] The layout cache is keyed on the measured container box, so compiled pixel geometry is no longer replayed at a viewport width it was never measured at.
- [fixed] `media: "blurhash"` used hardcoded colours that ignored `--skelly-*` overrides, and `visual: "optimistic"` hardcoded a brand indigo. Both read from tokens now.
- [fixed] The Svelte `SkellyComponent` measured a detached node, so every child reported a zero-sized box and the component always fell back to the generic preset. The node is attached before mounting, and `$set()` / `$destroy()` are implemented.
- [fixed] The Vue directive treated modifiers as raw options, so `v-skelly.pulse` passed `{ pulse: true }` instead of `{ visual: "pulse" }`. Modifiers now map onto real options, and the directive accepts `v-skelly="{ loading, ...options }"`.
- [improved] `rows` is no longer inert — it controls the number of text lines in the generic skeleton.
- [improved] `snapshot()` accepts a `spec` compiled by `measureLayout()`, infers a preset from the route instead of a hardcoded two-branch mock, and states in its log which of the two it wrote.
- [improved] Accessibility: the overlay uses `role="status"` with a matching `aria-live="polite"` (it previously paired `role="alert"` with a conflicting politeness), skeleton items are `aria-hidden`, and `aria-busy` is set on the container being loaded rather than the overlay.
- [improved] `useSkelly()` is generic over the element type, so the returned ref attaches to a `<div>` without a cast.
- [improved] `use-skelly/react` ships the `"use client"` directive, so it can be imported from a React Server Component — the pattern the CLI itself scaffolds.
- [new] `clearSpecCache()` export and a `cache: false` option for layouts whose geometry changes without their markup changing.
- [improved] Package metadata now carries `repository`, `homepage`, `bugs` and `sideEffects`, and the published tarball includes the MIT `LICENSE` it claims.

## v0.1.1 - July 13, 2026
### Renamed and Optimized Package Exports
- [rename] Renamed the package from `skelly` to `use-skelly` on the npm registry.
- [improved] Refined standard export maps to expose sub-adapters (`use-skelly/react`, `use-skelly/vue`, `use-skelly/svelte`, `use-skelly/next`, `use-skelly/build`) with explicit Typescript declaration declarations.
- [improved] Exported stylesheet bundle directly at `use-skelly/style.css`.
- [fixed] Resolved dynamic SSR path resolving errors during build pipeline initialization.

## v0.1.0 - July 11, 2026
### Initial Release of Skelly Package
- [new] Core layout measurement engine (`skelly`) resolving container bounds and text geometries.
- [new] Multi-framework adapters supporting `skelly/react`, `skelly/vue`, and `skelly/svelte`.
- [new] Next.js config wrapper (`withSkelly`) and static build snapshots generator (`snapshot()`).
- [new] Command-line interface (`npx skelly create` / `npx skelly init`) for project setup.
