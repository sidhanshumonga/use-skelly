"use client";

import React, { useRef, useEffect, useCallback, useContext, useSyncExternalStore } from "react";
import {
  skelly,
  learnLayout,
  recallSpec,
  compileItemProps,
  resolveStaticSpec,
  specExtent,
  SkellyOptions,
  SkellySpec
} from "./index";

export interface SkellyProps extends SkellyOptions {
  /** Defaults to `true` so `<Skelly />` works as a standalone Suspense/route fallback. */
  loading?: boolean;
  /**
   * Stable identity for this layout. Give one and the skeleton learns: the real markup is
   * measured once it renders, and replayed on every later load — including before this
   * component has ever mounted, which is where a measured skeleton otherwise can't help.
   */
  name?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  routeAuto?: boolean;
}

function withRouteSpec(options: SkellyOptions, routeAuto?: boolean): SkellyOptions {
  if (!routeAuto || typeof window === "undefined") return options;

  const routeKey = window.location.pathname;
  const globalSpecs = (window as any).__skelly_specs;
  if (globalSpecs && globalSpecs[routeKey]) {
    return { ...options, spec: globalSpecs[routeKey] };
  }

  return options;
}

/**
 * React hook to hook skelly directly onto a custom ref.
 */
export function useSkelly<T extends HTMLElement = HTMLDivElement>(
  loading: boolean,
  options: SkellyOptions & { routeAuto?: boolean } = {}
) {
  const ref = useRef<T | null>(null);
  const { routeAuto, ...skellyOptions } = options;
  const optionsKey = JSON.stringify(skellyOptions);

  useEffect(() => {
    if (!loading || !ref.current) return;

    const release = skelly(ref.current, withRouteSpec(JSON.parse(optionsKey), routeAuto));
    return () => release();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, optionsKey, routeAuto]);

  return ref;
}

/**
 * Standard Skelly wrapper component for React.
 *
 * A preset, an explicit spec, or an empty container all yield a layout that needs no DOM
 * measurement — so the skeleton is rendered directly and ships in the server HTML. That
 * is what makes `<Skelly>` usable in a Next.js `loading.tsx`, where the fallback must
 * paint before any JavaScript has run. Anything that has to be measured stays on the
 * effect path, because the markup only exists on the client.
 */
export function Skelly({
  loading = true,
  children,
  style,
  className,
  routeAuto,
  ...options
}: SkellyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionsKey = JSON.stringify(options);

  const hasContent = React.Children.count(children) > 0;
  const learned = useLearnedSpec(options.name, loading && !routeAuto, options);
  const seeded = pickSeeded(useContext(SkellySpecsContext), options.name);

  // routeAuto resolves against a client-only global, so it can never be server rendered.
  const staticSpec =
    loading && !routeAuto
      ? options.spec || learned || seeded || resolveStaticSpec(options, hasContent)
      : null;
  const isStatic = staticSpec !== null;

  useEffect(() => {
    if (!loading || isStatic || !containerRef.current) return;

    const release = skelly(containerRef.current, withRouteSpec(JSON.parse(optionsKey), routeAuto));
    return () => release();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, optionsKey, routeAuto, isStatic]);

  // Once the real content is on screen, measure it and keep it. This is what makes the
  // next load — this session or next week — a skeleton of the actual layout.
  useEffect(() => {
    if (loading || !options.name || !containerRef.current) return;

    const el = containerRef.current;
    const learnOptions = JSON.parse(optionsKey);

    // Measured synchronously: layout is already committed when an effect runs, and
    // reading geometry forces it. Deferring to requestAnimationFrame would mean never
    // learning in a background tab, where frames are not scheduled at all.
    learnLayout(el, learnOptions);

    // Webfonts change text metrics after first layout, so take a second reading once
    // they settle. This promise resolves whether or not the page is visible.
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => {
        if (!cancelled && el.isConnected) learnLayout(el, learnOptions);
      });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, options.name, optionsKey]);

  const extent = staticSpec ? specExtent(staticSpec) : null;
  const flow = staticSpec !== null && !hasContent && extent !== null;

  const containerClassName = [isStatic ? "skelly-container" : null, className]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div
      ref={containerRef}
      style={style}
      className={containerClassName}
      data-skelly-container
      aria-busy={isStatic ? true : undefined}
    >
      {children}
      {staticSpec && (
        <div
          className={flow ? "skelly-overlay skelly-overlay-flow" : "skelly-overlay"}
          role="status"
          aria-live="polite"
          aria-label="Loading"
          style={
            flow
              ? ({ "--skelly-overlay-height": `${extent}px` } as React.CSSProperties)
              : undefined
          }
        >
          {staticSpec.map((item, i) => {
            const { className: itemClass, style: itemStyle } = compileItemProps(item, options);
            return (
              <div
                key={i}
                className={itemClass}
                style={itemStyle as React.CSSProperties}
                aria-hidden="true"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const SkellySpecsContext = React.createContext<Record<string, SkellySpec[]> | null>(null);

/**
 * Picks a committed layout for `name`. The server has no viewport, so it cannot choose a
 * breakpoint the way the browser does — an un-bucketed entry wins, otherwise the widest
 * bucket. Once hydrated, the client re-reads at the real viewport and corrects.
 */
function pickSeeded(
  specs: Record<string, SkellySpec[]> | null,
  name: string | undefined
): SkellySpec[] | null {
  if (!specs || !name) return null;
  if (specs[name]) return specs[name];

  let best: SkellySpec[] | null = null;
  let bestBucket = -1;
  const prefix = `${name}@`;

  Object.keys(specs).forEach(key => {
    if (key.indexOf(prefix) !== 0) return;
    const bucket = parseInt(key.slice(prefix.length), 10);
    if (!isNaN(bucket) && bucket > bestBucket) {
      bestBucket = bucket;
      best = specs[key];
    }
  });

  return best;
}

const neverChanges = () => () => {};

/**
 * A learned layout for this name, read without breaking hydration.
 *
 * Learned layouts live in browser storage, so the server cannot know them. Reading through
 * useSyncExternalStore lets the server snapshot stay empty and the client fill in right
 * after hydration — while a component mounted later, on a client-side navigation, gets the
 * layout on its very first render.
 */
function useLearnedSpec(name: string | undefined, active: boolean, options: SkellyOptions): SkellySpec[] | null {
  const getClient = useCallback(
    () => (name && active ? recallSpec(name, options) : null),
    // options is spread from props; the caller's serialized key drives invalidation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, active, JSON.stringify(options.breakpoints)]
  );

  return useSyncExternalStore(neverChanges, getClient, () => null);
}

export interface SkellySuspenseProps {
  fallback: React.ReactElement;
  children: React.ReactNode;
}

export function SkellySuspense({ fallback, children }: SkellySuspenseProps) {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
}

(Skelly as any).Suspense = SkellySuspense;

export interface SkellySpecsProps {
  /** Exported layouts, as produced by `exportLearnedSpecs()`. */
  specs: Record<string, SkellySpec[]>;
  /** Wrap the tree that uses them so the layouts are available during server rendering. */
  children?: React.ReactNode;
  nonce?: string;
}

/**
 * Supplies committed layouts to every `<Skelly name>` beneath it, and inlines the same
 * payload as `window.__skelly_specs` for the client.
 *
 * This is what gives a first-time visitor real skeletons: the layouts render on the server,
 * so they are in the HTML, and the browser adopts them until it has learned its own.
 *
 * ```tsx
 * // app/layout.tsx
 * import specs from "../skelly-specs.json";
 * <SkellySpecs specs={specs}>{children}</SkellySpecs>
 * ```
 */
export function SkellySpecs({ specs, children, nonce }: SkellySpecsProps) {
  return (
    <SkellySpecsContext.Provider value={specs}>
      <script
        nonce={nonce}
        // Serialized data, not markup. The only injection vector is a closing script tag
        // inside a string value, which is escaped below.
        dangerouslySetInnerHTML={{
          __html: `window.__skelly_specs=Object.assign(window.__skelly_specs||{},${JSON.stringify(
            specs
          ).replace(/</g, "\\u003c")});`
        }}
      />
      {children}
    </SkellySpecsContext.Provider>
  );
}
