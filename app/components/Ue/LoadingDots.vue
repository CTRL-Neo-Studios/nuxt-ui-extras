<script setup lang="ts">
export type LoadingDotsDirection = 'ltr' | 'rtl'

interface LoadingDotsProps {
	/**
	 * Number of dots
	 * @default 3
	 */
	count?: number
	/**
	 * Dot size in pixels
	 * @default 4
	 */
	size?: number
	/**
	 * Full cycle duration in milliseconds
	 * (includes the sweep + the rest pause before repeating)
	 * @default 1800
	 */
	duration?: number
	/**
	 * What fraction of the cycle is the active sweep (0-1).
	 * The rest of the cycle is the pause.
	 * @default 0.4
	 */
	sweepRatio?: number
	/**
	 * How long each dot takes to ramp up to full brightness (ms).
	 * Should be shorter than fadeOutDuration for the Geist feel.
	 * @default 200
	 */
	fadeInDuration?: number
	/**
	 * How long each dot takes to fade back to dim after peaking (ms).
	 * @default 500
	 */
	fadeOutDuration?: number
	/**
	 * Direction of the sweep
	 * - ltr: dots light up left-to-right
	 * - rtl: dots light up right-to-left
	 * @default 'ltr'
	 */
	direction?: LoadingDotsDirection
	/**
	 * Gap between dots in pixels
	 * @default 3
	 */
	gap?: number
	/**
	 * Color variant keyword (e.g. 'primary', 'neutral', 'success', or any
	 * custom keyword registered in your theme). Resolved via
	 * resolveColorVariantKeywordToCssVariable().
	 * @default 'neutral'
	 */
	color?: string
	/**
	 * Raw hex color override (e.g. '#f472b6').
	 * When set, takes precedence over `color`.
	 * @default undefined
	 */
	hexColor?: string
	/**
	 * Inactive (dim) dot opacity.
	 * @default 0.2
	 */
	minOpacity?: number
	/**
	 * CSS border-radius for each dot.
	 * @default '50%'
	 */
	radius?: string
	/**
	 * HTML tag to render as the wrapper element
	 * @default 'span'
	 */
	as?: string
}

const $cm = useUeColorMapping()

const props = withDefaults(defineProps<LoadingDotsProps>(), {
	count: 3,
	size: 4,
	duration: 1800,
	sweepRatio: 0.4,
	fadeInDuration: 200,
	fadeOutDuration: 500,
	direction: 'ltr',
	gap: 3,
	color: 'neutral',
	hexColor: undefined,
	minOpacity: 0.2,
	radius: '50%',
	as: 'span',
})

const dotRefs = useTemplateRef<HTMLElement[]>('dotRef')

const resolvedColor = computed(() => {
	if (props.hexColor) return props.hexColor
	return $cm.resolveColorVariantKeywordToCssVariable(props.color)
})

/**
 * Ease-out quad — fast start, gentle deceleration.
 * Used for fade-in so the dot "catches" brightness quickly
 * but eases into its peak.
 */
function easeOutQuad(t: number): number {
	return 1 - (1 - t) * (1 - t)
}

/**
 * Ease-in quad — slow start, accelerating.
 * Used for fade-out so the dot lingers near bright
 * then falls away gently.
 */
function easeInQuad(t: number): number {
	return t * t
}

let rafId: number | null = null

onMounted(() => {
	const dots = dotRefs.value
	if (!dots || dots.length === 0) return

	/**
	 * Animation model:
	 *
	 *   |——— sweep (40%) ———|———————— pause (60%) ————————|
	 *
	 * During sweep, each dot is "fired" sequentially.
	 * After firing, each dot:
	 *   1. Fades IN over fadeInDuration (200ms) with ease-out
	 *   2. Fades OUT over fadeOutDuration (500ms) with ease-in
	 *
	 * The asymmetry (quick inhale, slow exhale) gives
	 * the breathing / organic feel.
	 *
	 * Timeline for 3 dots:
	 *   Sweep window = 720ms (40% of 1800)
	 *   Dot 0 fires at t=0ms     → peaks at 200ms → dim by 700ms
	 *   Dot 1 fires at t=240ms   → peaks at 440ms → dim by 940ms
	 *   Dot 2 fires at t=480ms   → peaks at 680ms → dim by 1180ms
	 *   Pause until t=1800ms, then repeat
	 */

	const fireTimes = new Float64Array(dots.length)
	fireTimes.fill(-Infinity)

	let cycleStart = -1

	const animate = (timestamp: number) => {
		const count = dots.length
		const dur = props.duration
		const sweepDuration = dur * props.sweepRatio

		if (cycleStart < 0) cycleStart = timestamp

		const cycleElapsed = (timestamp - cycleStart) % dur

		if (timestamp - cycleStart >= dur) {
			cycleStart += Math.floor((timestamp - cycleStart) / dur) * dur
		}

		// Fire dots during sweep phase
		if (cycleElapsed <= sweepDuration) {
			const interval = sweepDuration / count
			for (let i = 0; i < count; i++) {
				const idx = props.direction === 'rtl' ? count - 1 - i : i
				const fireAt = i * interval
				if (cycleElapsed >= fireAt && fireTimes[idx] < cycleStart) {
					fireTimes[idx] = timestamp
				}
			}
		}

		// Update opacities
		const min = props.minOpacity
		const range = 1 - min

		for (let i = 0; i < count; i++) {
			const elapsed = timestamp - fireTimes[i]

			let opacity: number
			if (elapsed < 0 || fireTimes[i] < 0) {
				opacity = min
			} else if (elapsed < props.fadeInDuration) {
				// Fade in: ease-out curve (fast catch, gentle peak)
				const t = elapsed / props.fadeInDuration
				opacity = min + range * easeOutQuad(t)
			} else {
				// Fade out: ease-in curve (lingers bright, then falls)
				const t = Math.min((elapsed - props.fadeInDuration) / props.fadeOutDuration, 1)
				opacity = 1 - range * easeInQuad(t)
			}

			dots[i].style.opacity = `${opacity}`
		}

		rafId = requestAnimationFrame(animate)
	}

	rafId = requestAnimationFrame(animate)

	onUnmounted(() => {
		if (rafId !== null) cancelAnimationFrame(rafId)
	})
})
</script>

<template>
	<component
		:is="as"
		class="loading-dots"
		data-loading-dots
		:style="{
      '--ld-size': `${size}px`,
      '--ld-gap': `${gap}px`,
      '--ld-color': resolvedColor,
      '--ld-radius': radius,
    }"
	>
    <span
		v-for="i in count"
		:key="i"
		ref="dotRef"
		class="loading-dots__dot"
	/>
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
	will-change: opacity;
}
</style>
