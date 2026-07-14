# Changelog

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
