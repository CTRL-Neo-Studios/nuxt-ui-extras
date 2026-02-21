<script setup lang="ts">
const props = withDefaults(defineProps<{
	title?: string,
	header?: boolean
}>(), {
	header: false
})
</script>

<template>
	<UDashboardPanel>
		<template #header v-if="header">
			<UDashboardNavbar :title/>
		</template>

		<template #body>
			<slot/>
		</template>
	</UDashboardPanel>
</template>

<style scoped>

</style>
