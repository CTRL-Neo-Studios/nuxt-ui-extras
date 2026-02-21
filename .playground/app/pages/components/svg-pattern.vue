<script setup lang="ts">
const seed = ref('hello-world')
</script>

<template>
	<DashboardContentPanel title="SvgPattern">
		<UContainer>
			<DashboardContentPage
				title="UeSvgPattern"
				description="The UeSvgPattern component."
				sourceUrl="/components/Ue/SvgPattern.vue"
			>
				<div class="flex flex-col items-center gap-6 p-8">
					<UInput v-model="seed" placeholder="Type a seed…" class="w-64" />

					<!-- The same seed ALWAYS renders the same pattern -->
					<UeSvgPattern
						:seed="seed"
						stroke-color="var(--ui-color-neutral-900)"
						class="w-96 h-96 bg-primary"
						:options="{ complexity: 5, gridSnap: 10 }"
					/>
				</div>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
