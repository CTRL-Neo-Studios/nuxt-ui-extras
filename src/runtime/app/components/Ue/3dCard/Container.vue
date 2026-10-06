<script setup lang="ts">
/**
 * Heavy Disclaimer: I DO NOT OWN THIS COMPONENT. THE ORIGINAL IS FROM https://inspira-ui.com/docs/en/components/cards/3d-card
 * ALL CREDITS GO TO INSPIRA UI FOR THIS COMPONENT.
 */

import { provide } from "vue";

interface Props {
	class?: string;
	containerClass?: string;
}

const props = defineProps<Props>();

const containerRef = useTemplateRef("containerRef");

const mouseState = useUeMouseState(); // Use the composable
provide("use3DCardMouseState", mouseState);

function handleMouseMove(e: MouseEvent) {
	if (!containerRef.value) return;
	const { left, top, width, height } = containerRef.value.getBoundingClientRect();
	const x = (e.clientX - left - width / 2) / 25;
	const y = (e.clientY - top - height / 2) / 25;
	containerRef.value.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
}

function handleMouseEnter() {
	mouseState.setMouseEntered(true);
}

function handleMouseLeave() {
	if (!containerRef.value) return;

	mouseState.setMouseEntered(false);
	containerRef.value.style.transform = `rotateY(0deg) rotateX(0deg)`;
}
</script>

<template>
	<div
		class="flex items-center justify-center p-2"
		:class="[props.containerClass]"
		style="perspective: 1000px"
	>
		<div
			ref="containerRef"
			class="relative flex items-center justify-center transition-all duration-200 ease-linear"
			:class="[props.class]"
			style="transform-style: preserve-3d"
			@mouseenter="handleMouseEnter"
			@mousemove="handleMouseMove"
			@mouseleave="handleMouseLeave"
		>
			<slot />
		</div>
	</div>
</template>
