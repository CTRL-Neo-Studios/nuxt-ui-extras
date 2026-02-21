import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: true},
	modules: [
		"@nuxt/fonts",
		"@nuxt/image",
		"@nuxt/ui",
		"@nuxtjs/mdc",
		"@vueuse/nuxt",
		"motion-v/nuxt"
	],
	compatibilityDate: '2026-02-15',

	css: [
		join(currentDir, './app/assets/css/ue.css'),
	],
})
