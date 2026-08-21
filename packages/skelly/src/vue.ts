import { defineComponent, h, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { skelly, SkellyOptions, SkellySpec, PRESET_NAMES } from "./index";

const VISUALS = ["shimmer", "pulse", "optimistic", "static"];

interface ResolvedBinding {
  loading: boolean;
  options: SkellyOptions;
}

/**
 * Accepts `v-skelly="isLoading"` or `v-skelly="{ loading, visual, preset }"`, and maps
 * modifiers onto real options — `v-skelly.pulse` means `visual: "pulse"`, not `{ pulse: true }`.
 */
function resolveBinding(binding: any): ResolvedBinding {
  const value = binding.value;
  let loading = false;
  let options: SkellyOptions = {};

  if (typeof value === "boolean") {
    loading = value;
  } else if (value && typeof value === "object") {
    const { loading: isLoading, ...rest } = value;
    loading = !!isLoading;
    options = { ...rest };
  }

  const modifiers = binding.modifiers || {};
  Object.keys(modifiers).forEach(key => {
    if (!modifiers[key]) return;
    if (VISUALS.indexOf(key) !== -1) {
      options.visual = key as SkellyOptions["visual"];
    } else if (PRESET_NAMES.indexOf(key) !== -1) {
      options.preset = key as SkellyOptions["preset"];
    }
  });

  return { loading, options };
}

function releaseFor(el: HTMLElement) {
  const release = (el as any)._skellyRelease;
  if (release) {
    release();
    (el as any)._skellyRelease = null;
  }
}

function applyBinding(el: HTMLElement, binding: any) {
  const { loading, options } = resolveBinding(binding);
  const signature = JSON.stringify({ loading, options });

  if ((el as any)._skellySignature === signature) return;
  (el as any)._skellySignature = signature;

  releaseFor(el);
  if (loading) {
    (el as any)._skellyRelease = skelly(el, options);
  }
}

/**
 * Vue directive for Skelly: v-skelly="isLoading"
 */
export const vSkelly = {
  mounted(el: HTMLElement, binding: any) {
    applyBinding(el, binding);
  },
  updated(el: HTMLElement, binding: any) {
    applyBinding(el, binding);
  },
  beforeUnmount(el: HTMLElement) {
    releaseFor(el);
    (el as any)._skellySignature = undefined;
  },
  unmounted(el: HTMLElement) {
    releaseFor(el);
    (el as any)._skellySignature = undefined;
  }
};

/**
 * Vue wrapper component for Skelly.
 */
export const Skelly = defineComponent({
  name: "Skelly",
  props: {
    loading: { type: Boolean, default: true },
    visual: { type: String, default: "shimmer" },
    rows: { type: Number },
    media: { type: String, default: "block" },
    preset: { type: String },
    radius: { type: String },
    spec: { type: Array as () => SkellySpec[] }
  },
  setup(props, { slots }) {
    const rootRef = ref<HTMLElement | null>(null);
    let releaseFn: (() => void) | null = null;

    const applySkelly = () => {
      if (releaseFn) {
        releaseFn();
        releaseFn = null;
      }
      if (props.loading && rootRef.value) {
        releaseFn = skelly(rootRef.value, {
          visual: props.visual as any,
          rows: props.rows,
          media: props.media as any,
          preset: props.preset as any,
          radius: props.radius,
          spec: props.spec
        });
      }
    };

    onMounted(applySkelly);
    onBeforeUnmount(() => {
      if (releaseFn) releaseFn();
      releaseFn = null;
    });

    watch(
      () => [props.loading, props.visual, props.rows, props.media, props.preset, props.radius, props.spec],
      applySkelly
    );

    return () => h("div", { ref: rootRef, class: "skelly-vue-container" }, slots.default?.());
  }
});
