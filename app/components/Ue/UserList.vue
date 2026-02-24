<script setup lang="ts">
import type {AvatarProps} from "@nuxt/ui";

const props = withDefaults(defineProps<{
	data: AvatarProps[],
	class?: string
}>(), {})
</script>

<template>
	<div class="flex flex-col" :class="props.class">
		<template v-for="(user, index) in data" :key="index">
			<UUser v-bind="user"/>
		</template>
	</div>
</template>

<style scoped>

</style>
