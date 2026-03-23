<script setup lang="ts">
import type { NavigationMenuItem, ButtonProps } from "@nuxt/ui";

const links = [
	{
		label: "Installation",
		icon: "i-lucide-house",
		to: "/",
	},
	{
		label: "Components",
		icon: "i-lucide-blocks",
		defaultOpen: true,
		children: [
			{
				label: "UeBook",
				to: "/components/book",
			},
			{
				label: "UeFocusEditable",
				to: "/components/focus-editable",
			},
			{
				label: "UeLoadingDots",
				to: "/components/loading-dots",
			},
			{
				label: "UeAuroraBackground",
				to: "/components/aurora-background",
			},
			{
				label: "UeSvgPattern",
				to: "/components/svg-pattern",
			},
			{
				label: "UeProgressiveBlur",
				to: "/components/progressive-blur",
			},
			{
				label: "UeBlurGradient",
				to: "/components/blur-gradient",
			},
			{
				label: "Ue3dCard",
				to: "/components/3d-card",
			},
		],
	},
	{
		label: "Animations",
		icon: "i-lucide-shell",
		defaultOpen: true,
		children: [
			{
				label: "UeAnimFadeIn",
				to: "/components/anim/fade-in",
			},
			{
				label: "UeAnimFadeOut",
				to: "/components/anim/fade-out",
			},
			{
				label: "UeAnimBlurIn",
				to: "/components/anim/blur-in",
			},
			{
				label: "UeAnimBlurOut",
				to: "/components/anim/blur-out",
			},
			{
				label: "UeAnimObfuscatedText",
				to: "/components/anim/obfuscated-text",
			},
		],
	},
] satisfies NavigationMenuItem[];
</script>

<template>
	<UDashboardGroup unit="rem">
		<UDashboardSidebar id="default" class="bg-elevated/25">
			<template #header>
				<div>nuxt-ui-extras</div>
			</template>
			<template #default>
				<UNavigationMenu tooltip popover :items="links" orientation="vertical" />
			</template>
		</UDashboardSidebar>
		<slot />
	</UDashboardGroup>
</template>

<style scoped></style>
