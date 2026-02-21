export default defineNuxtConfig({
	extends: [['..', { install: true }]],
	modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/fonts'],
	css: ["~/assets/css/main.css"]
})
