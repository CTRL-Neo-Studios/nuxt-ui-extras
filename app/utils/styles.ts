import twColors from "tailwindcss/colors";

export function getTailwindColorMap() {
	const twColorMap: Record<string, string> = {}

	for (const [name, value] of Object.entries(twColors)) {
		if (typeof value === 'string') {
			twColorMap[name] = value
			continue
		}
		if (typeof value === 'object' && value !== null) {
			for (const [shade, hex] of Object.entries(value)) {
				twColorMap[`${name}-${shade}`] = hex as string
			}
			if ('500' in value) {
				twColorMap[name] = value[500 as unknown as keyof typeof value] as string
			}
		}
	}

	return twColorMap
}
