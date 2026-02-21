import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: true},
	modules: [
		"@nuxt/fonts",
		"@nuxt/image",
		"@nuxt/ui",
		"@nuxtjs/mdc"
	],
	compatibilityDate: '2026-02-15',
})
