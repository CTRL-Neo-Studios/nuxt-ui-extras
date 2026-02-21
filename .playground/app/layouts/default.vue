<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const links = [{
	label: 'Installation',
	icon: 'i-lucide-house',
	to: '/',
}, {
	label: 'Components',
	icon: 'i-lucide-blocks',
	defaultOpen: true,
	children: [{
		label: 'Book',
		to: '/components/book'
	}, {
		label: 'FocusEditable',
		to: '/components/focus-editable'
	}]
}] satisfies NavigationMenuItem[]

</script>

<template>
	<UDashboardGroup unit="rem">
		<UDashboardSidebar
			id="default"
			class="bg-elevated/25"
		>
			<template #header>
				<div>nuxt-ui-extras</div>
			</template>
			<template #default>
				<UNavigationMenu
					tooltip
					popover
					:items="links"
					orientation="vertical"
				/>
			</template>
		</UDashboardSidebar>

		<slot/>
	</UDashboardGroup>
</template>

<style scoped>

</style>
