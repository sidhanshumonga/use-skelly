export interface SkellySpec {
  x: string | number;
  y: string | number;
  w: string | number;
  h: string | number;
  r?: string;
  type?: "text" | "image" | "block" | "surface";
  color?: string;
}

import { recallSpec, rememberSpec, LearnOptions } from "./learn";

export * from "./learn";

export type PresetName = "dashboard" | "article" | "feed" | "profile" | "generic";

export interface SkellyOptions extends LearnOptions {
  visual?: "shimmer" | "pulse" | "optimistic" | "static";
  rows?: number;
  media?: "block" | "dominant-color" | "blurhash";
  preset?: PresetName;
  spec?: SkellySpec[];
  radius?: string;
  cache?: boolean;
  /**
   * How structural parents (cards, panels, sections) are compiled.
   * "leaves"  — default; a parent that contains measurable content emits nothing of its own.
   * "surface" — the parent is kept as a flat, unanimated backing plate behind its children.
   */
  structure?: "leaves" | "surface";
  /**
   * Persist what was measured under `name` and replay it next time. Requires `name`.
   * Defaults to true.
   */
  learn?: boolean;
}

const specCache = new Map<string, SkellySpec[]>();

/** Elements already carrying a mounted skeleton, so a second call can replace it cleanly. */
const activeReleases = new WeakMap<HTMLElement, () => void>();

export const PRESETS: Record<string, SkellySpec[]> = {
  generic: [
    { x: 0, y: 10, w: 200, h: 20, type: "block" },
    { x: 0, y: 40, w: 120, h: 14, type: "block" },
    { x: 0, y: 75, w: "95%", h: 10, type: "text" },
    { x: 0, y: 95, w: "98%", h: 10, type: "text" },
    { x: 0, y: 115, w: "90%", h: 10, type: "text" },
    { x: 0, y: 135, w: "60%", h: 10, type: "text" }
  ],
  dashboard: [
    { x: 0, y: 0, w: 220, h: "100%", type: "block" },
    { x: 240, y: 0, w: "calc(100% - 240px)", h: 60, type: "block" },
    { x: 240, y: 80, w: 200, h: 120, type: "block" },
    { x: 460, y: 80, w: 200, h: 120, type: "block" },
    { x: 680, y: 80, w: 200, h: 120, type: "block" },
    { x: 240, y: 220, w: "calc(100% - 240px)", h: 300, type: "block" }
  ],
  article: [
    { x: 0, y: 0, w: "85%", h: 28, type: "block" },
    { x: 0, y: 40, w: "60%", h: 18, type: "block" },
    { x: 0, y: 75, w: 40, h: 40, r: "50%", type: "image" },
    { x: 52, y: 80, w: 100, h: 12, type: "text" },
    { x: 52, y: 98, w: 80, h: 10, type: "text" },
    { x: 0, y: 140, w: "100%", h: 260, type: "image" },
    { x: 0, y: 420, w: "96%", h: 10, type: "text" },
    { x: 0, y: 440, w: "98%", h: 10, type: "text" },
    { x: 0, y: 460, w: "92%", h: 10, type: "text" },
    { x: 0, y: 480, w: "65%", h: 10, type: "text" }
  ],
  feed: [
    { x: 0, y: 10, w: 44, h: 44, r: "50%", type: "image" },
    { x: 56, y: 16, w: 120, h: 13, type: "text" },
    { x: 56, y: 36, w: 80, h: 10, type: "text" },
    { x: 0, y: 70, w: "95%", h: 12, type: "text" },
    { x: 0, y: 88, w: "92%", h: 12, type: "text" },
    { x: 0, y: 106, w: "60%", h: 12, type: "text" },
    { x: 0, y: 140, w: "100%", h: 1, type: "block" },
    { x: 0, y: 160, w: 44, h: 44, r: "50%", type: "image" },
    { x: 56, y: 166, w: 110, h: 13, type: "text" },
    { x: 56, y: 186, w: 90, h: 10, type: "text" },
    { x: 0, y: 220, w: "98%", h: 12, type: "text" },
    { x: 0, y: 238, w: "80%", h: 12, type: "text" }
  ],
  profile: [
    { x: 0, y: 0, w: "100%", h: 160, type: "image" },
    { x: 30, y: 120, w: 80, h: 80, r: "50%", type: "image" },
    { x: 126, y: 170, w: 180, h: 22, type: "block" },
    { x: 126, y: 198, w: 100, h: 12, type: "text" },
    { x: 30, y: 220, w: "90%", h: 10, type: "text" },
    { x: 30, y: 238, w: "75%", h: 10, type: "text" }
  ]
};

export const PRESET_NAMES = Object.keys(PRESETS);

/** Elements that are their own visual, so their subtree is never walked. */
const MEDIA_TAGS = new Set(["img", "svg", "video", "canvas", "picture", "iframe"]);

/**
 * FNV-1a. Used to derive stable pseudo-random values from an element path so that
 * repeated measurements — and `snapshot()` build output — are byte-for-byte identical.
 */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic replacement for Math.random(), in the range [0, 1). */
function seededUnit(seed: string): number {
  return hashString(seed) / 4294967296;
}

/**
 * Calculates a unique layout cache key for an element.
 * Includes the measured box, because compiled specs are absolute pixel geometry
 * and must not be replayed at a viewport width they were not measured at.
 */
function getElementKey(el: HTMLElement): string {
  const parts: string[] = [el.tagName.toLowerCase()];
  if (el.id) parts.push(`#${el.id}`);

  const className = el.getAttribute("class");
  if (className) {
    const classes = className
      .split(/\s+/)
      .filter(Boolean)
      .filter(c => !c.startsWith("skelly-"))
      .sort()
      .join(".");
    if (classes) parts.push(`.${classes}`);
  }

  const childStructure = Array.from(el.children)
    .map(c => c.tagName.toLowerCase())
    .join("-");
  if (childStructure) parts.push(`[children:${childStructure}]`);

  const rect = el.getBoundingClientRect();
  parts.push(`@${Math.round(rect.width)}x${Math.round(rect.height)}`);

  return parts.join("");
}

/**
 * Drops every compiled layout held in memory. Call after a change that alters
 * geometry without altering markup (theme swap, font load, container resize).
 */
export function clearSpecCache(): void {
  specCache.clear();
}

/**
 * Builds the fallback skeleton, honouring `rows` when the caller asked for a
 * specific number of text lines.
 */
function buildGenericSpec(rows?: number): SkellySpec[] {
  if (!rows || rows < 1) return PRESETS.generic;

  const specs: SkellySpec[] = [
    { x: 0, y: 10, w: 200, h: 20, type: "block" },
    { x: 0, y: 40, w: 120, h: 14, type: "block" }
  ];

  const widths = ["95%", "98%", "90%", "97%", "93%"];
  for (let i = 0; i < rows; i++) {
    specs.push({
      x: 0,
      y: 75 + i * 20,
      w: i === rows - 1 && rows > 1 ? "60%" : widths[i % widths.length],
      h: 10,
      type: "text"
    });
  }

  return specs;
}

/**
 * The lowest point a spec reaches, in pixels, or null when no item carries numeric
 * geometry. Used to reserve height for a skeleton that has no real content under it.
 */
export function specExtent(specs: SkellySpec[]): number | null {
  let extent: number | null = null;
  for (const item of specs) {
    if (typeof item.y !== "number" || typeof item.h !== "number") continue;
    const bottom = item.y + item.h;
    if (extent === null || bottom > extent) extent = bottom;
  }
  return extent;
}

/**
 * The spec for options that need no DOM measurement, or null when the layout can only
 * come from real markup. `hasContent` is false when the container holds nothing to
 * measure — measuring it could only ever produce the generic fallback, so return that
 * directly. Knowing a spec without the DOM is what lets it be rendered on the server.
 */
export function resolveStaticSpec(options: SkellyOptions = {}, hasContent: boolean = true): SkellySpec[] | null {
  if (options.spec) return options.spec;
  if (options.preset === "generic") return buildGenericSpec(options.rows);
  if (options.preset && PRESETS[options.preset]) return PRESETS[options.preset];
  if (!hasContent) return buildGenericSpec(options.rows);
  return null;
}

/**
 * The class name and styles for a single spec item. Shared by the imperative mount and
 * by server rendering, so both paths paint identically.
 */
export function compileItemProps(
  item: SkellySpec,
  options: SkellyOptions = {}
): { className: string; style: Record<string, string> } {
  const visual = options.visual || "shimmer";
  const media = options.media || "block";

  const style: Record<string, string> = {
    left: typeof item.x === "number" ? `${item.x}px` : item.x,
    top: typeof item.y === "number" ? `${item.y}px` : item.y,
    width: typeof item.w === "number" ? `${item.w}px` : item.w,
    height: typeof item.h === "number" ? `${item.h}px` : item.h
  };

  if (item.r) style.borderRadius = item.r;
  if (options.radius) style.borderRadius = options.radius;

  if (item.type === "image") {
    if (media === "dominant-color" && item.color) {
      style.background = item.color;
    } else if (media === "blurhash") {
      style.background = "linear-gradient(45deg, var(--skelly-base), var(--skelly-highlight))";
    }
  }

  return {
    // A surface is scaffolding behind the skeleton, so it never animates.
    className: item.type === "surface" ? "skelly-item skelly-surface" : `skelly-item skelly-${visual}`,
    style
  };
}

/**
 * The content box in container-relative coordinates. `getBoundingClientRect()` always
 * reports the border box, whatever `box-sizing` says.
 */
function getContentBox(
  el: HTMLElement,
  style: CSSStyleDeclaration,
  x: number,
  y: number,
  w: number,
  h: number
): { x: number; y: number; w: number; h: number } {
  const top = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.borderTopWidth) || 0);
  const bottom = (parseFloat(style.paddingBottom) || 0) + (parseFloat(style.borderBottomWidth) || 0);
  const left = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.borderLeftWidth) || 0);
  const right = (parseFloat(style.paddingRight) || 0) + (parseFloat(style.borderRightWidth) || 0);

  return {
    x: x + left,
    y: y + top,
    w: Math.max(0, w - left - right),
    h: Math.max(0, h - top - bottom)
  };
}

/**
 * Walks the DOM subtree of an element and compiles a layout specification.
 */
export function measureLayout(container: HTMLElement, options: SkellyOptions = {}): SkellySpec[] {
  const containerRect = container.getBoundingClientRect();
  const specs: SkellySpec[] = [];

  // `visibility` inherits, so once skelly hides a subtree every descendant reports
  // "hidden" — including the elements we are trying to measure. Anything under a
  // container skelly is currently hiding gets measured on its geometry alone.
  const startsHidden = !!container.closest("[data-skelly-hiding]");

  function walkChildren(el: HTMLElement, path: string, hiddenByHost: boolean) {
    Array.from(el.children).forEach((c, i) => {
      walk(c as HTMLElement, `${path}/${i}:${c.tagName.toLowerCase()}`, hiddenByHost);
    });
  }

  function walk(el: HTMLElement, path: string, hiddenByHost: boolean) {
    if (el === container) {
      walkChildren(el, path, hiddenByHost);
      return;
    }

    // Never measure a skeleton we (or a previous mount) painted.
    if (el.classList && el.classList.contains("skelly-overlay")) {
      return;
    }

    // A nested mount hides its own subtree, so the flag can turn on partway down.
    const insideHidingHost = hiddenByHost || el.hasAttribute("data-skelly-hiding");

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.opacity === "0") {
      return;
    }
    // Outside a mount this guard means what it always meant: the author hid this. Inside
    // one it cannot tell an author's hidden element from the ones skelly just hid, and
    // skipping the whole subtree is far worse than drawing one element that was hidden.
    if (style.visibility === "hidden" && !insideHidingHost) {
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;
    const w = rect.width;
    const h = rect.height;
    const r = style.borderRadius;

    // Only a real raster/vector source counts as media. CSS gradients are decoration
    // (Tailwind's bg-gradient-to-* lands on plain wrappers) and must stay structural.
    const tag = el.tagName.toLowerCase();
    const backgroundImage = style.backgroundImage;
    const hasImageSource = backgroundImage !== "none" && backgroundImage.indexOf("url(") !== -1;

    if (MEDIA_TAGS.has(tag) || hasImageSource) {
      specs.push({ x, y, w, h, r, type: "image" });
      return;
    }

    let hasDirectText = false;
    for (let i = 0; i < el.childNodes.length; i++) {
      const node = el.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        hasDirectText = true;
        break;
      }
    }

    if (hasDirectText) {
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;

      // Text lives in the content box. Measuring the border box instead makes a padded
      // element (a button, a chip) look like it holds one line of text per padding band.
      const inset = getContentBox(el, style, x, y, w, h);
      const contentHeight = inset.h;
      const contentWidth = inset.w;

      const lineCount = Math.max(1, Math.round(contentHeight / lineHeight));
      const singleLineHeight = Math.min(contentHeight, fontSize * 0.85);

      for (let i = 0; i < lineCount; i++) {
        const lineY = inset.y + i * lineHeight + (lineHeight - singleLineHeight) / 2;
        const isLastLine = i === lineCount - 1;
        const ragged = 0.6 + seededUnit(`${path}#${i}`) * 0.3;
        const lineWidth = isLastLine && lineCount > 1 ? contentWidth * ragged : contentWidth;

        specs.push({
          x: inset.x,
          y: lineY,
          w: lineWidth,
          h: singleLineHeight,
          r: r !== "0px" ? r : "4px",
          type: "text"
        });
      }

      return;
    }

    // A CSS gradient is decoration, not media, but it is still something painted —
    // it keeps the element visible as a block rather than dropping it entirely.
    const hasBackgroundColor =
      style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent";
    const hasBackground = hasBackgroundColor || backgroundImage !== "none";
    const hasBorder = style.borderStyle !== "none" && parseFloat(style.borderWidth) > 0;

    const specCountBefore = specs.length;
    walkChildren(el, path, insideHidingHost);
    const subtreeProducedSpecs = specs.length > specCountBefore;

    if (!hasBackground && !hasBorder) {
      return;
    }

    // A card, panel or section is scaffolding, not content. Painting it as a full-size
    // block hides everything inside it behind an identical fill — same gradient, same
    // phase — so the whole component reads as one solid rectangle. Emit a block only
    // when the subtree contributed nothing of its own, i.e. this really is the thing
    // on screen. Callers who want the card outline back opt into a flat surface.
    if (!subtreeProducedSpecs) {
      specs.push({ x, y, w, h, r, type: "block" });
    } else if (options.structure === "surface") {
      specs.splice(specCountBefore, 0, { x, y, w, h, r, type: "surface" });
    }
  }

  walk(container, "", startsHidden);
  return specs;
}

/**
 * Primary core function to mount a skeleton over an element.
 */
export function skelly(element: HTMLElement | null, options: SkellyOptions = {}): () => void {
  if (!element) return () => {};

  // Replace rather than stack: a second call on a live container would otherwise
  // leave the first overlay orphaned and its children permanently hidden.
  const previousRelease = activeReleases.get(element);
  if (previousRelease) previousRelease();

  const useCache = options.cache !== false;
  const hasContent = element.children.length > 0;

  let specs: SkellySpec[];
  // A layout learned from this app's own DOM beats any preset guess, and unlike a
  // measure pass it is available before the real markup has ever rendered.
  const recalled = options.name ? recallSpec(options.name, options) : null;
  const staticSpec = options.spec || recalled || resolveStaticSpec(options, hasContent);

  if (staticSpec) {
    specs = staticSpec;
  } else {
    const cacheKey = `${getElementKey(element)}|${options.structure || "leaves"}`;
    const cached = useCache ? specCache.get(cacheKey) : undefined;

    if (cached && cached.length > 0) {
      specs = cached;
    } else {
      specs = measureLayout(element, options);
      if (specs.length > 0) {
        if (useCache) specCache.set(cacheKey, specs);
      } else {
        specs = buildGenericSpec(options.rows);
      }
    }
  }

  const overlay = document.createElement("div");
  overlay.className = "skelly-overlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  overlay.setAttribute("aria-label", "Loading");

  const originalStyleMap = new Map<HTMLElement, string>();

  const children = Array.from(element.children) as HTMLElement[];
  children.forEach(child => {
    originalStyleMap.set(child, child.style.visibility);
    child.style.visibility = "hidden";
  });

  // Only promote to a positioning context when the element does not already have one;
  // forcing `relative` would break a container the author positioned absolutely or fixed.
  const previousInlinePosition = element.style.position;
  const needsPositioning = window.getComputedStyle(element).position === "static";
  if (needsPositioning) {
    element.style.position = "relative";
  }

  const previousAriaBusy = element.getAttribute("aria-busy");
  element.setAttribute("aria-busy", "true");
  // Tells any measurement taken while this mount is live that the hidden state below
  // is ours, not the author's.
  element.setAttribute("data-skelly-hiding", "true");

  // With no real content underneath, the absolutely positioned items give the container
  // no height at all and spill over whatever follows. Let the overlay sit in normal flow
  // and carry the spec's own extent instead.
  const extent = specExtent(specs);
  if (!hasContent && extent !== null) {
    overlay.classList.add("skelly-overlay-flow");
    overlay.style.setProperty("--skelly-overlay-height", `${extent}px`);
  }

  specs.forEach(item => {
    const el = document.createElement("div");
    const { className, style: itemStyle } = compileItemProps(item, options);

    el.className = className;
    el.setAttribute("aria-hidden", "true");
    Object.assign(el.style, itemStyle);

    overlay.appendChild(el);
  });

  element.classList.add("skelly-container");
  element.appendChild(overlay);

  let released = false;
  const release = () => {
    if (released) return;
    released = true;

    if (overlay.parentNode === element) {
      element.removeChild(overlay);
    }
    element.classList.remove("skelly-container");
    element.removeAttribute("data-skelly-hiding");

    if (needsPositioning) {
      element.style.position = previousInlinePosition;
    }

    if (previousAriaBusy === null) {
      element.removeAttribute("aria-busy");
    } else {
      element.setAttribute("aria-busy", previousAriaBusy);
    }

    children.forEach(child => {
      const orig = originalStyleMap.get(child);
      if (orig !== undefined) {
        child.style.visibility = orig;
      }
    });

    if (activeReleases.get(element) === release) {
      activeReleases.delete(element);
    }
  };

  activeReleases.set(element, release);
  return release;
}

/**
 * Measure what is currently on screen and remember it under `options.name`, so the next
 * load of this layout can paint a real skeleton instead of a generic placeholder.
 *
 * Call it once the real content has rendered. Each viewport bucket is learned separately,
 * and every successful call overwrites what was there — so a layout cannot go stale the
 * way a build-time snapshot does. Returns the spec it stored, or null if there was
 * nothing measurable.
 */
export function learnLayout(element: HTMLElement | null, options: SkellyOptions = {}): SkellySpec[] | null {
  if (!element || !options.name || options.learn === false) return null;
  if (element.querySelector(".skelly-overlay")) return null;

  const specs = measureLayout(element, options);
  if (specs.length === 0) return null;

  rememberSpec(options.name, specs, options);
  return specs;
}
