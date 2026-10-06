export function useUeColorMapping() {
	function resolveColorVariantKeywordToCssVariable(
		token: string,
		shade: number = 500,
	): string | undefined {
		const twColorMap = getTailwindColorMap();

		if (typeof document !== "undefined") {
			const style = getComputedStyle(document.documentElement);
			const candidates = [`--color-${token}`, `--ui-${token}`, `--color-${token}-${shade}`];
			for (const varName of candidates) {
				const val = style.getPropertyValue(varName).trim();
				if (val) return val;
			}
		}

		if (twColorMap[token]) {
			return twColorMap[token];
		}

		return undefined;
	}

	return {
		resolveColorVariantKeywordToCssVariable,
	};
}
