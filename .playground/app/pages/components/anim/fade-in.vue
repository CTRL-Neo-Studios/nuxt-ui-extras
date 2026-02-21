<script setup lang="ts">
const items = [
	{
		title: 'item-1',
		id: 1
	},
	{
		title: 'item-2',
		id: 2
	},
	{
		title: 'item-3',
		id: 3
	}
]
</script>

<template>
	<DashboardContentPanel title="AnimFadeIn">
		<UContainer>
			<DashboardContentPage
				title="UeAnimFadeIn"
				description="The AnimFadeIn Transition Animation component."
				sourceUrl="/components/Ue/Anim/FadeIn.vue"
			>
				<UeAnimFadeIn>
					<p>I fade in from below when scrolled into view</p>
				</UeAnimFadeIn>

				<!-- Fade in from the left, slower, with a delay -->
				<UeAnimFadeIn orientation="ltr" :duration="800" :delay="200" :offset="40">
					<UCard>
						<p>Slides in from the left</p>
					</UCard>
				</UeAnimFadeIn>

				<!-- Staggered list items (great for listings!) -->
				<UeAnimFadeIn
					v-for="(item, i) in items"
					:key="item.id"
					:delay="i * 100"
					orientation="btt"
					once
				>
					<UCard>{{ item.title }}</UCard>
				</UeAnimFadeIn>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
