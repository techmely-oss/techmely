# @techmely/reset-css

The customize reset css with the minimal config work for every modern browsers.

## How to use

Here is some example using in our projects

### Nuxtjs

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  css: ['@techmely/reset-css'],
  // Or
  // css: ['@techmely/reset-css/minify']
})
```

### Nextjs

```ts
// In _app.tsx
import '@techmely/reset-css'
```


### Vite App

```ts
// in main.ts
import '@techmely/reset-css'
```
