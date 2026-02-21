<script setup lang="ts">
const props = withDefaults(defineProps<{
	title?: string,
	description?: string,
	source?: string
}>(), {})
</script>

<template>
	<UPage>
		<UPageHeader
			:title
			:description
			:links="[{
				label: 'View Source on GitHub',

			}]"
		/>
		<UPageBody>
			<slot/>
		</UPageBody>
	</UPage>
</template>

<style scoped>

</style>
