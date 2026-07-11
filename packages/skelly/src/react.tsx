import React, { useRef, useEffect } from "react";
import { skelly, SkellyOptions } from "./index";

export interface SkellyProps extends SkellyOptions {
  loading: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  routeAuto?: boolean;
}

/**
 * React hook to hook skelly directly onto a custom ref.
 */
export function useSkelly(loading: boolean, options: SkellyOptions & { routeAuto?: boolean } = {}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (loading && ref.current) {
      let finalOptions = { ...options };

      // Handle route auto matching
      if (options.routeAuto && typeof window !== "undefined") {
        const routeKey = window.location.pathname;
        // Check if there is an inlined build-time spec under window.__skelly_specs
        const globalSpecs = (window as any).__skelly_specs;
        if (globalSpecs && globalSpecs[routeKey]) {
          finalOptions.spec = globalSpecs[routeKey];
        }
      }

      const release = skelly(ref.current, finalOptions);
      return () => release();
    }
  }, [loading, JSON.stringify(options)]);

  return ref;
}

/**
 * Standard Skelly wrapper component for React.
 */
export function Skelly({
  loading,
  children,
  style,
  className,
  routeAuto,
  ...options
}: SkellyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading && containerRef.current) {
      let finalOptions = { ...options };

      if (routeAuto && typeof window !== "undefined") {
        const routeKey = window.location.pathname;
        const globalSpecs = (window as any).__skelly_specs;
        if (globalSpecs && globalSpecs[routeKey]) {
          finalOptions.spec = globalSpecs[routeKey];
        }
      }

      const release = skelly(containerRef.current, finalOptions);
      return () => release();
    }
  }, [loading, JSON.stringify(options), routeAuto]);

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

// React Suspense Integration
export interface SkellySuspenseProps {
  fallback: React.ReactElement;
  children: React.ReactNode;
}

export function SkellySuspense({ fallback, children }: SkellySuspenseProps) {
  // Renders the fallback when children suspends
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
}

// Attach Suspense to Skelly namespace
(Skelly as any).Suspense = SkellySuspense;
