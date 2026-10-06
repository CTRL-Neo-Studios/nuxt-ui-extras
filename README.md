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

Ships its own Tailwind theme layer (`ue.css`) and installs `motion-v/nuxt`. Requires `tailwindcss@^4`.

## Dev

```bash
bun install
bun run dev        # playground
bun run release    # build + changelog + publish
```
