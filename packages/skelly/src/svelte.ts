import { skelly as coreSkelly, SkellyOptions } from "./index";

export interface SvelteSkellyParams extends SkellyOptions {
  loading: boolean;
}

/**
 * Svelte Action: use:skelly={ { loading: isLoading, visual: 'shimmer' } }
 */
export function skelly(node: HTMLElement, params: SvelteSkellyParams) {
  let releaseFn: (() => void) | null = null;
  let signature = "";

  function update(newParams: SvelteSkellyParams) {
    const nextSignature = JSON.stringify(newParams || {});
    if (nextSignature === signature) return;
    signature = nextSignature;

    if (releaseFn) {
      releaseFn();
      releaseFn = null;
    }
    if (newParams && newParams.loading) {
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
        releaseFn = null;
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
  private node: HTMLElement;
  private releaseFn: (() => void) | null = null;
  private props: any;

  constructor(options: any) {
    const { target, props = {} } = options;
    this.props = { ...props };

    this.node = document.createElement("div");
    this.node.className = "skelly-svelte-container";

    // Must be in the document before mounting: skelly measures real geometry, and a
    // detached node reports a zero-sized box for every child.
    if (target) target.appendChild(this.node);

    this.apply();
  }

  private apply() {
    if (this.releaseFn) {
      this.releaseFn();
      this.releaseFn = null;
    }
    const { loading, ...options } = this.props;
    if (loading) {
      this.releaseFn = coreSkelly(this.node, options);
    }
  }

  $set(next: any) {
    this.props = { ...this.props, ...next };
    this.apply();
  }

  $destroy() {
    if (this.releaseFn) {
      this.releaseFn();
      this.releaseFn = null;
    }
    if (this.node.parentNode) {
      this.node.parentNode.removeChild(this.node);
    }
  }
}
export const Skelly = SkellyComponent;
