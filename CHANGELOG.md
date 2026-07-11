# Changelog

## v2.4.0 - June 28, 2026
### Optimistic mode & blurhash media
- [new] visual="optimistic" — render expected data shapes, reconcile when real data arrives.
- [new] media: "blurhash" — image areas render a blurhash while loading.
- [fix] Table skeletons no longer over-count rows inside virtualized lists.

## v2.3.0 - May 9, 2026
### Svelte adapter & smaller core
- [new] skelly/svelte — component + use:skelly action.
- [perf] Core down from 2.6 kB to 2.1 kB gzip — spec compiler rewritten.
- [fix] Shimmer direction now follows dir="rtl".

## v2.2.0 - March 21, 2026
### Whole-page snapshots
- [new] snapshot() build helper — full-route skeletons for instant navigation states.
- [new] options.rows for tables and lists.

## v2.1.0 - February 2, 2026
### Vue adapter & theming tokens
- [new] skelly/vue — component + v-skelly directive.
- [new] --skelly-* CSS custom properties for theming.
- [fix] Respect prefers-reduced-motion in nested iframes.

## v2.0.0 - December 12, 2025
### SSR rewrite
- [breaking] Skeleton specs now compile at build time; the runtime measure() API was removed.
- [new] Streaming SSR: skeletons inlined into server HTML, painted in the first byte.
- [new] React Server Components support in skelly/react.
