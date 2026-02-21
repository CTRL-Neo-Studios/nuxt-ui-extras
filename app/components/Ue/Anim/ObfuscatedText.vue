<script setup lang="ts">
interface ObfuscatedTextProps {
	/**
	 * The target text to reveal.
	 * When changed, triggers a new unobfuscation sequence.
	 * @default ''
	 */
	text?: string
	/**
	 * Delay before unobfuscation begins (ms).
	 * During this time, the text is fully scrambled.
	 * @default 0
	 */
	delay?: number
	/**
	 * Duration of the unobfuscation animation (ms).
	 * Characters resolve progressively over this window.
	 * @default 1000
	 */
	duration?: number
	/**
	 * Whether to show occasional random glitches after
	 * the text has fully resolved.
	 * @default false
	 */
	glitch?: boolean
	/**
	 * Average interval between glitches (ms).
	 * Only relevant when `glitch` is true.
	 * @default 3000
	 */
	glitchInterval?: number
	/**
	 * How long a glitch lasts before the character snaps back (ms).
	 * @default 120
	 */
	glitchDuration?: number
	/**
	 * Max number of characters that glitch simultaneously.
	 * @default 1
	 */
	glitchMaxChars?: number
	/**
	 * Pool of characters used for scrambling / glitching.
	 * @default '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	 */
	errString?: string
	/**
	 * Scramble speed — how often scrambled characters re-randomize
	 * during the obfuscated phase (ms). Lower = faster flickering.
	 * @default 50
	 */
	scrambleInterval?: number
	/**
	 * Programmatic control: when false, text stays fully obfuscated
	 * regardless of delay/duration. Set to true to trigger
	 * the unobfuscation sequence.
	 * When undefined, unobfuscation starts automatically on mount
	 * (respecting `delay`).
	 * @default undefined
	 */
	reveal?: boolean
	/**
	 * Whether to auto-reveal when `text` changes.
	 * If true, changing `text` resets and re-triggers the animation.
	 * If false, changing `text` updates the target but stays
	 * obfuscated until `reveal` is set to true.
	 * @default true
	 */
	autoRevealOnChange?: boolean
	/**
	 * HTML tag to render as the wrapper element
	 * @default 'span'
	 */
	as?: string
}

const props = withDefaults(defineProps<ObfuscatedTextProps>(), {
	text: '',
	delay: 0,
	duration: 1000,
	glitch: false,
	glitchInterval: 3000,
	glitchDuration: 120,
	glitchMaxChars: 1,
	errString: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	scrambleInterval: 50,
	reveal: undefined,
	autoRevealOnChange: true,
	as: 'span',
})

const emit = defineEmits<{
	/** Fired when unobfuscation animation completes */
	(e: 'revealed'): void
	/** Fired when text becomes fully obfuscated (reset) */
	(e: 'obfuscated'): void
}>()

// Exposed methods for programmatic control
const exposed = {
	/** Manually trigger the reveal animation */
	triggerReveal,
	/** Manually reset to fully obfuscated state */
	reset,
	/** Whether the text is currently fully revealed */
	isRevealed: computed(() => state.phase === 'revealed' || state.phase === 'glitching'),
}

defineExpose(exposed)

// ─── Internal state ──────────────────────────────────────────────

const displayText = ref('')

type Phase = 'obfuscated' | 'waiting' | 'revealing' | 'revealed' | 'glitching'

const state = reactive({
	phase: 'obfuscated' as Phase,
	revealStartTime: 0,
	/** Per-character: true = resolved (show real char), false = still scrambled */
	resolved: [] as boolean[],
	/** Per-character: the current random char to show if not resolved */
	scrambled: [] as string[],
	/** Glitch overrides: index → random char (or null if not glitching) */
	glitchOverrides: new Map<number, string>(),
})

let rafId: number | null = null
let scrambleTimerId: ReturnType<typeof setInterval> | null = null
let glitchTimerId: ReturnType<typeof setTimeout> | null = null
let delayTimerId: ReturnType<typeof setTimeout> | null = null

// ─── Helpers ─────────────────────────────────────────────────────

function randomChar(): string {
	return props.errString[Math.floor(Math.random() * props.errString.length)]
}

function randomChars(length: number): string[] {
	return Array.from({ length }, () => randomChar())
}

function initScramble(text: string) {
	const len = text.length
	state.resolved = new Array(len).fill(false)
	state.scrambled = randomChars(len)
	state.glitchOverrides.clear()
	buildDisplay()
}

function buildDisplay() {
	const target = props.text
	const chars: string[] = []
	for (let i = 0; i < target.length; i++) {
		if (state.glitchOverrides.has(i)) {
			chars.push(state.glitchOverrides.get(i)!)
		} else if (state.resolved[i]) {
			// Preserve whitespace as-is
			chars.push(target[i])
		} else {
			// Keep whitespace unscrambled so layout doesn't jump
			chars.push(target[i] === ' ' ? ' ' : state.scrambled[i])
		}
	}
	displayText.value = chars.join('')
}

// ─── Scramble ticker (re-randomizes unresolved chars) ────────────

function startScrambleTicker() {
	stopScrambleTicker()
	scrambleTimerId = setInterval(() => {
		let changed = false
		for (let i = 0; i < state.scrambled.length; i++) {
			if (!state.resolved[i] && props.text[i] !== ' ') {
				state.scrambled[i] = randomChar()
				changed = true
			}
		}
		if (changed) buildDisplay()
	}, props.scrambleInterval)
}

function stopScrambleTicker() {
	if (scrambleTimerId !== null) {
		clearInterval(scrambleTimerId)
		scrambleTimerId = null
	}
}

// ─── Reveal animation ────────────────────────────────────────────

function triggerReveal() {
	cleanup()
	state.phase = 'waiting'
	initScramble(props.text)
	startScrambleTicker()

	const startDelay = props.reveal === undefined ? props.delay : 0

	delayTimerId = setTimeout(() => {
		state.phase = 'revealing'
		state.revealStartTime = performance.now()
		rafId = requestAnimationFrame(revealLoop)
	}, startDelay)
}

function revealLoop(timestamp: number) {
	const elapsed = timestamp - state.revealStartTime
	const progress = Math.min(elapsed / props.duration, 1)
	const target = props.text
	const len = target.length

	// Characters resolve left-to-right (or could be randomized).
	// Each character has a "resolve point" spread across the duration.
	// A character resolves when progress passes its threshold,
	// with a slight per-character stagger + randomness for organic feel.
	for (let i = 0; i < len; i++) {
		if (state.resolved[i]) continue
		// Base threshold: evenly spread
		const baseThreshold = len > 1 ? i / (len - 1) : 0
		// The character resolves when progress catches up
		if (progress >= baseThreshold) {
			state.resolved[i] = true
		}
	}

	buildDisplay()

	if (progress < 1) {
		rafId = requestAnimationFrame(revealLoop)
	} else {
		// Ensure all resolved
		state.resolved.fill(true)
		buildDisplay()
		stopScrambleTicker()
		state.phase = 'revealed'
		emit('revealed')

		// Start glitch phase if enabled
		if (props.glitch) {
			state.phase = 'glitching'
			scheduleGlitch()
		}
	}
}

// ─── Glitch effect ───────────────────────────────────────────────

function scheduleGlitch() {
	if (!props.glitch) return
	// Randomize the interval around the mean for organic feel
	const jitter = props.glitchInterval * (0.5 + Math.random())
	glitchTimerId = setTimeout(() => {
		if (state.phase !== 'glitching') return
		doGlitch()
	}, jitter)
}

function doGlitch() {
	const target = props.text
	if (target.length === 0) return

	// Pick random non-space indices to glitch
	const candidates = Array.from({ length: target.length }, (_, i) => i)
		.filter(i => target[i] !== ' ')

	if (candidates.length === 0) return

	const count = Math.min(
		props.glitchMaxChars,
		Math.ceil(Math.random() * props.glitchMaxChars),
		candidates.length,
	)

	// Shuffle and pick
	const shuffled = candidates.sort(() => Math.random() - 0.5)
	const indices = shuffled.slice(0, count)

	// Apply glitch
	for (const idx of indices) {
		state.glitchOverrides.set(idx, randomChar())
	}
	buildDisplay()

	// Remove glitch after glitchDuration
	setTimeout(() => {
		for (const idx of indices) {
			state.glitchOverrides.delete(idx)
		}
		buildDisplay()
		// Schedule next glitch
		scheduleGlitch()
	}, props.glitchDuration)
}

// ─── Reset ───────────────────────────────────────────────────────

function reset() {
	cleanup()
	state.phase = 'obfuscated'
	initScramble(props.text)
	startScrambleTicker()
	emit('obfuscated')
}

// ─── Cleanup ─────────────────────────────────────────────────────

function cleanup() {
	if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
	if (delayTimerId !== null) { clearTimeout(delayTimerId); delayTimerId = null }
	if (glitchTimerId !== null) { clearTimeout(glitchTimerId); glitchTimerId = null }
	stopScrambleTicker()
	state.glitchOverrides.clear()
}

// ─── Lifecycle ───────────────────────────────────────────────────

onMounted(() => {
	initScramble(props.text)

	if (props.reveal === true || props.reveal === undefined) {
		// Auto-reveal: start the sequence
		triggerReveal()
	} else {
		// Held obfuscated, start scramble ticker for the flickering effect
		startScrambleTicker()
	}
})

onUnmounted(() => {
	cleanup()
})

// Watch `reveal` prop for programmatic control
watch(() => props.reveal, (val) => {
	if (val === true) {
		triggerReveal()
	} else if (val === false) {
		reset()
	}
})

// Watch `text` for content changes
watch(() => props.text, (newText, oldText) => {
	if (newText === oldText) return
	if (props.autoRevealOnChange) {
		triggerReveal()
	} else {
		// Update target but stay obfuscated
		cleanup()
		state.phase = 'obfuscated'
		initScramble(newText)
		startScrambleTicker()
	}
})
</script>

<template>
	<component :is="as" class="obfuscated-text" data-obfuscated-text>{{ displayText }}</component>
</template>

<style scoped>
.obfuscated-text {
	white-space: pre-wrap;
}
</style>
