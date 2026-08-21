"use client";

import React, { useRef, useEffect } from "react";
import {
  skelly,
  compileItemProps,
  resolveStaticSpec,
  specExtent,
  SkellyOptions
} from "./index";

export interface SkellyProps extends SkellyOptions {
  /** Defaults to `true` so `<Skelly />` works as a standalone Suspense/route fallback. */
  loading?: boolean;
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
  // routeAuto resolves against a client-only global, so it can never be server rendered.
  const staticSpec = loading && !routeAuto ? resolveStaticSpec(options, hasContent) : null;
  const isStatic = staticSpec !== null;

  useEffect(() => {
    if (!loading || isStatic || !containerRef.current) return;

    const release = skelly(containerRef.current, withRouteSpec(JSON.parse(optionsKey), routeAuto));
    return () => release();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, optionsKey, routeAuto, isStatic]);

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
