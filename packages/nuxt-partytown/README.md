# Nuxt partytown

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@techmely/nuxt-partytown?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Lightweight - Just only import partytown lib
- Integrate with Partytown easy on Nuxt 3! Just need to focus on configs partytown

## Quick Setup

1. Add `@techmely/nuxt-partytown` dependency to your project

```bash
# Using pnpm
pnpm add -D @techmely/nuxt-partytown

# Using yarn
yarn add --dev @techmely/nuxt-partytown

# Using npm
npm install --save-dev @techmely/nuxt-partytown
```

2. Add `@techmely/nuxt-partytown` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: [
    '@techmely/nuxt-partytown'
  ]
})
```

3. Define your partytown config in nuxt config
Example: Google Tag Manager for GA4

```ts
export default defineNuxtConfig({
  modules: [
    '@techmely/nuxt-partytown'
  ],
  partytown: {
    forward: ['gtag'],

    resolveUrl: (url) => {
      const host = 'http://localhost:3000'
      /**
       * Do this will copy partytown assets to public/partytown
       * Remember add trailing slash in first and last place
       */
      lib: "/partytown/",
      // We need this to resolve some case need to reverse proxy to server local --> https://partytown. builder.io/proxying-requests
      // For example: Google Analytics
      const resolveHostMap = {
        'www.google-analytics.com': `${host}/folder_in_public/analytics.js`, // You need to download analytics.js file in your proxy folder, usually is public folder
      }
      const proxyUrl = resolveHostMap[url.host]
      if (!proxyUrl) return url

      return new URL(proxyUrl)
    },
  }
})
```

You can inject the GTM script in the head config, on the `nuxt.config.ts` or `layout pages`.

🌟 I prefer config in `layout pages` for the scalability

```ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          key: 'GTM',
          async: true,
          innerHTML: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
          type: 'text/partytown',
        },
        {
          key: 'GTAG-CONFIG',
          innerHTML: `
          ((w) => {
            w.dataLayer = w.dataLayer || [];
            w.gtag = function(){w.dataLayer.push(arguments);};
            w.gtag('js', new Date());
            w.gtag('config', '${GA_MEASUREMENT_ID}');
            })(window);
          `,
          type: 'text/partytown',
        },
      ],
      noscript: [
        {
          tagPosition: 'bodyOpen',
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        },
      ],
    },
  },
})

```

```vue
// Example: /layouts/default.vue

<script setup lang="ts">
  useServerHead({
    script: [
        {
        key: 'GTAG-CONFIG',
        innerHTML: `
        ((w) => {
          w.dataLayer = w.dataLayer || [];
          w.gtag = function(){w.dataLayer.push(arguments);};
          w.gtag('js', new Date());
          w.gtag('config', '${GA_MEASUREMENT_ID}');
          })(window);
        `,
        type: 'text/partytown',
      },
      {
        key: 'GTM',
        innerHTML: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
        type: 'text/partytown',
      },
      ],
    noscript: [
      {
        tagPosition: 'bodyOpen',
        innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0"width="0" style="display:none;visibility:hidden"></iframe>`,
      },
    ],
  })
</script>
```


## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Copy public/partytown from this folder --> Playground
mkdir -p modules/nuxt-partytown/playground/public/partytown
cp -R modules/nuxt-partytown/public/partytown modules/nuxt-partytown/playground/public/partytown

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@techmely/nuxt-partytown/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@techmely/nuxt-partytown

[npm-downloads-src]: https://img.shields.io/npm/dm/@techmely/nuxt-partytown.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@techmely/nuxt-partytown

[license-src]: https://img.shields.io/npm/l/@techmely/nuxt-partytown.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@techmely/nuxt-partytown

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
****
