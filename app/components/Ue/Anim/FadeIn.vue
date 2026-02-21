<script setup lang="ts">
export type FadeOrientation = 'ltr' | 'rtl' | 'ttb' | 'btt' | 'none'

interface FadeInProps {
	/**
	 * Animation duration in milliseconds
	 * @default 500
	 */
	duration?: number
	/**
	 * Slide-in direction
	 * - ltr: left to right
	 * - rtl: right to left
	 * - ttb: top to bottom
	 * - btt: bottom to top
	 * - none: fade only, no slide
	 * @default 'btt'
	 */
	orientation?: FadeOrientation
	/**
	 * Slide distance in pixels
	 * @default 24
	 */
	offset?: number
	/**
	 * Delay before animation starts (ms)
	 * @default 0
	 */
	delay?: number
	/**
	 * CSS easing function
	 * @default 'cubic-bezier(0.16, 1, 0.3, 1)'
	 */
	easing?: string
	/**
	 * IntersectionObserver threshold (0-1).
	 * Fraction of the element that must be visible to trigger.
	 * @default 0.1
	 */
	threshold?: number
	/**
	 * Whether the animation should replay every time the element
	 * re-enters the viewport, or only once.
	 * @default false
	 */
	once?: boolean
	/**
	 * HTML tag to render as the wrapper element
	 * @default 'div'
	 */
	as?: string
}

const props = withDefaults(defineProps<FadeInProps>(), {
	duration: 500,
	orientation: 'btt',
	offset: 24,
	delay: 0,
	easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
	threshold: 0.1,
	once: false,
	as: 'div',
})

const el = useTemplateRef<HTMLElement>('fadeInRef')
const isVisible = ref(false)

const translateFrom = computed(() => {
	switch (props.orientation) {
		case 'ltr': return `translateX(-${props.offset}px)`
		case 'rtl': return `translateX(${props.offset}px)`
		case 'ttb': return `translateY(-${props.offset}px)`
		case 'btt': return `translateY(${props.offset}px)`
		case 'none': return 'translate(0, 0)'
		default: return `translateY(${props.offset}px)`
	}
})

const style = computed(() => ({
	transition: `opacity ${props.duration}ms ${props.easing} ${props.delay}ms, transform ${props.duration}ms ${props.easing} ${props.delay}ms`,
	opacity: isVisible.value ? 1 : 0,
	transform: isVisible.value ? 'translate(0, 0)' : translateFrom.value,
}))

onMounted(() => {
	if (!el.value) return

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					isVisible.value = true
					if (props.once) {
						observer.unobserve(entry.target)
					}
				} else if (!props.once) {
					isVisible.value = false
				}
			}
		},
		{ threshold: props.threshold },
	)

	observer.observe(el.value)

	onUnmounted(() => {
		observer.disconnect()
	})
})
</script>

<template>
	<component :is="as" ref="fadeInRef" :style="style">
		<slot />
	</component>
</template>
