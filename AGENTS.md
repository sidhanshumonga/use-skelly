# AGENTS.md

Guidance for coding agents working in this repository.

**If you are here to *use* use-skelly in another codebase**, you want
[`packages/skelly/AGENTS.md`](./packages/skelly/AGENTS.md) instead — that file also ships
inside the npm package, so it is readable at `node_modules/use-skelly/AGENTS.md`.

## What this repo is

A monorepo with two things in it:

| Path | What it is |
| --- | --- |
| `packages/skelly` | The published `use-skelly` library. Zero runtime dependencies. |
| `src` | The Next.js marketing site and docs at useskelly.dev. |
| `test` | Browser regression suite. |
| `scripts` | Bundle size measurement. |

The site depends on the library through `"use-skelly": "file:packages/skelly"`, so it always
builds against the working copy — never against the published package.

## Commands

```bash
npm run build:pkg     # compile the library only (tsc + copy stylesheet)
npm run build         # compile the library, then build the site
npm run dev           # run the docs site
npm run size          # re-measure bundle sizes (esbuild, min + gzip)
npm run test:browser  # serve the regression suite
npm run lint          # eslint
```

## Testing

**Layout measurement cannot be tested in jsdom** — every element reports a zero-sized box,
so a measurement test passes or fails for the wrong reason. The suite runs in a real browser:

```bash
npm run test:browser
# then open http://localhost:8123/test/regression.html
```

It reports on `window.__skellyRegression` and sets `document.title` to `PASS (n)`,
`FAIL (n)` or `ERROR`, so it can be driven headlessly. There is no CI wiring yet.

When you fix a measurement bug, add an assertion to `test/regression.html` **and confirm it
fails against the unfixed code** before you claim it covers the bug. Several bugs in this
library's history looked fixed because the test never exercised the broken path.

## Conventions

- **Branching**: feature branch → merge into `dev` → fast-forward `main`. Never commit
  directly to `main`.
- **Changelog**: `CHANGELOG.md` is parsed and rendered at `/changelog`. Entries are
  `- [tag] text` where tag is one of `new`, `fixed`, `improved`, `changed`, `rename`,
  `perf`, `breaking`. An unknown tag renders grey rather than breaking the page.
- **Versioning**: `package.json` at the root and in `packages/skelly` are kept in step.
  A published version is immutable, so shipping a fix to npm needs a bump.
- **Docs that ship**: `packages/skelly/README.md` is the npm page. `packages/skelly/AGENTS.md`
  ships in the tarball. `src/app/llms.txt/route.ts` serves the same agent guide on the web —
  it reads `packages/skelly/AGENTS.md` at build time, so edit that file rather than the route.
- **Sizes**: never hand-write a size claim. Run `npm run size` and use the output.

## Architecture notes worth knowing before editing `packages/skelly/src`

- `index.ts` — measurement, compilation and mounting. `measureLayout()` walks the DOM and
  emits a flat array of absolute-pixel specs.
- `learn.ts` — persistence of learned layouts. No DOM access, so it is safe on the server.
  Imported by `index.ts`, never the other way round; keep it that way to avoid a cycle.
- Adapters (`react.tsx`, `vue.ts`, `svelte.ts`) are thin wrappers over the core. Behaviour
  belongs in the core so every framework gets it.
- `react.tsx` carries a `"use client"` directive. It must stay — the CLI scaffolds a Next.js
  `loading.tsx` that imports it from a server component.

### Three traps this code has already fallen into

1. **`visibility` inherits.** Skelly hides real content with `visibility: hidden`, so every
   descendant computes as hidden too. Any measurement taken while a skeleton is mounted must
   not treat that as "the author hid this" — see the `data-skelly-hiding` marker.
2. **Specs are absolute pixel geometry.** A spec measured at one viewport is wrong at
   another. That is why the layout cache keys on the measured box and learned layouts bucket
   by breakpoint.
3. **`requestAnimationFrame` never fires in a background tab.** Anything that must run after
   a render — learning, in particular — has to be measured synchronously in the effect.
