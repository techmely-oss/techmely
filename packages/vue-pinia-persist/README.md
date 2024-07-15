# Vue Pinia Persist

Persist and rehydrate pinia store

## Features

- Persist Pinia stores with a friendly API inspired by [Redux Persist](https://github.com/rt2zz/redux-persist)
- You can custom storage, serializer, paths picking and more...
- Support Transform/Migration like Redux Persist does
- Lightweight + Performances for most cases
- Tiny package (<2kB gzip)
- SSR friendly
## Quick Start

1. Install package
   ```bash
   npm i @techmely/vue-pinia-persist
   ```

   ```bash
   pnpm add @techmely/vue-pinia-persist
   ```

   ```bash
   yarn add @techmely/vue-pinia-persist
   ```
2. Add the plugin to pinia

   ```ts
    import { createPinia } from 'pinia'
    import { piniaPersist } from '@techmely/vue-pinia-persist'

    const pinia = createPinia()
    pinia.use(piniaPersist())
   ```

3. Enjoy

## Configuration


## Limitations

## Contribute

## License

MIT License

Copyright (c) 2023-present, Techmely <https://github.com/techmely>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
