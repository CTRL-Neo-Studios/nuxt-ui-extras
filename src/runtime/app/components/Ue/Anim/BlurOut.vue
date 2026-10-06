<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion } from "motion-v";
import type { ElementType } from "motion-v";

interface BlurOutProps {
	/**
	 * Animation duration in milliseconds
	 * @default 700
	 */
	duration?: number;
	/**
	 * Max blur radius in pixels
	 * @default 8
	 */
	amount?: number;
	/**
	 * Delay before animation starts (ms)
	 * @default 0
	 */
	delay?: number;
	/**
	 * CSS easing array or string
	 * @default [0.16, 1, 0.3, 1]
	 */
	easing?: number[] | string;
	/**
	 * IntersectionObserver threshold (0-1).
	 * @default 0.1
	 */
	threshold?: number;
	/**
	 * Replay when re-entering viewport, or only once.
	 * @default false
	 */
	once?: boolean;
	/**
	 * HTML tag to render as the wrapper element
	 * @default 'div'
	 */
	as?: ElementType;
	/**
	 * Programmatically force the blur-out triggering mechanism.
	 * - `true`: Forces element to blur out (bypasses scroll)
	 * - `false`: Forces element to stay visible/clear (bypasses scroll)
	 * - `undefined`: Relies on standard scroll interaction (`while-in-view`)
	 * @default undefined
	 */
	forceTrigger?: boolean;
}

const props = withDefaults(defineProps<BlurOutProps>(), {
	duration: 700,
	amount: 8,
	delay: 0,
	easing: () => [0.16, 1, 0.3, 1],
	threshold: 0.1,
	once: false,
	as: "div",
	forceTrigger: undefined,
});

const initialParams = computed(() => ({
	opacity: 1,
	filter: "blur(0px)",
}));

const outParams = computed(() => ({
	opacity: 0,
	filter: `blur(${props.amount}px)`,
}));

const transitionParams = computed(() => ({
	duration: props.duration / 1000,
	delay: props.delay / 1000,
	ease: props.easing,
}));

// --- Programmatic Control ---
const manualTrigger = ref<boolean | null>(null);

const isTriggered = computed(() => {
	if (props.forceTrigger !== undefined) return props.forceTrigger;
	return manualTrigger.value;
});

const currentAnimate = computed(() => {
	// If triggered programmatically, send them to the outParams
	if (isTriggered.value === true) return outParams.value;
	if (isTriggered.value === false) return initialParams.value;
	return undefined;
});

const currentWhileInView = computed(() => {
	// Shut off `while-in-view` if active to prevent stutter/overwrite
	if (isTriggered.value !== null) return undefined;
	return outParams.value;
});

/** Expose programmatic constraints for refs */
defineExpose({
	/** Triggers the blur out sequence */
	play: () => {
		manualTrigger.value = true;
	},
	/** Resets back to full clarity/visibility */
	reset: () => {
		manualTrigger.value = false;
	},
	/** Returns behavior control back to the scroll observer */
	auto: () => {
		manualTrigger.value = null;
	},
	/** Current triggered state */
	isTriggered,
});
</script>

<template>
	<Motion
		:as="as"
		:initial="initialParams"
		:animate="currentAnimate"
		:while-in-view="currentWhileInView"
		:in-view-options="{ once: props.once, amount: props.threshold }"
		:transition="transitionParams"
	>
		<slot />
	</Motion>
</template>
