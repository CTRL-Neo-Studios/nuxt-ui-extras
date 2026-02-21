export default defineAppConfig({
	uiExtras: {
	}
})

declare module '@nuxt/schema' {
	interface AppConfigInput {
		uiExtras?: {
		}
	}
}
