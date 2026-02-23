<script lang="ts">
export interface UBookSlots {
	perspective?: string
	wrapper?: string
	cover?: string
	stripeTop?: string
	stripeIllustration?: string
	stripeBottom?: string
	simpleContent?: string
	simpleIllustration?: string
	title?: string
	logo?: string
	spineOverlay?: string
	textureOverlay?: string
	pages?: string
	back?: string
}
</script>

<script setup lang="ts">
/**
 * UeBook Component
 *
 * Features:
 * - Truly Fluid/Responsive sizing: Works natively with CSS Grids.
 *   Set sizes using standard Tailwind classes (e.g. `w-full`, `w-48`).
 *   Defaults to `w-[196px]` if no class is provided.
 * - Two visual variants: "stripe" (split layout) and "simple" (solid layout)
 * - Interactive 3D hover effect with realistic page depth
 */

import { computed, ref, useSlots, onMounted, watch, type CSSProperties } from 'vue'
import { defu } from 'defu'
import { twMerge } from 'tailwind-merge'
import { useAppConfig } from '#imports'

export interface UBookProps {
	title: string
	variant?: 'stripe' | 'simple'
	color?: string
	hexColor?: string
	textColor?: string
	hexTextColor?: string
	textured?: boolean
	pageThickness?: number
	cornerRadius?: number
	to?: string
	external?: boolean
	class?: any
	ui?: UBookSlots
}

// Assumes standard nuxt color mapper is available
const $cm = useUeColorMapping()

const props = withDefaults(defineProps<UBookProps>(), {
	variant: 'stripe',
	textured: false,
	pageThickness: 30,
	cornerRadius: 6,
})

const slots = useSlots()
const hasIllustration = computed(() => !!slots.illustration)

const appConfig = useAppConfig() as {
	ui?: { book?: { slots?: UBookSlots } }
}

const ui = computed<UBookSlots>(() => {
	const appConfigBook = appConfig.ui?.book?.slots ?? {}
	return defu(props.ui ?? {}, appConfigBook) as UBookSlots
})

const resolvedTokenColor = ref<string | undefined>()
const resolvedTokenTextColor = ref<string | undefined>()

function resolveToken(token: string, shade: number = 500): string | undefined {
	return $cm.resolveColorVariantKeywordToCssVariable(token, shade)
}

function syncColors() {
	resolvedTokenColor.value = props.color ? resolveToken(props.color) : undefined
	resolvedTokenTextColor.value = props.textColor ? resolveToken(props.textColor, 900) : undefined
}

onMounted(syncColors)
watch(() => [props.color, props.textColor], syncColors)

const finalColor = computed<string | undefined>(() => {
	return props.hexColor ?? resolvedTokenColor.value ?? undefined
})

const finalTextColor = computed<string | undefined>(() => {
	return props.hexTextColor ?? resolvedTokenTextColor.value ?? undefined
})

const hasColor = computed(() => !!finalColor.value)

// ---------------------------------------------------------------------------
// Styles & Classes
// ---------------------------------------------------------------------------

// Uses tailwind-merge to allow user-provided width classes (like w-full)
// to automatically overwrite the w-[196px] default!
const perspectiveClasses = computed(() => {
	return twMerge(
		'book-perspective w-[196px]',
		ui.value.perspective,
		props.class
	)
})

const perspectiveStyle = computed<CSSProperties>(() => {
	return {
		'--_page-depth': `${props.pageThickness}px`,
		'--_corner-radius': `${props.cornerRadius}px`,
	} as CSSProperties
})

const wrapperStyle = computed<CSSProperties>(() => {
	const style: Record<string, unknown> = {}
	if (finalColor.value) style['--book-color'] = finalColor.value
	if (finalTextColor.value) style['--book-text-color'] = finalTextColor.value
	return style as CSSProperties
})

function slotClass(defaults: string | string[], slotKey: keyof UBookSlots, extra?: any): string {
	const base = Array.isArray(defaults) ? defaults.filter(Boolean).join(' ') : defaults
	const override = ui.value[slotKey] ?? ''
	return [base, override, extra].filter(Boolean).join(' ')
}

const wrapperClasses = computed(() =>
	slotClass(
		[
			'book-wrapper',
			props.variant === 'stripe' ? 'is-stripe' : 'is-simple',
			hasColor.value ? 'has-color' : '',
			props.textured ? 'is-textured' : '',
			!!props.to ? 'cursor-pointer' : '',
		],
		'wrapper',
	),
)

async function toLink() {
	if (props.to)
		await navigateTo(props.to, { external: props.external })
}
</script>

<template>
	<div
		:class="perspectiveClasses"
		:style="perspectiveStyle"
		data-slot="perspective"
		@click="toLink"
	>
		<div :class="wrapperClasses" :style="wrapperStyle" data-slot="wrapper">
			<!-- FRONT COVER -->
			<div :class="slotClass('book-cover', 'cover')" data-slot="cover">
				<!-- STRIPE VARIANT -->
				<template v-if="variant === 'stripe'">
					<div :class="slotClass('book-stripe-top', 'stripeTop')" data-slot="stripe-top">
						<div
							v-if="hasIllustration"
							:class="slotClass('book-stripe-illustration', 'stripeIllustration')"
							data-slot="stripe-illustration"
						>
							<slot name="illustration" />
						</div>
					</div>
					<div :class="slotClass('book-stripe-bottom', 'stripeBottom')" data-slot="stripe-bottom">
						<span :class="slotClass('book-title', 'title')" data-slot="title">{{ title }}</span>
						<div :class="slotClass('book-logo', 'logo')" data-slot="logo">
							<slot name="logo">
								<svg height="18" viewBox="0 0 76 65" fill="currentColor" width="18" xmlns="http://www.w3.org/2000/svg">
									<path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
								</svg>
							</slot>
						</div>
					</div>
				</template>

				<!-- SIMPLE VARIANT -->
				<template v-else>
					<div
						:class="slotClass('book-simple-content', 'simpleContent')"
						data-slot="simple-content"
					>
						<span :class="slotClass('book-title', 'title')" data-slot="title">{{ title }}</span>
						<div
							:class="slotClass('book-simple-illustration', 'simpleIllustration')"
							data-slot="simple-illustration"
						>
							<slot name="illustration">
								<svg fill="none" height="56" viewBox="0 0 36 56" width="36" xmlns="http://www.w3.org/2000/svg">
									<path clip-rule="evenodd" d="M3.03113 28.0005C6.26017 23.1765 11.7592 20.0005 18 20.0005C24.2409 20.0005 29.7399 23.1765 32.9689 28.0005C29.7399 32.8244 24.2409 36.0005 18 36.0005C11.7592 36.0005 6.26017 32.8244 3.03113 28.0005Z" fill="#0070F3" fill-rule="evenodd" />
									<path clip-rule="evenodd" d="M32.9691 28.0012C34.8835 25.1411 36 21.7017 36 18.0015C36 8.06034 27.9411 0.00146484 18 0.00146484C8.05887 0.00146484 0 8.06034 0 18.0015C0 21.7017 1.11648 25.1411 3.03094 28.0012C6.25996 23.1771 11.7591 20.001 18 20.001C24.2409 20.001 29.74 23.1771 32.9691 28.0012Z" fill="#45DEC4" fill-rule="evenodd" />
									<path clip-rule="evenodd" d="M32.9692 28.0005C29.7402 32.8247 24.241 36.001 18 36.001C11.759 36.001 6.25977 32.8247 3.03077 28.0005C1.11642 30.8606 0 34.2999 0 38C0 47.9411 8.05887 56 18 56C27.9411 56 36 47.9411 36 38C36 34.2999 34.8836 30.8606 32.9692 28.0005Z" fill="#E5484D" fill-rule="evenodd" />
								</svg>
							</slot>
						</div>
					</div>
				</template>

				<!-- Spine/binding overlay -->
				<div
					:class="slotClass('book-spine-overlay', 'spineOverlay')"
					aria-hidden="true"
					data-slot="spine-overlay"
				/>

				<!-- Texture overlay -->
				<div
					v-if="textured"
					:class="slotClass('book-texture-overlay', 'textureOverlay')"
					aria-hidden="true"
					data-slot="texture-overlay"
				/>
			</div>

			<!-- PAGES -->
			<div
				:class="slotClass(['book-pages', textured ? 'is-textured' : ''], 'pages')"
				aria-hidden="true"
				data-slot="pages"
			/>

			<!-- BACK COVER -->
			<div
				:class="slotClass('book-back', 'back')"
				aria-hidden="true"
				data-slot="back"
			/>
		</div>
	</div>
</template>

<style scoped>
.book-perspective {
	--_page-depth: 24px;
	--_corner-radius: 6px;
	--_spine-width: 18px;

	/* Forces height natively based directly on the dynamically provided width */
	aspect-ratio: 1 / 1.38;

	perspective: 1200px;
	flex-shrink: 0;
	cursor: default;
}

.book-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	transform: rotateY(0deg);
	transform-origin: left center;
	transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.book-perspective:hover .book-wrapper {
	transform: rotateY(-22deg);
}

/* ── Front cover ── */
.book-cover {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	border-radius: 2px var(--_corner-radius) var(--_corner-radius) 2px;
	overflow: hidden;
	backface-visibility: hidden;
	z-index: 2;
}

.book-cover::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	pointer-events: none;
	z-index: 10;
	box-shadow:
		0 2px 4px rgba(0, 0, 0, 0.05),
		0 12px 24px rgba(0, 0, 0, 0.08),
		inset 0 -1px rgba(0, 0, 0, 0.1),
		inset 0 2px 2px rgba(255, 255, 255, 0.18),
		inset 4px 0 4px rgba(0, 0, 0, 0.12),
		inset -1px 0 1px rgba(255, 255, 255, 0.15);
}

@media (prefers-color-scheme: dark) {
	.book-cover::after {
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.12),
			0 12px 24px rgba(0, 0, 0, 0.2),
			inset 0 -1px rgba(0, 0, 0, 0.2),
			inset 0 2px 2px rgba(255, 255, 255, 0.18),
			inset 4px 0 4px rgba(0, 0, 0, 0.2),
			inset -1px 0 1px rgba(255, 255, 255, 0.15);
	}
}

.book-cover::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	pointer-events: none;
	z-index: 9;
	background: linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0.08) 0%,
		rgba(255, 255, 255, 0.01) 40%,
		transparent 70%
	);
}

@media (prefers-color-scheme: dark) {
	.book-cover::before {
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.08) 0%,
			rgba(255, 255, 255, 0.01) 40%,
			transparent 70%
		);
	}
}

.book-spine-overlay {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: var(--_spine-width);
	z-index: 5;
	pointer-events: none;
	opacity: 0.3;
	background:
		linear-gradient(
			90deg,
			#fff0 0%, #fff0 12%, #ffffff40 29.25%, #fff0 50.5%,
			#fff0 75.25%, #ffffff40 91%, #fff0 100%
		),
		linear-gradient(
			90deg,
			#00000008 0%, #0000001a 12%, #0000 30%, #00000005 50%,
			#0003 73.5%, #00000080 75.25%, #00000026 85.25%, #0000 100%
		);
}

.book-stripe-top {
	flex: 1 1 0%;
	min-height: 0;
	position: relative;
	overflow: hidden;
	background: var(--book-color, var(--ui-primary, var(--color-primary, #d97706)));
	border-radius: 2px var(--_corner-radius) 0 0;
}

.has-color .book-stripe-top {
	background: var(--book-color);
}

.book-stripe-illustration {
	position: absolute;
	inset: 0;
	overflow: hidden;
	display: flex;
	align-items: stretch;
	justify-content: stretch;
}

.book-stripe-illustration :deep(> *) {
	width: 100% !important;
	height: 100% !important;
	min-width: 0;
	min-height: 0;
	display: block !important;
	object-fit: cover;
	flex: 1 1 0%;
}

.book-stripe-bottom {
	flex: 0 0 auto;
	background: var(--ui-bg-elevated);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 10px 14px 10px calc(var(--_spine-width) + 4px);
	gap: 8px;
	min-height: 76px;
	overflow: hidden;
	border-radius: 0 0 var(--_corner-radius) 2px;
}

.book-simple-content {
	flex: 1 1 0%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding: 16px 14px 14px calc(var(--_spine-width) + 4px);
	background: var(--ui-bg-elevated);
	overflow: hidden;
	border-radius: 2px var(--_corner-radius) var(--_corner-radius) 2px;
}

.has-color.is-simple .book-simple-content {
	background: var(--book-color);
}

.book-simple-illustration {
	margin-top: auto;
	padding-top: 12px;
	flex-shrink: 0;
}

.book-title {
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 600;
	color: var(--ui-text-highlighted);
	display: block;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.has-color.is-simple .book-title {
	color: var(--book-text-color, var(--ui-text-highlighted));
}

.book-logo {
	color: var(--ui-text-muted);
	line-height: 0;
	flex-shrink: 0;
}

.book-texture-overlay {
	position: absolute;
	inset: 0;
	pointer-events: none;
	border-radius: inherit;
	z-index: 5;
	background-image:
		repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px),
		repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px),
		url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
	background-size: 3px 3px, 3px 3px, 200px 200px;
	mix-blend-mode: multiply;
	opacity: 0.8;
}

@media (prefers-color-scheme: dark) {
	.book-texture-overlay {
		background-image:
			repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.025) 1px, rgba(255,255,255,0.025) 2px),
			repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.025) 1px, rgba(255,255,255,0.025) 2px),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
		background-size: 3px 3px, 3px 3px, 200px 200px;
		mix-blend-mode: screen;
		opacity: 0.6;
	}
}

.book-pages {
	position: absolute;
	top: 4px;
	bottom: 4px;
	right: 2px;
	width: var(--_page-depth);
	transform: translateX(100%) rotateY(90deg);
	transform-origin: left center;
	z-index: 1;
	border-radius: 0;
	background: repeating-linear-gradient(to right, #e4e1dc 0px, #efece7 2px, #e4e1dc 4px);
	box-shadow: inset 0 1px 1px rgba(0,0,0,0.06), inset 0 -1px 1px rgba(0,0,0,0.06);
}

@media (prefers-color-scheme: dark) {
	.book-pages {
		background: repeating-linear-gradient(to right, #c4c0ba 0px, #d2cec8 2px, #c4c0ba 4px);
	}
}

.book-pages.is-textured {
	background: repeating-linear-gradient(to right, #d9d5cf 0px, #e8e4de 2px, #d9d5cf 4px);
}

@media (prefers-color-scheme: dark) {
	.book-pages.is-textured {
		background: repeating-linear-gradient(to right, #bbb7b1 0px, #cac6c0 2px, #bbb7b1 4px);
	}
}

.book-back {
	position: absolute;
	inset: 0;
	border-radius: 2px var(--_corner-radius) var(--_corner-radius) 2px;
	transform: translateZ(calc(var(--_page-depth) * -1));
	z-index: 0;
	background: var(--ui-bg-muted);
	box-shadow: -1px 1px 4px rgba(0,0,0,0.15), -3px 3px 10px rgba(0,0,0,0.1);
}

.has-color.is-simple .book-back {
	background: var(--book-color);
	filter: brightness(0.8);
}
</style>
