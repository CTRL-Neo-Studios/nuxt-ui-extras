<script setup lang="ts">
</script>

<template>
	<DashboardContentPanel title="LoadingDots">
		<UContainer>
			<DashboardContentPage
				title="UeLoadingDots"
				description="The LoadingDots component inspired by Vercel's Geist Design System."
				sourceUrl="/components/Ue/LoadingDots.vue"
			>
				<div class="flex flex-col gap-10">
					<!-- Basic (Geist-identical 3-dot) -->
					<UeLoadingDots />

					<!-- Larger, 5-dot, right-to-left wave -->
					<UeLoadingDots :count="5" :size="8" :gap="6" direction="rtl" :duration="1200" />

					<!-- Themed with Nuxt UI color tokens -->
					<UeLoadingDots color="primary" :min-opacity="0.15" />

					<!-- Inside a button -->
					<UButton disabled>
						Submitting <UeLoadingDots :size="3" :gap="2" :duration="800" class="ml-1" />
					</UButton>

					<!-- Slow, dramatic 7-dot loader -->
					<UeLoadingDots
						:count="7"
						:size="6"
						:gap="4"
						:duration="2000"
						:min-opacity="0.05"
						hexColor="#10b981"
						radius="2px"
					/>
				</div>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
