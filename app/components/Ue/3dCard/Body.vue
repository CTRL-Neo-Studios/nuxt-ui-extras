<script setup lang="ts">
/**
 * Heavy Disclaimer: I DO NOT OWN THIS COMPONENT. THE ORIGINAL IS FROM https://inspira-ui.com/docs/en/components/cards/3d-card
 * ALL CREDITS GO TO INSPIRA UI FOR THIS COMPONENT.
 */

interface Props {
	class?: string;
}

const props = defineProps<Props>();
</script>

<template>
	<div
		class="h-96 w-96"
		:class="[props.class]"
		style="transform-style: preserve-3d"
	>
		<slot />
	</div>
</template>

