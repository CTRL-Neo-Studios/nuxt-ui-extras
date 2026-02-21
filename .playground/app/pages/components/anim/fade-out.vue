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
	<DashboardContentPanel title="AnimFadeOut">
		<UContainer>
			<DashboardContentPage
				title="UeAnimFadeOut"
				description="The AnimFadeOut Transition Animation component."
				sourceUrl="/components/Ue/Anim/FadeOut.vue"
			>
				<UeAnimFadeOut orientation="ttb" :duration="600" once>
					<section class="hero">
						<h1>Welcome</h1>
					</section>
				</UeAnimFadeOut>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
