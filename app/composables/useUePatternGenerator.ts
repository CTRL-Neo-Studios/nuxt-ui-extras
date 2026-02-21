/**
 * String-seed-based deterministic random SVG wireframe pattern generator.
 * Produces unique, reproducible minimalistic line-art SVG paths from any string seed.
 */

interface PatternOptions {
	/** SVG viewBox width */
	width?: number
	/** SVG viewBox height */
	height?: number
	/** Number of line elements to generate */
	complexity?: number
	/** Base stroke width */
	strokeWidth?: number
	/** Whether to include circles */
	circles?: boolean
	/** Whether to include arcs */
	arcs?: boolean
	/** Grid snapping resolution (0 = no snap) */
	gridSnap?: number
}

interface PatternElement {
	type: 'line' | 'polyline' | 'circle' | 'arc' | 'bezier'
	d: string          // SVG path data or element attributes
	delay: number      // animation stagger delay
}

interface GeneratedPattern {
	elements: PatternElement[]
	viewBox: string
	width: number
	height: number
	seed: string
}

/**
 * Attempt 32-bit FNV-1a hash from a string seed.
 * Fast, well-distributed, deterministic.
 */
function fnv1a(str: string): number {
	let hash = 0x811c9dc5
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i)
		hash = Math.imul(hash, 0x01000193)
	}
	return hash >>> 0
}

/**
 * Mulberry32 — a fast, high-quality 32-bit seeded PRNG.
 * Returns a function that yields [0, 1) on each call.
 */
function mulberry32(seed: number): () => number {
	let state = seed | 0
	return () => {
		state = (state + 0x6d2b79f5) | 0
		let t = Math.imul(state ^ (state >>> 15), 1 | state)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export function useUePatternGenerator(seed: MaybeRef<string>, options: MaybeRef<PatternOptions> = {}) {
	const seedVal = toRef(seed)
	const optsVal = toRef(options)

	const pattern = computed<GeneratedPattern>(() => {
		const opts: Required<PatternOptions> = {
			width: 400,
			height: 400,
			complexity: 12,
			strokeWidth: 1.5,
			circles: true,
			arcs: true,
			gridSnap: 0,
			...toValue(optsVal),
		}

		const hash = fnv1a(toValue(seedVal))
		const rand = mulberry32(hash)

		// helpers
		const r = (min: number, max: number) => min + rand() * (max - min)
		const ri = (min: number, max: number) => Math.floor(r(min, max))
		const snap = (v: number) =>
			opts.gridSnap > 0 ? Math.round(v / opts.gridSnap) * opts.gridSnap : v

		const px = () => snap(r(0, opts.width))
		const py = () => snap(r(0, opts.height))

		const elements: PatternElement[] = []
		let delay = 0
		const stagger = 0.08

		for (let i = 0; i < opts.complexity; i++) {
			const roll = rand()

			if (roll < 0.25) {
				// Straight line
				const x1 = px(), y1 = py(), x2 = px(), y2 = py()
				elements.push({
					type: 'line',
					d: `M${x1},${y1} L${x2},${y2}`,
					delay,
				})
			} else if (roll < 0.45) {
				// Polyline (3-5 points)
				const count = ri(3, 6)
				let d = `M${px()},${py()}`
				for (let j = 1; j < count; j++) d += ` L${px()},${py()}`
				elements.push({ type: 'polyline', d, delay })
			} else if (roll < 0.6 && opts.circles) {
				// Circle (encoded as arc path for stroke animation)
				const cx = px(), cy = py()
				const radius = snap(r(8, Math.min(opts.width, opts.height) * 0.18))
				// Full circle as two arcs
				const d = [
					`M${cx - radius},${cy}`,
					`A${radius},${radius} 0 1,1 ${cx + radius},${cy}`,
					`A${radius},${radius} 0 1,1 ${cx - radius},${cy}`,
				].join(' ')
				elements.push({ type: 'circle', d, delay })
			} else if (roll < 0.78 && opts.arcs) {
				// Quadratic bezier
				const x1 = px(), y1 = py()
				const cpx = px(), cpy = py()
				const x2 = px(), y2 = py()
				elements.push({
					type: 'bezier',
					d: `M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}`,
					delay,
				})
			} else {
				// Cubic bezier for organic curves
				const x1 = px(), y1 = py()
				const cp1x = px(), cp1y = py()
				const cp2x = px(), cp2y = py()
				const x2 = px(), y2 = py()
				elements.push({
					type: 'arc',
					d: `M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`,
					delay,
				})
			}

			delay += stagger
		}

		return {
			elements,
			viewBox: `0 0 ${opts.width} ${opts.height}`,
			width: opts.width,
			height: opts.height,
			seed: toValue(seedVal),
		}
	})

	return {
		pattern,
	}
}

export type { PatternOptions, PatternElement, GeneratedPattern }
