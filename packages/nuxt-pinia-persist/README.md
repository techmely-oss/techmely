# Nuxt partytown

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@techmely/nuxt-pinia-persist?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Lightweight - Just only import partytown lib
- Integrate with Partytown easy on Nuxt 3! Just need to focus on configs partytown

## Quick Setup

1. Add `@techmely/nuxt-pinia-persist` dependency to your project

```bash
# Using pnpm
pnpm add -D @techmely/nuxt-pinia-persist

# Using yarn
yarn add --dev @techmely/nuxt-pinia-persist

# Using npm
npm install --save-dev @techmely/nuxt-pinia-persist
```

2. Add `@techmely/nuxt-pinia-persist` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: [
    '@techmely/nuxt-pinia-persist'
  ]
})
```

3. Enjoy

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Copy public/partytown from this folder --> Playground
mkdir -p modules/nuxt-pinia-persist/playground/public/partytown
cp -R modules/nuxt-pinia-persist/public/partytown modules/nuxt-pinia-persist/playground/public/partytown

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
[npm-version-src]: https://img.shields.io/npm/v/@techmely/nuxt-pinia-persist/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@techmely/nuxt-pinia-persist

[npm-downloads-src]: https://img.shields.io/npm/dm/@techmely/nuxt-pinia-persist.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@techmely/nuxt-pinia-persist

[license-src]: https://img.shields.io/npm/l/@techmely/nuxt-pinia-persist.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@techmely/nuxt-pinia-persist

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
****
