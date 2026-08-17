<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { animate, type AnimationPlaybackControls } from "motion-v";

interface ObfuscatedTextProps {
	/** @default '' */
	text?: string;
	/** @default 0 */
	delay?: number;
	/** @default 1000 */
	duration?: number;
	/** @default false */
	glitch?: boolean;
	/** @default 3000 */
	glitchInterval?: number;
	/** @default 120 */
	glitchDuration?: number;
	/** @default 1 */
	glitchMaxChars?: number;
	/** @default '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' */
	errString?: string;
	/** @default 50 */
	scrambleInterval?: number;
	/** @default undefined */
	reveal?: boolean;
	/** @default true */
	autoRevealOnChange?: boolean;
	/** @default 'span' */
	as?: string;
}

const props = withDefaults(defineProps<ObfuscatedTextProps>(), {
	text: "",
	delay: 0,
	duration: 1000,
	glitch: false,
	glitchInterval: 3000,
	glitchDuration: 120,
	glitchMaxChars: 1,
	errString:
		"!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	scrambleInterval: 50,
	reveal: undefined,
	autoRevealOnChange: true,
	as: "span",
});

const emit = defineEmits<{
	(e: "revealed"): void;
	(e: "obfuscated"): void;
}>();

const exposed = {
	triggerReveal,
	reset,
	isRevealed: computed(() => state.phase === "revealed" || state.phase === "glitching"),
};

defineExpose(exposed);

// ─── Internal state ──────────────────────────────────────────────

const displayText = ref("");

type Phase = "obfuscated" | "waiting" | "revealing" | "revealed" | "glitching";

const state = reactive({
	phase: "obfuscated" as Phase,
	resolved: [] as boolean[],
	scrambled: [] as string[],
	glitchOverrides: new Map<number, string>(),
});

let animationControls: AnimationPlaybackControls | null = null;
let scrambleTimerId: ReturnType<typeof setInterval> | null = null;
let glitchTimerId: ReturnType<typeof setTimeout> | null = null;

// ─── Helpers ─────────────────────────────────────────────────────

function randomChar(): string {
	return props.errString[Math.floor(Math.random() * props.errString.length)]!;
}

function randomChars(length: number): string[] {
	return Array.from({ length }, () => randomChar());
}

function initScramble(text: string) {
	const len = text.length;
	state.resolved = new Array(len).fill(false);
	state.scrambled = randomChars(len);
	state.glitchOverrides.clear();
	buildDisplay();
}

function buildDisplay() {
	const target = props.text;
	const chars: string[] = [];
	for (let i = 0; i < target.length; i++) {
		if (state.glitchOverrides.has(i)) {
			chars.push(state.glitchOverrides.get(i)!);
		} else if (state.resolved[i]) {
			chars.push(target[i]!);
		} else {
			chars.push(target[i] === " " ? " " : state.scrambled[i]!);
		}
	}
	displayText.value = chars.join("");
}

// ─── Scramble ticker ─────────────────────────────────────────────

function startScrambleTicker() {
	stopScrambleTicker();
	scrambleTimerId = setInterval(() => {
		let changed = false;
		for (let i = 0; i < state.scrambled.length; i++) {
			if (!state.resolved[i] && props.text[i] !== " ") {
				state.scrambled[i] = randomChar();
				changed = true;
			}
		}
		if (changed) buildDisplay();
	}, props.scrambleInterval);
}

function stopScrambleTicker() {
	if (scrambleTimerId !== null) {
		clearInterval(scrambleTimerId);
		scrambleTimerId = null;
	}
}

// ─── Reveal animation (Using Motion-V) ───────────────────────────

function triggerReveal() {
	cleanup();
	state.phase = "waiting";
	initScramble(props.text);
	startScrambleTicker();

	const startDelay = props.reveal === undefined ? props.delay : 0;

	// Use Motion's generic animate wrapper to drive the progressive text reveal mapping
	// This ensures butter-smooth timing offloaded to Motion's update loop
	animationControls = animate(0, 1, {
		duration: props.duration / 1000, // motion-v expects seconds
		delay: startDelay / 1000,
		onPlay: () => {
			state.phase = "revealing";
		},
		onUpdate: (progress) => {
			const len = props.text.length;
			for (let i = 0; i < len; i++) {
				if (state.resolved[i]) continue;
				const baseThreshold = len > 1 ? i / (len - 1) : 0;
				if (progress >= baseThreshold) {
					state.resolved[i] = true;
				}
			}
			buildDisplay();
		},
		onComplete: () => {
			state.resolved.fill(true);
			buildDisplay();
			stopScrambleTicker();
			state.phase = "revealed";
			emit("revealed");

			if (props.glitch) {
				state.phase = "glitching";
				scheduleGlitch();
			}
		},
	});
}

// ─── Glitch effect ───────────────────────────────────────────────

function scheduleGlitch() {
	if (!props.glitch) return;
	const jitter = props.glitchInterval * (0.5 + Math.random());
	glitchTimerId = setTimeout(() => {
		if (state.phase !== "glitching") return;
		doGlitch();
	}, jitter);
}

function doGlitch() {
	const target = props.text;
	if (target.length === 0) return;

	const candidates = Array.from({ length: target.length }, (_, i) => i).filter(
		(i) => target[i] !== " ",
	);

	if (candidates.length === 0) return;

	const count = Math.min(
		props.glitchMaxChars,
		Math.ceil(Math.random() * props.glitchMaxChars),
		candidates.length,
	);

	const shuffled = candidates.sort(() => Math.random() - 0.5);
	const indices = shuffled.slice(0, count);

	for (const idx of indices) {
		state.glitchOverrides.set(idx, randomChar());
	}
	buildDisplay();

	setTimeout(() => {
		for (const idx of indices) {
			state.glitchOverrides.delete(idx);
		}
		buildDisplay();
		scheduleGlitch();
	}, props.glitchDuration);
}

// ─── Reset & Cleanup ─────────────────────────────────────────────

function reset() {
	cleanup();
	state.phase = "obfuscated";
	initScramble(props.text);
	startScrambleTicker();
	emit("obfuscated");
}

function cleanup() {
	if (animationControls) {
		animationControls.stop();
		animationControls = null;
	}
	if (glitchTimerId !== null) {
		clearTimeout(glitchTimerId);
		glitchTimerId = null;
	}
	stopScrambleTicker();
	state.glitchOverrides.clear();
}

// ─── Lifecycle ───────────────────────────────────────────────────

onMounted(() => {
	initScramble(props.text);
	if (props.reveal === true || props.reveal === undefined) triggerReveal();
	else startScrambleTicker();
});

onUnmounted(() => {
	cleanup();
});

watch(
	() => props.reveal,
	(val) => {
		if (val === true) triggerReveal();
		else if (val === false) reset();
	},
);

watch(
	() => props.text,
	(newText, oldText) => {
		if (newText === oldText) return;
		if (props.autoRevealOnChange) {
			triggerReveal();
		} else {
			cleanup();
			state.phase = "obfuscated";
			initScramble(newText);
			startScrambleTicker();
		}
	},
);
</script>

<template>
	<component :is="as" class="obfuscated-text" data-obfuscated-text>{{ displayText }}</component>
</template>

<style scoped>
.obfuscated-text {
	white-space: pre-wrap;
}
</style>
