<script setup lang="ts"></script>

<template>
	<DashboardContentPanel title="Ue3dCard">
		<UContainer>
			<DashboardContentPage
				title="Ue3dCard"
				description="The Ue3dCard components from Inspira UI: https://inspira-ui.com/docs/en/components/cards/3d-card"
				sourceUrl="/components/Ue/3dCard/Container.vue"
			>
				<div class="flex flex-col gap-10">
					<Ue3dCardContainer>
						<Ue3dCardBody
							class="group/card relative h-auto w-fit rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]"
						>
							<Ue3dCardItem
								class="text-xl font-bold text-neutral-600 dark:text-white"
							>
								Make things float in air
							</Ue3dCardItem>
							<Ue3dCardItem
								as="p"
								class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
							>
								Hover over this card to unleash the power of CSS perspective
							</Ue3dCardItem>
							<Ue3dCardItem class="mt-4 w-full">
								<img
									src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									height="1000"
									width="1000"
									class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
									alt="thumbnail"
								/>
							</Ue3dCardItem>
							<div class="mt-12 flex items-center justify-between">
								<Ue3dCardItem
									as="a"
									href="https://rahulv.dev"
									target="__blank"
									class="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
								>
									Visit →
								</Ue3dCardItem>
								<Ue3dCardItem
									as="button"
									class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
								>
									Get Started
								</Ue3dCardItem>
							</div>
						</Ue3dCardBody>
					</Ue3dCardContainer>
				</div>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped></style>
