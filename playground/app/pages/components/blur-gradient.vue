<script setup lang="ts"></script>

<template>
	<DashboardContentPanel title="UeBlurGradient">
		<UContainer>
			<DashboardContentPage
				title="UeBlurGradient"
				description="The UeBlurGradient component."
				sourceUrl="/components/Ue/BlurGradient.vue"
			>
				<div class="w-full h-full relative rounded-lg">
					<NuxtImg
						src="https://picsum.photos/2560/1440"
						alt="Progressive Blur Image"
						class="w-full h-full"
					/>
					<UeBlurGradient
						class="absolute bottom-0 left-0 w-full"
						direction="top"
						hoverable
						:hoverBlur="100"
					/>
					<div class="absolute bottom-0 left-0 right-0 p-2">
						<ProseH2>The Galleria</ProseH2>
					</div>
				</div>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped></style>
