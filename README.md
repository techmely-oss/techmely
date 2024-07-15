# Techmely Essential Packages

<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/techmely/essential-packages">
   <img src="https://i.ibb.co/3zBkRpd/LogoX300.png" alt="Logo">
  </a>

  <h3 align="center">Make your dreams come true easier with Techmely
</h3>

  <p align="center">
    The essential packages to help you start your SAAS, product in a day!.
    It's safe, performance and FREE! Start this if you can!
    <br />
    <a href="https://techmely.com"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://chat.techmely.com">Discord</a>
    ·
    <a href="https://techmely.com/essential-packages">Website</a>
    ·
    <a href="https://github.com/techmely/essential-packages/issues">Issues</a>
  </p>
</p>

<p align="center">
   <a href="https://chat.techmely.com"><img src="https://img.shields.io/badge/Discord-chat.techmely.com-%234A154B" alt="Join Techmely Discord"></a>
   <a href="https://status.techmely.com"><img height="20px" src="https://betteruptime.com/status-badges/v1/monitor/a9kf.svg" alt="Uptime"></a>
   <a href="https://github.com/techmely/essential-packages.com/stargazers"><img src="https://img.shields.io/github/stars/techmely/essential-packages" alt="Github Stars"></a>
   <a href="https://github.com/techmely/essential-packages.com/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-purple" alt="License"></a>
   <a href="https://github.com/techmely/essential-packages/pulse"><img src="https://img.shields.io/github/commit-activity/m/techmely/essential-packages" alt="Commits-per-month"></a>
   <a href="https://youtube.com/@techmely"><img src="https://img.shields.io/youtube/channel/subscribers/UCg3EWZXQK0bnbQISG50Nwfg"></a>
   <a href="https://contributor-covenant.org/version/1/4/code-of-conduct/ "><img src="https://img.shields.io/badge/Contributor%20Covenant-1.4-purple" /></a>
</p>

---

<h2 align="center">
  Opinionated collection of helpful Rust/Dart/TypeScript utils which we use on the real world applications
</h2>

<hr>

## Goals of project

- Typescript support
- Tree-shaking
- Have no dependencies as possible
- High performance(Design with modular in mind - minimal, readable and well thought out API)
- Full tested with the code coverage 100%
- Documentation

## Features

### Typescript Lib

| Project                      | Features                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------ |
| @techmely/auth               | 📦 # Techmely auth's utils solutions                                           |
| @techmely/utils              | 📦 Tree-shakable ESM Unit Test coverage 80%                                    |
| @techmely/reset-css          | The customize reset css with the minimal config work for every modern browsers |
| @techmely/vike-react         | React integration for Vike of Techmely Version                                 |
| @techmely/vike-react-query   | ReactQuery integration for Vike of Techmely Version                            |
| @techmely/cache              | Cache layer for all runtime. Memory, Zone CF, redis cache                      |
| @techmely/logger             | Logger for all runtime: Console, Axiom, Pino                                   |
| @techmely/metrics            | Metrics with axiom                                                             |
| @techmely/rate-limit         | Rate limit for all runtime: Console, Axiom                                     |
| @techmely/usage-limit        | Usage limit for all runtime: Currently only Cloudflare                         |
| @techmely/nuxt-partytown     | Integrate with Partytown easy on Nuxt 3                                        |
| @techmely/nuxt-pinia-persist | Integrate with Pinia easy on Nuxt 3                                            |
| @techmely/vue-pinia-persist  | Persist store like Redux, but for Vue                                          |


## Install to use in your project

You just need to change the `postfix` of project like `utils`, `reset-css`, `vue-partytown`...


Example:

```bash
npm i --save-dev @techmely/utils
yarn add @techmely/utils
pnpm add @techmely/utils
bun add @techmely/utils
```
## How to contributes

1. Run `yarn` to install all dependencies

2. Install VsCode Extension: Rome
3. CRUD feature and do not forget to add unit test for them
   - Remember add typing for all functions

4. Create the pull request --> Please request me for review code
5. After Techmely Team approved PR --> Merge to main --> CI/CD automation release new version

## License

MIT &copy; [TechMeLy](https://github.com/sponsors/TechMeLy)
