<script setup lang="ts">
import { useUePatternGenerator, type PatternOptions } from '#imports'
import { motion } from 'motion-v'

const props = withDefaults(defineProps<{
	/** The string seed — same seed always produces the same pattern */
	seed: string
	/** Pattern generation options */
	options?: PatternOptions
	/** Stroke color (CSS color value) */
	strokeColor?: string
	/** Whether to animate the drawing on mount */
	animate?: boolean
	/** Animation duration per element in seconds */
	duration?: number
	/** CSS class for the wrapping SVG */
	class?: string
}>(), {
	strokeColor: 'currentColor',
	animate: true,
	duration: 0.6,
})

const { pattern } = useUePatternGenerator(
	computed(() => props.seed),
	computed(() => props.options ?? {}),
)

/**
 * After mount we measure each <path>'s total length and set the
 * stroke-dasharray/dashoffset so motion-v can animate the draw-in.
 */
const pathRefs = useTemplateRefsList<SVGPathElement>()
const pathLengths = ref<number[]>([])

onMounted(() => {
	pathLengths.value = pathRefs.value.map((el) => {
		try {
			return el.getTotalLength()
		} catch {
			return 0
		}
	})
})

// Recompute lengths if the seed changes
watch(
	() => props.seed,
	async () => {
		await nextTick()
		pathLengths.value = pathRefs.value.map((el) => {
			try {
				return el.getTotalLength()
			} catch {
				return 0
			}
		})
	},
)
</script>

<template>
	<svg
		:viewBox="pattern.viewBox"
		:class="props.class"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		:stroke="strokeColor"
		:stroke-width="pattern.elements.length ? (props.options?.strokeWidth ?? 1.5) : 1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<motion.path
			v-for="(el, i) in pattern.elements"
			:key="`${pattern.seed}-${i}`"
			:ref="pathRefs.set"
			:d="el.d"
			:initial="animate && pathLengths[i]
        ? { strokeDasharray: pathLengths[i], strokeDashoffset: pathLengths[i], opacity: 0 }
        : undefined"
			:enter="animate && pathLengths[i]
        ? {
            strokeDashoffset: 0,
            opacity: 1,
            transition: {
              duration: duration * 1000,
              delay: el.delay * 1000,
              ease: 'easeOut',
            },
          }
        : undefined"
		/>
	</svg>
</template>
