import { defineComponent, h, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { skelly, SkellyOptions } from "./index";

/**
 * Vue directive for Skelly: v-skelly="isLoading"
 */
export const vSkelly = {
  mounted(el: HTMLElement, binding: any) {
    const loading = binding.value;
    const options: SkellyOptions = binding.modifiers || {};
    if (loading) {
      (el as any)._skellyRelease = skelly(el, options);
    }
  },
  updated(el: HTMLElement, binding: any) {
    const loading = binding.value;
    const oldLoading = binding.oldValue;
    const options: SkellyOptions = binding.modifiers || {};

    if (loading !== oldLoading) {
      if (loading) {
        if ((el as any)._skellyRelease) {
          (el as any)._skellyRelease();
        }
        (el as any)._skellyRelease = skelly(el, options);
      } else {
        if ((el as any)._skellyRelease) {
          (el as any)._skellyRelease();
          (el as any)._skellyRelease = null;
        }
      }
    }
  },
  beforeUnmount(el: HTMLElement) {
    if ((el as any)._skellyRelease) {
      (el as any)._skellyRelease();
      (el as any)._skellyRelease = null;
    }
  }
};

/**
 * Vue wrapper component for Skelly.
 */
export const Skelly = defineComponent({
  name: "Skelly",
  props: {
    loading: { type: Boolean, required: true },
    visual: { type: String, default: "shimmer" },
    rows: { type: Number },
    media: { type: String, default: "block" },
    preset: { type: String },
    radius: { type: String }
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
          radius: props.radius
        });
      }
    };

    onMounted(applySkelly);
    onBeforeUnmount(() => {
      if (releaseFn) releaseFn();
    });

    watch(
      () => [props.loading, props.visual, props.rows, props.media, props.preset, props.radius],
      applySkelly
    );

    return () => h("div", { ref: rootRef, class: "skelly-vue-container" }, slots.default?.());
  }
});
