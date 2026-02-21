<script setup lang="ts">
import {useRepoFilesUrl} from "~/composables/useRepoFilesUrl";

const $cfg = useRuntimeConfig()
const props = withDefaults(defineProps<{
	title?: string,
	description?: string,
	sourceUrl?: string
}>(), {})
</script>

<template>
	<UPage>
		<UPageHeader
			:title
			:description
			:links="[{
				label: 'View Source on GitHub',
				to: useRepoFilesUrl(sourceUrl),
				external: true
			}]"
		/>
		<UPageBody>
			<slot/>
		</UPageBody>
	</UPage>
</template>

<style scoped>

</style>
