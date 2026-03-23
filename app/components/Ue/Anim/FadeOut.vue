<script setup lang="ts">
import { ref, computed } from "vue";
import { Motion } from "motion-v";

export type FadeOrientation = "ltr" | "rtl" | "ttb" | "btt" | "none";

interface FadeOutProps {
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
	 * Programmatically force the fade-out triggering mechanism.
	 * - `true`: Forces element to fade out (bypasses scroll)
	 * - `false`: Forces element to stay visible (bypasses scroll)
	 * - `undefined`: Relies on standard scroll interaction (`while-in-view`)
	 * @default undefined
	 */
	forceTrigger?: boolean;
}

const props = withDefaults(defineProps<FadeOutProps>(), {
	duration: 500,
	orientation: "btt",
	offset: 24,
	delay: 0,
	easing: () => [0.16, 1, 0.3, 1],
	threshold: 0.1,
	once: false,
	as: "div",
	forceTrigger: undefined,
});

const translateTo = computed(() => {
	switch (props.orientation) {
		case "ltr":
			return { x: props.offset, y: 0 };
		case "rtl":
			return { x: -props.offset, y: 0 };
		case "ttb":
			return { y: props.offset, x: 0 };
		case "btt":
			return { y: -props.offset, x: 0 };
		case "none":
			return { x: 0, y: 0 };
		default:
			return { y: -props.offset, x: 0 };
	}
});

const initialParams = computed(() => ({
	opacity: 1,
	x: 0,
	y: 0,
}));

const outParams = computed(() => ({
	opacity: 0,
	...translateTo.value,
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
	/** Triggers the fade out sequence */
	play: () => {
		manualTrigger.value = true;
	},
	/** Resets back to full visibility */
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
		:viewport="{ once: props.once, amount: props.threshold }"
		:transition="transitionParams"
	>
		<slot />
	</Motion>
</template>
