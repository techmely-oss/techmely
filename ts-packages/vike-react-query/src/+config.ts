import type { Config } from "vike/types";

const config = {
  name: "@techmely/vike-react-query",
  queryClientConfig: undefined,
  ReactQueryProvider: "import:@techmely/vike-react-query/ReactQueryProvider:default",
  FallbackErrorBoundary: "import:@techmely/vike-react-query/FallbackErrorBoundary:default",
  meta: {
    queryClientConfig: {
      env: {
        server: true,
        client: true,
      },
    },
    FallbackErrorBoundary: {
      env: {
        server: true,
        client: true,
      },
    },
  },
} as unknown as Config;

export default config;
export * from "./typing.d";
