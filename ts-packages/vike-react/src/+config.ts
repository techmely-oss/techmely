import type { Config, ConfigEnv } from "vike/types";

const isProd = process.env.NODE_ENV === "production";

const serverClient: ConfigEnv = {
  client: true,
  server: true,
};
const clientOnly: ConfigEnv = {
  client: true,
  server: false,
};
const serverOnly: ConfigEnv = {
  client: false,
  server: true,
};

const renderModeMap: Record<RenderMode, ConfigEnv> = {
  SPA: clientOnly,
  SSR: serverClient,
  HTML: serverOnly,
};

const passToClient = ["pageProps", "metadata", "initStoreState"];
if (!isProd) {
  // https://github.com/vikejs/vike-react/issues/25
  passToClient.push("$$typeof");
}

const config = {
  name: "@techmely/vike-react",
  passToClient,
  clientRouting: true,
  hydrationCanBeAborted: true,
  prefetchStaticAssets: "hover",
  onRenderHtml: "import:@techmely/vike-react/onRenderHtml:default",
  onRenderClient: "import:@techmely/vike-react/onRenderClient:default",
  meta: {
    Head: { env: serverOnly },
    Layout: { env: serverClient },
    ReactQueryProvider: { env: serverClient },
    AppWrapper: { env: serverClient },
    locale: { env: serverClient },
    isr: { env: serverOnly },
    stream: { env: serverOnly },
    ssr: {
      env: { config: true },
      effect: ({ configValue }) => {
        return {
          meta: {
            Page: {
              env: configValue ? serverClient : clientOnly,
            },
          },
        };
      },
    },
    renderMode: {
      env: { config: true },
      effect: ({ configValue }) => {
        const env = renderModeMap[configValue as RenderMode];
        if (!env) {
          throw new Error(`renderMode must be one of ${Object.keys(renderModeMap).join(", ")}`);
        }
        return { meta: { Page: { env } } };
      },
    },
    plugins: { env: serverClient },
    initStoreState: { env: serverClient },
    onAfterRenderClient: { env: clientOnly },
    onBeforeRenderClient: { env: clientOnly },
  },
  locale: "en",
  renderMode: "SSR",
  initStoreState: {},
} satisfies Config;

export default config;
export * from "./typing.d";
