<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from "vue";

export type LoadingDotsDirection = "ltr" | "rtl";

interface LoadingDotsProps {
	/** @default 3 */
	count?: number;
	/** @default 4 */
	size?: number;
	/** @default 1800 */
	duration?: number;
	/** @default 0.4 */
	sweepRatio?: number;
	/** @default 200 */
	fadeInDuration?: number;
	/** @default 500 */
	fadeOutDuration?: number;
	/** @default 'ltr' */
	direction?: LoadingDotsDirection;
	/** @default 3 */
	gap?: number;
	/** @default 'neutral' */
	color?: string;
	/** @default undefined */
	hexColor?: string;
	/** @default 0.2 */
	minOpacity?: number;
	/**
	 * Scale multiplier for the dot when its energy peaks.
	 * @default 1.25
	 */
	activeScale?: number;
	/** @default '50%' */
	radius?: string;
	/** @default 'span' */
	as?: string;
}

// import { useUeColorMapping } from '#imports'
const $cm = useUeColorMapping();

const props = withDefaults(defineProps<LoadingDotsProps>(), {
	count: 3,
	size: 4,
	duration: 1800,
	sweepRatio: 0.4,
	fadeInDuration: 200,
	fadeOutDuration: 500,
	direction: "ltr",
	gap: 3,
	color: "neutral",
	hexColor: undefined,
	minOpacity: 0.2,
	activeScale: 1.25,
	radius: "50%",
	as: "span",
});

const dotRefs = useTemplateRef<HTMLElement[]>("dotRef");

const resolvedColor = computed(() => {
	if (props.hexColor) return props.hexColor;
	return $cm.resolveColorVariantKeywordToCssVariable(props.color);
});

// Curves needed to calculate the organic E(t) energy state
function easeOutQuad(t: number): number {
	return 1 - (1 - t) * (1 - t);
}

function easeInQuad(t: number): number {
	return t * t;
}

let rafId: number | null = null;

onMounted(() => {
	const dots = dotRefs.value;
	if (!dots || dots.length === 0) return;

	const fireTimes = new Float64Array(dots.length);
	fireTimes.fill(-Infinity);

	let cycleStart = -1;

	const animate = (timestamp: number) => {
		const count = dots.length;
		const dur = props.duration;
		const sweepDuration = dur * props.sweepRatio;

		if (cycleStart < 0) cycleStart = timestamp;

		const cycleElapsed = (timestamp - cycleStart) % dur;

		if (timestamp - cycleStart >= dur) {
			cycleStart += Math.floor((timestamp - cycleStart) / dur) * dur;
		}

		// Fire dots sequentially
		if (cycleElapsed <= sweepDuration) {
			const interval = sweepDuration / count;
			for (let i = 0; i < count; i++) {
				const idx = props.direction === "rtl" ? count - 1 - i : i;
				const fireAt = i * interval;
				if (cycleElapsed >= fireAt && (fireTimes[idx] || 0) < cycleStart) {
					fireTimes[idx] = timestamp;
				}
			}
		}

		const opacityRange = 1 - props.minOpacity;
		const scaleRange = props.activeScale - 1;

		for (let i = 0; i < count; i++) {
			const elapsed = timestamp - (fireTimes[i] || 0);

			// The core "Energy" logic you envisioned bounding 0.0 to 1.0
			let energyRatio = 0;

			if (elapsed >= 0 && (fireTimes[i] || 0) >= 0) {
				if (elapsed < props.fadeInDuration) {
					// Ramping up to 1.0 energy natively
					const t = elapsed / props.fadeInDuration;
					energyRatio = easeOutQuad(t);
				} else if (elapsed < props.fadeInDuration + props.fadeOutDuration) {
					// Dropping back down to 0.0 energy natively
					const t = (elapsed - props.fadeInDuration) / props.fadeOutDuration;
					energyRatio = 1 - easeInQuad(t);
				}
			}

			// Apply strictly locked properties derived exclusively from energy state E(t)
			const currentOpacity = props.minOpacity + opacityRange * energyRatio;
			const currentScale = 1 + scaleRange * energyRatio;

			// Directly writing to inline styles avoids component reactivity overhead
			// and handles layout repaints natively on the GPU
			if (!!dots[i]) {
				dots[i].style.opacity = `${currentOpacity}`;
				dots[i].style.transform = `scale(${currentScale})`;
			}
		}

		rafId = requestAnimationFrame(animate);
	};

	rafId = requestAnimationFrame(animate);

	onUnmounted(() => {
		if (rafId !== null) cancelAnimationFrame(rafId);
	});
});
</script>

<template>
	<component
		:is="as"
		class="loading-dots transition"
		data-loading-dots
		:style="{
			'--ld-size': `${size}px`,
			'--ld-gap': `${gap}px`,
			'--ld-color': resolvedColor,
			'--ld-radius': radius,
		}"
	>
		<span v-for="i in count" :key="i" ref="dotRef" class="loading-dots__dot" />
	</component>
</template>

<style scoped>
.loading-dots {
	display: inline-flex;
	align-items: center;
	gap: var(--ld-gap);
}

.loading-dots__dot {
	width: var(--ld-size);
	height: var(--ld-size);
	border-radius: var(--ld-radius);
	background-color: var(--ld-color);
	transform-origin: center;
	/* Ensures the browser puts the scales and opacities on the GPU compost layer */
	will-change: opacity, transform;
}
</style>
