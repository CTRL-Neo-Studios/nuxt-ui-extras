export default defineNuxtConfig({
	modules: ['@nuxt/ui', '../src/module', '@nuxt/image', '@nuxt/fonts', '@vueuse/nuxt'],
	devtools: { enabled: true },
	compatibilityDate: 'latest',
	css: ['~/assets/css/main.css'],
	uiExtras: {},
})
