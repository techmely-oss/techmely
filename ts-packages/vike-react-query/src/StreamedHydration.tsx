import {
  type DehydratedState,
  type QueryClient,
  dehydrate,
  hydrate,
} from "@tanstack/react-query";
import { uneval } from "devalue";
import React, { type ReactNode } from "react";
import { useStream } from "react-streaming";

declare global {
  interface Window {
    __reactQueryDehydrated__?:
      | { push: (entry: DehydratedState) => void }
      | DehydratedState[];
    __reactQueryClear__?: () => void;
  }
}

function StreamedHydration({
  children,
  client,
}: {
  client: QueryClient;
  children: ReactNode;
}) {
  const stream = useStream();
  const isSSR = !!stream;

  if (isSSR) {
    stream.injectToStream(`
      <script class="__reactQueryDehydrated__">
        __reactQueryDehydrated__=[];
        __reactQueryClear__ = () => {
          Array.from(document
            .getElementsByClassName("__reactQueryDehydrated__"))
            .forEach(e => e.remove())
        };
        __reactQueryClear__();
      </script>
    `);
    client.getQueryCache().subscribe((event) => {
      const isSuccessStatus = event.query.state.status === "success";
      const isAddAndUpdated = ["added", "updated"].includes(event.type);
      if (isAddAndUpdated && isSuccessStatus) {
        stream.injectToStream(`
        <script class="__reactQueryDehydrated__">
          __reactQueryDehydrated__.push(${uneval(
            dehydrate(client, {
              shouldDehydrateQuery(query) {
                return query.queryHash === event.query.queryHash;
              },
            }),
          )})
        </script>
        `);
      }
    });
  }

  if (!isSSR && Array.isArray(window.__reactQueryDehydrated__)) {
    const handleEntry = (entry: DehydratedState) => {
      hydrate(client, entry);
    };

    for (const entry of window.__reactQueryDehydrated__ as DehydratedState[]) {
      handleEntry(entry);
    }

    window.__reactQueryDehydrated__ = { push: handleEntry };
  }
  return children as JSX.Element;
}

export default StreamedHydration;
