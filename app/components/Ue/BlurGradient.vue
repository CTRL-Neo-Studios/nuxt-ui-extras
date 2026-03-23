<script setup lang="ts">
import { computed, ref } from "vue";
import { Motion } from "motion-v";

export type BlurGradientDirection = "top" | "bottom" | "left" | "right";

interface BlurGradientProps {
	/**
	 * Direction the blur fades towards (where it becomes transparent).
	 * @default 'bottom'
	 */
	direction?: BlurGradientDirection;
	/**
	 * Max base blur intensity in pixels
	 * @default 12
	 */
	blur?: number;
	/**
	 * Animation duration in milliseconds
	 * @default 800
	 */
	duration?: number;
	/**
	 * Delay before animation starts (ms)
	 * @default 0
	 */
	delay?: number;
	/**
	 * Standard easing curve
	 * @default [0.16, 1, 0.3, 1]
	 */
	easing?: number[] | string;
	/**
	 * Whether to trigger automatically when in view
	 * @default true
	 */
	autoReveal?: boolean;
	/**
	 * Enables the hover effect (changes pointer-events to auto)
	 * @default false
	 */
	hoverable?: boolean;
	/**
	 * The blur amount (in px) to transition to when hovered
	 * @default 0
	 */
	hoverBlur?: number;
	/** @default 'div' */
	as?: string;
}

const props = withDefaults(defineProps<BlurGradientProps>(), {
	direction: "bottom",
	blur: 30,
	duration: 800,
	delay: 0,
	easing: () => [0.16, 1, 0.3, 1],
	autoReveal: true,
	hoverable: false,
	hoverBlur: 0,
	as: "div",
});

const maskStyles = computed(() => {
	switch (props.direction) {
		case "bottom":
			return {
				maskImage: `linear-gradient(to bottom, black 50%, transparent 100%)`,
				maskSize: "100% 200%",
			};
		case "top":
			return {
				maskImage: `linear-gradient(to top, black 50%, transparent 100%)`,
				maskSize: "100% 200%",
			};
		case "right":
			return {
				maskImage: `linear-gradient(to right, black 50%, transparent 100%)`,
				maskSize: "200% 100%",
			};
		case "left":
			return {
				maskImage: `linear-gradient(to left, black 50%, transparent 100%)`,
				maskSize: "200% 100%",
			};
	}
});

const positions = computed(() => {
	switch (props.direction) {
		case "bottom":
			return { hidden: "0% 0%", revealed: "0% 100%" };
		case "top":
			return { hidden: "0% 100%", revealed: "0% 0%" };
		case "right":
			return { hidden: "0% 0%", revealed: "100% 0%" };
		case "left":
			return { hidden: "100% 0%", revealed: "0% 0%" };
	}
});

const baseBlur = computed(() => `blur(${props.blur}px)`);

const initialParams = computed(() => ({
	WebkitMaskPosition: positions.value.hidden,
	maskPosition: positions.value.hidden,
	backdropFilter: baseBlur.value,
	WebkitBackdropFilter: baseBlur.value,
}));

const activeParams = computed(() => ({
	WebkitMaskPosition: positions.value.revealed,
	maskPosition: positions.value.revealed,
	backdropFilter: baseBlur.value,
	WebkitBackdropFilter: baseBlur.value,
}));

const hoverParams = computed(() => {
	if (!props.hoverable) return undefined;
	const targetBlur = `blur(${props.hoverBlur}px)`;
	return {
		backdropFilter: targetBlur,
		WebkitBackdropFilter: targetBlur,
	};
});

const transitionParams = computed(() => ({
	duration: props.duration / 1000,
	delay: props.delay / 1000,
	ease: props.easing,
}));

// --- Programmatic Control ---
const manualState = ref<boolean | null>(null);

const isRevealed = computed(() => {
	if (manualState.value !== null) return manualState.value;
	return props.autoReveal ? undefined : false;
});

const currentAnimate = computed(() => {
	if (isRevealed.value === true) return activeParams.value;
	if (isRevealed.value === false) return initialParams.value;
	return undefined;
});

const currentWhileInView = computed(() => {
	if (isRevealed.value !== undefined) return undefined;
	return activeParams.value;
});

defineExpose({
	play: () => {
		manualState.value = true;
	},
	reset: () => {
		manualState.value = false;
	},
	auto: () => {
		manualState.value = null;
	},
});
</script>

<template>
	<Motion
		:as="as"
		class="blur-mask-overlay"
		:class="{ 'is-hoverable': hoverable }"
		:style="{
			'mask-image': maskStyles.maskImage,
			'-webkit-mask-image': maskStyles.maskImage,
			'mask-size': maskStyles.maskSize,
			'-webkit-mask-size': maskStyles.maskSize,
			'mask-repeat': 'no-repeat',
			'-webkit-mask-repeat': 'no-repeat',
		}"
		:initial="initialParams"
		:animate="currentAnimate"
		:while-in-view="currentWhileInView"
		:while-hover="hoverParams"
		:transition="transitionParams"
		:viewport="{ once: true, amount: 0 }"
	/>
</template>

<style scoped>
.blur-mask-overlay {
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none; /* Default: allows clicking through to underlying content */
}

/*
 * If hoverable is true, we must enable pointer events so the browser
 * can detect the mouse entering the blur region.
 */
.blur-mask-overlay.is-hoverable {
	pointer-events: auto;
}
</style>
