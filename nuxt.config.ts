// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
				devtools: {enabled: true},
				modules: [
				 "@nuxt/fonts",
				 "@nuxt/image",
				 "@nuxt/ui",
				 "@nuxtjs/mdc"
				],
				css: ["./app/assets/css/ue.css"],
				compatibilityDate: '2026-02-15'
})