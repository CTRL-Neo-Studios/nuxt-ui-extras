<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion } from "motion-v";

interface BlurInProps {
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
	as?: string;
	/**
	 * Programmatically force visibility.
	 * - `true`: Forces element to reveal (bypasses scroll)
	 * - `false`: Forces element to blur/hide (bypasses scroll)
	 * - `undefined`: Relies on standard scroll interaction (`while-in-view`)
	 * @default undefined
	 */
	show?: boolean;
}

const props = withDefaults(defineProps<BlurInProps>(), {
	duration: 700,
	amount: 8,
	delay: 0,
	easing: () => [0.16, 1, 0.3, 1],
	threshold: 0.1,
	once: false,
	as: "div",
	show: undefined,
});

const initialParams = computed(() => ({
	opacity: 0,
	filter: `blur(${props.amount}px)`,
}));

const activeParams = computed(() => ({
	opacity: 1,
	filter: "blur(0px)",
}));

const transitionParams = computed(() => ({
	duration: props.duration / 1000,
	delay: props.delay / 1000,
	ease: props.easing,
}));

// --- Programmatic Control ---
const manualState = ref<boolean | null>(null);

const isVisible = computed(() => {
	if (props.show !== undefined) return props.show;
	return manualState.value;
});

const currentAnimate = computed(() => {
	// If programmatically controlled, feed to `animate`
	if (isVisible.value === true) return activeParams.value;
	if (isVisible.value === false) return initialParams.value;
	return undefined;
});

const currentWhileInView = computed(() => {
	// If programmatically controlled, disable `while-in-view` scroll triggers
	if (isVisible.value !== null) return undefined;
	return activeParams.value;
});

/** Expose programmatic constraints for refs */
defineExpose({
	/** Forces the blur-in sequence */
	play: () => {
		manualState.value = true;
	},
	/** Forces the element back to its blurred/hidden state */
	reset: () => {
		manualState.value = false;
	},
	/** Hands visibility control back to the scroll observer */
	auto: () => {
		manualState.value = null;
	},
	/** Current computed visibility state */
	isVisible,
});
</script>

<template>
	<Motion
		:as="as"
		:initial="initialParams"
		:animate="currentAnimate"
		:while-in-view="currentWhileInView"
		:viewport="{ once: props.once, amount: props.threshold }"
		:transition="transitionParams"
	>
		<slot />
	</Motion>
</template>
