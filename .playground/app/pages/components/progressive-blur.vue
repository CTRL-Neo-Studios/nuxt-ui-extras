<script setup lang="ts">
</script>

<template>
	<DashboardContentPanel title="UeProgressiveBlur">
		<UContainer>
			<DashboardContentPage
				title="UeProgressiveBlur"
				description="The UeProgressiveBlur component from Inspira UI: https://inspira-ui.com/docs/en/components/special-effects/progressive-blur"
				sourceUrl="/components/Ue/ProgressiveBlur.vue"
			>
				<div class="w-full h-full relative rounded-lg">
					<NuxtImg src="https://picsum.photos/2560/1440" alt="Progressive Blur Image" class="w-full h-full"/>
					<UeProgressiveBlur
						class="absolute bottom-0 left-0 w-full h-[50%]"
						direction="bottom"
						:blurIntensity="10"
						:blurLayers="2"
					/>
					<div class="absolute bottom-0 left-0 right-0 p-2">
						<ProseH2>The Galleria</ProseH2>
					</div>
				</div>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
