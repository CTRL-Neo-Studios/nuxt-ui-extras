# @type32/nuxt-ui-extras

Extra components (`<Ue*>`), composables and a filter system on top of `@nuxt/ui`.

```bash
bun add @type32/nuxt-ui-extras
```

```ts
// nuxt.config.ts — @nuxt/ui must come first
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@type32/nuxt-ui-extras"],
})
```

Then add its styles to your app's CSS, after Tailwind and Nuxt UI, so they join your Tailwind build:

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
@import "@type32/nuxt-ui-extras/ue.css";
```

`ue.css` adds the color aliases, the `ue-anim-*` utilities, motion tokens and `tw-animate-css`, and registers the `<Ue*>` components for class scanning. It does not import Tailwind or Nuxt UI itself, so your theme (fonts, colors) stays yours. The module also installs `motion-v/nuxt`. Requires `tailwindcss@^4`.

Up to 0.1.x the module added `ue.css` on its own. That file compiled a second Tailwind and Nuxt UI build, whose default theme overrode the app's (for example, system fonts replacing the app's font once the page hydrated).

## Dev

```bash
bun install
bun run dev        # playground
bun run release    # build + changelog + publish
```
