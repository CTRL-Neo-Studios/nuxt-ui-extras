<script setup lang="ts">
const content = ref('# Click me to edit\nanything\nanytime\nany place')
const tempContent = ref('# Click me to edit\nanything\nanytime\nany place')
</script>

<template>
	<DashboardContentPanel title="FocusEditable">
		<UContainer>
			<DashboardContentPage
				title="UeFocusEditable"
				description="The FocusEditable component inspired by Reka UI's Editable component."
				sourceUrl="/components/Ue/FocusEditable.vue"
			>
				<UeFocusEditable @submit="() => content = tempContent">
					<template #default>
						<MDC :value="content"/>
					</template>
					<template #editing="{ submit, cancel }">
						<div>
							<UTextarea v-model="tempContent" class="w-full h-full"/>
							<div class="space-x-2 mt-2">
								<UButton label="Submit" @click="submit"/>
								<UButton label="Cancel" variant="outline" color="neutral" @click="cancel"/>
							</div>
						</div>
					</template>
				</UeFocusEditable>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
