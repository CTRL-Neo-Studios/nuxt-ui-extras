<script setup lang="ts">

</script>

<template>
	<DashboardContentPanel title="Book">
		<UContainer>
			<UPage>
				<UPageHeader
					title="UeBook"
					description="The Book component inspired by Vercel's Geist Design System."
				/>
				<UPageBody>
					<UPageCard title="Default" variant="naked">
						<UeBook title="The user experience of the Frontend Cloud" />
					</UPageCard>
					<!-- Default -->
					<section>

					</section>

					<!-- Variants -->
					<section>
						<h2 class="text-xl font-bold mb-6">Variants</h2>
						<div class="flex flex-row items-baseline justify-start gap-8">
							<UeBook
								title="The user experience of the Frontend Cloud"
								variant="simple"
								:width="196"
							/>
							<UeBook
								title="The user experience of the Frontend Cloud"
								variant="stripe"
								:width="196"
							/>
						</div>
					</section>

					<!-- Custom Colors -->
					<section>
						<h2 class="text-xl font-bold mb-6">Custom color</h2>
						<div class="flex flex-row items-baseline justify-start gap-8">
							<UeBook
								hex-color="#9D2127"
								title="How CTRL Neo Studios improves your website's search engine ranking"
							/>
							<UeBook
								hex-color="#7DC1C1"
								title="Design Engineering at CTRL Neo Studios"
								variant="simple"
							/>
							<UeBook
								hex-color="#FED954"
								title="The user experience of the Frontend Cloud"
							/>
						</div>
					</section>

					<!-- Custom Illustration -->
					<section>
						<h2 class="text-xl font-bold mb-6">Custom illustration</h2>
						<div class="flex flex-row items-stretch justify-start gap-8">
							<UeBook title="The user experience of the Frontend Cloud">
								<template #illustration>
									<!--                        <svg-->
									<!--                            fill="none"-->
									<!--                            height="149"-->
									<!--                            viewBox="0 0 197 149"-->
									<!--                            width="197"-->
									<!--                            xmlns="http://www.w3.org/2000/svg"-->
									<!--                            class="w-full h-full object-cover"-->
									<!--                        >-->
									<!--                            <rect fill="#FED954" height="149" width="197" />-->
									<!--                            <path d="M147 48.4995H172C185.531 48.4995 196.5 59.4685 196.5 72.9995V148.427" stroke="#ECAF14" />-->
									<!--                            <path d="M0 48.5H24.5C38.031 48.5 49 37.531 49 24V0" stroke="#ECAF14" />-->
									<!--                            <path d="M147.5 48.5H172C185.531 48.5 196.5 37.531 196.5 24V0" stroke="#ECAF14" />-->
									<!--                            <path d="M0 48.5H24.5C38.031 48.5 49 59.469 49 73V98" stroke="#ECAF14" />-->
									<!--                            <path d="M146 48.5H73.5C59.969 48.5 49 37.531 49 24V0" stroke="#ECAF14" />-->
									<!--                            <path d="M196 48.5H122.5C108.969 48.5 98 37.531 98 24V0" stroke="#ECAF14" />-->
									<!--                            <path d="M97 48.5H73.5C59.969 48.5 49 59.469 49 73V99.5" stroke="#ECAF14" />-->
									<!--                            <path d="M98 132.5H122.5C136.031 132.5 147 121.531 147 108V98.9512" stroke="#ECAF14" />-->
									<!--                            <path d="M196 132.5H171.5C157.969 132.5 147 121.531 147 108V48.5" stroke="#ECAF14" />-->
									<!--                            <path d="M147 48.5H122.5C108.969 48.5 98 59.469 98 73V132" stroke="#ECAF14" />-->
									<!--                            <path d="M98 132.5H73.5C59.969 132.5 49 121.531 49 108V98.9512" stroke="#ECAF14" />-->
									<!--                        </svg>-->
									<NuxtImg class="w-full h-full object-contain" src="https://picsum.photos/400/800"/>
								</template>
							</UeBook>
							<UeBook
								title="The user experience of the Frontend Cloud"
								variant="simple"
							>
								<template #illustration>
									<div class="object-cover w-full h-full">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="40"
											height="40"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="opacity-60"
										>
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
											<circle cx="9" cy="10" r="1" fill="currentColor" />
											<circle cx="12" cy="10" r="1" fill="currentColor" />
											<circle cx="15" cy="10" r="1" fill="currentColor" />
										</svg>
									</div>
								</template>
							</UeBook>
						</div>
					</section>

					<!-- Responsive Width -->
					<section>
						<h2 class="text-xl font-bold mb-6">Responsive</h2>
						<UeBook
							title="The user experience of the Frontend Cloud And Everything And Everything And Everything And Everything"
							:width="{ sm: 150, md: 196 }"
						/>
					</section>

					<!-- Textured -->
					<section>
						<h2 class="text-xl font-bold mb-6">Textured</h2>
						<div class="flex flex-col gap-8">
							<div class="flex flex-row items-baseline justify-start gap-8">
								<UeBook hex-color="#7DC1C1" textured title="Design Engineering at CTRL Neo Studios" />
								<UeBook hex-color="#9D2127" textured title="Design Engineering at CTRL Neo Studios" />
								<UeBook color="cararra" textured title="Design Engineering at CTRL Neo Studios" to="https://ctrl-neo.dev" external>
									<template #logo>
										<UTooltip text="User 1, User 2, and others...">
											<UAvatarGroup>
												<UAvatar src="https://picsum.photos/512/512?random=1"/>
												<UAvatar src="https://picsum.photos/512/512?random=2"/>
												<UAvatar src="https://picsum.photos/512/512?random=3"/>
											</UAvatarGroup>
										</UTooltip>
									</template>
								</UeBook>
							</div>
							<div class="flex flex-row items-baseline justify-start gap-8">
								<UeBook
									hex-color="#7DC1C1"
									text-color="white"
									textured
									title="Design Engineering at CTRL Neo Studios"
									variant="simple"
								/>
								<UeBook
									hex-color="#9D2127"
									hex-text-color="#ece4db"
									textured
									title="Design Engineering at CTRL Neo Studios"
									variant="simple"
								/>
								<UeBook
									hex-color="#FED954"
									hex-text-color="#9d3b05"
									textured
									title="Design Engineering at CTRL Neo Studios"
									variant="simple"
								/>
							</div>
						</div>
					</section>
				</UPageBody>
			</UPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped>

</style>
