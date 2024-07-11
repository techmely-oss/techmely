import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type FC, type PropsWithChildren, useState } from "react";
import type { PageContext } from "vike/types";
import StreamedHydration from "./StreamedHydration";

type Props = {
  pageContext: PageContext;
};

const ReactQueryProvider: FC<PropsWithChildren<Props>> = ({
  pageContext,
  children,
}) => {
  const [queryClient] = useState(
    () => new QueryClient(pageContext.config.queryClientConfig),
  );
  const FallbackErrorBoundary =
    (pageContext.config.FallbackErrorBoundary as any) || PlaceholderFC;

  return (
    <QueryClientProvider client={queryClient}>
      <FallbackErrorBoundary>
        <StreamedHydration client={queryClient}>{children}</StreamedHydration>
      </FallbackErrorBoundary>
    </QueryClientProvider>
  );
};

function PlaceholderFC({ children }) {
  return <>{children}</>;
}

export default ReactQueryProvider;
