<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion } from "motion-v";

export type FadeOrientation = "ltr" | "rtl" | "ttb" | "btt" | "none";

interface FadeInProps {
	/** @default 500 */
	duration?: number;
	/** @default 'btt' */
	orientation?: FadeOrientation;
	/** @default 24 */
	offset?: number;
	/** @default 0 */
	delay?: number;
	/** @default [0.16, 1, 0.3, 1] */
	easing?: number[] | string;
	/** @default 0.1 */
	threshold?: number;
	/** @default false */
	once?: boolean;
	/** @default 'div' */
	as?: string;
	/**
	 * Programmatically force visibility.
	 * - `true`: Forces element to fade in (bypasses scroll)
	 * - `false`: Forces element to hide (bypasses scroll)
	 * - `undefined`: Relies on standard scroll interaction (`while-in-view`)
	 * @default undefined
	 */
	show?: boolean;
}

const props = withDefaults(defineProps<FadeInProps>(), {
	duration: 500,
	orientation: "btt",
	offset: 24,
	delay: 0,
	easing: () => [0.16, 1, 0.3, 1],
	threshold: 0.1,
	once: false,
	as: "div",
	show: undefined,
});

const translateFrom = computed(() => {
	switch (props.orientation) {
		case "ltr":
			return { x: -props.offset, y: 0 };
		case "rtl":
			return { x: props.offset, y: 0 };
		case "ttb":
			return { y: -props.offset, x: 0 };
		case "btt":
			return { y: props.offset, x: 0 };
		case "none":
			return { x: 0, y: 0 };
		default:
			return { y: props.offset, x: 0 };
	}
});

const initialParams = computed(() => ({
	opacity: 0,
	...translateFrom.value,
}));

const activeParams = computed(() => ({
	opacity: 1,
	x: 0,
	y: 0,
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
	/** Forces the fade-in animation */
	play: () => {
		manualState.value = true;
	},
	/** Forces the element back to its hidden state */
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
