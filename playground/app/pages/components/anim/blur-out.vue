<script setup lang="ts">
const items = [
	{
		title: "item-1",
		id: 1,
	},
	{
		title: "item-2",
		id: 2,
	},
	{
		title: "item-3",
		id: 3,
	},
];
</script>

<template>
	<DashboardContentPanel title="AnimBlurOut">
		<UContainer>
			<DashboardContentPage
				title="UeAnimBlurOut"
				description="The AnimBlurOut Transition Animation component."
				sourceUrl="/components/Ue/Anim/BlurOut.vue"
			>
				<UeAnimBlurOut>
					<p>I blur out when scrolled into view</p>
				</UeAnimBlurOut>

				<!-- Fade in from the left, slower, with a delay -->
				<UeAnimBlurOut :duration="800" :delay="200" :offset="40">
					<UCard>
						<p>Blur out</p>
					</UCard>
				</UeAnimBlurOut>

				<!-- Staggered list items (great for listings!) -->
				<UeAnimBlurOut v-for="(item, i) in items" :key="item.id" :delay="i * 100" once>
					<UCard>{{ item.title }}</UCard>
				</UeAnimBlurOut>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped></style>
