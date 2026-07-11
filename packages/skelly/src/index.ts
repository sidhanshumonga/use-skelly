export interface SkellySpec {
  x: string | number;
  y: string | number;
  w: string | number;
  h: string | number;
  r?: string;
  type?: "text" | "image" | "block";
  color?: string;
}

export interface SkellyOptions {
  visual?: "shimmer" | "pulse" | "optimistic" | "static";
  rows?: number;
  media?: "block" | "dominant-color" | "blurhash";
  preset?: "dashboard" | "article" | "feed" | "profile" | "generic";
  spec?: SkellySpec[];
  radius?: string;
}

// Memory cache for specs compiled client-side
const specCache = new Map<string, SkellySpec[]>();

// Pre-defined relative presets
const PRESETS: Record<string, SkellySpec[]> = {
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
    // Post 1
    { x: 0, y: 10, w: 44, h: 44, r: "50%", type: "image" },
    { x: 56, y: 16, w: 120, h: 13, type: "text" },
    { x: 56, y: 36, w: 80, h: 10, type: "text" },
    { x: 0, y: 70, w: "95%", h: 12, type: "text" },
    { x: 0, y: 88, w: "92%", h: 12, type: "text" },
    { x: 0, y: 106, w: "60%", h: 12, type: "text" },
    // Divider
    { x: 0, y: 140, w: "100%", h: 1, type: "block" },
    // Post 2
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

/**
 * Calculates a unique layout cache key for an element.
 */
function getElementKey(el: HTMLElement): string {
  const parts: string[] = [el.tagName.toLowerCase()];
  if (el.id) parts.push(`#${el.id}`);
  if (el.className) {
    const classes = el.className.split(/\s+/).filter(Boolean).sort().join(".");
    if (classes) parts.push(`.${classes}`);
  }
  // Add direct child tags structure to make it unique
  const childStructure = Array.from(el.children)
    .map(c => c.tagName.toLowerCase())
    .join("-");
  if (childStructure) parts.push(`[children:${childStructure}]`);
  return parts.join("");
}

/**
 * Walks the DOM subtree of an element and compiles a layout specification.
 */
export function measureLayout(container: HTMLElement, options: SkellyOptions = {}): SkellySpec[] {
  const containerRect = container.getBoundingClientRect();
  const specs: SkellySpec[] = [];

  function walk(el: HTMLElement) {
    if (el === container) {
      // Don't measure container itself, only traverse children
      Array.from(el.children).forEach(c => walk(c as HTMLElement));
      return;
    }

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
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

    // Detect images
    const isImage = el.tagName === "IMG" || el.tagName === "SVG" || style.backgroundImage !== "none";
    if (isImage) {
      specs.push({ x, y, w, h, r, type: "image" });
      return;
    }

    // Detect elements that directly contain text
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
      const computedHeight = rect.height;

      // Estimate line count
      const lineCount = Math.max(1, Math.round(computedHeight / lineHeight));
      const singleLineHeight = Math.min(computedHeight, fontSize * 0.85);

      for (let i = 0; i < lineCount; i++) {
        const lineY = y + i * lineHeight + (lineHeight - singleLineHeight) / 2;
        // Last line gets a ragged edge if it has multiple lines
        const isLastLine = i === lineCount - 1;
        const lineWidth = (isLastLine && lineCount > 1) ? w * (0.6 + Math.random() * 0.3) : w;

        specs.push({
          x,
          y: lineY,
          w: lineWidth,
          h: singleLineHeight,
          r: r !== "0px" ? r : "4px",
          type: "text"
        });
      }
    } else {
      // If it's a structural container or layout leaf without text, add it if it has an explicit background/border
      const hasBackground = style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent";
      const hasBorder = style.borderStyle !== "none" && parseFloat(style.borderWidth) > 0;
      
      if (hasBackground || hasBorder) {
        specs.push({ x, y, w, h, r, type: "block" });
      }
      
      // Keep traversing children
      Array.from(el.children).forEach(c => walk(c as HTMLElement));
    }
  }

  walk(container);
  return specs;
}

/**
 * Primary core function to mount a skeleton over an element.
 */
export function skelly(element: HTMLElement | null, options: SkellyOptions = {}): () => void {
  if (!element) return () => {};

  const visual = options.visual || "shimmer";
  const media = options.media || "block";

  let specs: SkellySpec[] = [];

  // Determine spec to render
  if (options.spec) {
    specs = options.spec;
  } else if (options.preset && PRESETS[options.preset]) {
    specs = PRESETS[options.preset];
  } else {
    // Check cache
    const cacheKey = getElementKey(element);
    const cached = specCache.get(cacheKey);
    
    if (cached && cached.length > 0) {
      specs = cached;
    } else {
      // Measure real DOM layout
      specs = measureLayout(element, options);
      if (specs.length > 0) {
        specCache.set(cacheKey, specs);
      } else {
        // Fallback to generic preset if measurement yielded nothing
        specs = PRESETS.generic;
      }
    }
  }

  // Create skeleton overlay element
  const overlay = document.createElement("div");
  overlay.className = "skelly-overlay";
  overlay.setAttribute("role", "alert");
  overlay.setAttribute("aria-busy", "true");
  overlay.setAttribute("aria-live", "polite");

  // Keep track of elements hidden
  const originalStyleMap = new Map<HTMLElement, string>();

  // Hide children
  const children = Array.from(element.children) as HTMLElement[];
  children.forEach(child => {
    originalStyleMap.set(child, child.style.visibility);
    child.style.visibility = "hidden";
  });

  // Render specifications
  specs.forEach(item => {
    const el = document.createElement("div");
    el.className = `skelly-item skelly-${visual}`;
    
    // Style absolute positions
    el.style.left = typeof item.x === "number" ? `${item.x}px` : item.x;
    el.style.top = typeof item.y === "number" ? `${item.y}px` : item.y;
    el.style.width = typeof item.w === "number" ? `${item.w}px` : item.w;
    el.style.height = typeof item.h === "number" ? `${item.h}px` : item.h;
    
    if (item.r) el.style.borderRadius = item.r;
    if (options.radius) el.style.borderRadius = options.radius;

    // Media adjustments
    if (item.type === "image") {
      if (media === "dominant-color" && item.color) {
        el.style.background = item.color;
      } else if (media === "blurhash") {
        el.style.background = "linear-gradient(45deg, #E4E2DC, #EDEBE5)";
      }
    }

    overlay.appendChild(el);
  });

  element.classList.add("skelly-container");
  element.appendChild(overlay);

  // Return release function
  return () => {
    if (overlay.parentNode === element) {
      element.removeChild(overlay);
    }
    element.classList.remove("skelly-container");
    children.forEach(child => {
      const orig = originalStyleMap.get(child);
      if (orig !== undefined) {
        child.style.visibility = orig;
      }
    });
  };
}
