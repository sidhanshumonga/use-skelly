"use client";

import React, { useRef, useEffect } from "react";
import { skelly, SkellyOptions } from "./index";

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

  useEffect(() => {
    if (!loading || !containerRef.current) return;

    const release = skelly(containerRef.current, withRouteSpec(JSON.parse(optionsKey), routeAuto));
    return () => release();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, optionsKey, routeAuto]);

  return (
    <div
      ref={containerRef}
      style={style}
      className={className}
      data-skelly-container
    >
      {children}
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
