import { skelly as coreSkelly, SkellyOptions } from "./index";

export interface SvelteSkellyParams extends SkellyOptions {
  loading: boolean;
}

/**
 * Svelte Action: use:skelly={ { loading: isLoading, visual: 'shimmer' } }
 */
export function skelly(node: HTMLElement, params: SvelteSkellyParams) {
  let releaseFn: (() => void) | null = null;

  function update(newParams: SvelteSkellyParams) {
    if (releaseFn) {
      releaseFn();
      releaseFn = null;
    }
    if (newParams.loading) {
      const { loading, ...options } = newParams;
      releaseFn = coreSkelly(node, options);
    }
  }

  update(params);

  return {
    update,
    destroy() {
      if (releaseFn) {
        releaseFn();
      }
    }
  };
}

/**
 * A render-compatible class representation of a Svelte component for systems
 * compiling Svelte modules via pure TS.
 */
export class SkellyComponent {
  $$: any;
  constructor(options: any) {
    const { target, props } = options;
    const node = document.createElement("div");
    node.className = "skelly-svelte-container";
    
    let releaseFn: (() => void) | null = null;
    
    const update = (loading: boolean) => {
      if (releaseFn) releaseFn();
      if (loading) {
        releaseFn = coreSkelly(node, props);
      }
    };

    update(props.loading);
    target.appendChild(node);
  }
}
export const Skelly = SkellyComponent;
