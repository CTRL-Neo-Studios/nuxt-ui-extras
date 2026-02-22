import { readonly, ref } from "vue";

export function useUeMouseState() {
	const isMouseEntered = ref(false);

	function setMouseEntered(value: boolean) {
		isMouseEntered.value = value;
	}

	return {
		isMouseEntered: readonly(isMouseEntered),
		setMouseEntered,
	};
}

