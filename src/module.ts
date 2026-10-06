import {
	defineNuxtModule,
	createResolver,
	addComponentsDir,
	addImportsDir,
	hasNuxtModule,
	installModule,
} from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@type32/nuxt-ui-extras',
		configKey: 'uiExtras',
	},
	defaults: {},
	async setup(_options, nuxt) {
		const resolver = createResolver(import.meta.url)

		if (!hasNuxtModule('@nuxt/ui')) {
			throw new Error('[@type32/nuxt-ui-extras] add "@nuxt/ui" to `modules` before "@type32/nuxt-ui-extras"')
		}
		await installModule('motion-v/nuxt')

		nuxt.options.css.push(resolver.resolve('runtime/app/assets/css/ue.css'))
		nuxt.options.build.transpile.push('tailwind-merge', 'motion-v')

		addComponentsDir({
			path: resolver.resolve('runtime/app/components/Ue'),
			prefix: 'Ue',
			pathPrefix: true,
		})
		addImportsDir(resolver.resolve('runtime/app/composables'))
		addImportsDir(resolver.resolve('runtime/app/utils'))
		addImportsDir(resolver.resolve('runtime/shared/utils'))
		addImportsDir(resolver.resolve('runtime/shared/types'))

		nuxt.options.alias['#ui-extras'] = resolver.resolve('runtime')
	},
})
