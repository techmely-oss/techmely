import { type ReactNode, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { renderToStream } from "react-streaming/server";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { AppPage } from "./utils/App";
import generateAppHead from "./utils/AppHead";
import { AppScriptBody } from "./utils/AppScriptBody";
import { getMetaHtml } from "./utils/getMetaHtml";

addEcosystemStamp();

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const appHead = dangerouslySkipEscape(
    renderToString(<StrictMode>{generateAppHead(pageContext)}</StrictMode>),
  );
  const { stream } = pageContext.config || {};
  const lang = pageContext?.metadata?.locale || pageContext?.locale || "en";
  const metaHtml = getMetaHtml(pageContext);

  let pageHtml:
    | string
    | ReturnType<typeof dangerouslySkipEscape>
    | Awaited<ReturnType<typeof renderToStream>>;

  const page = AppPage(pageContext) as ReactNode;
  if (!stream) {
    pageHtml = dangerouslySkipEscape(renderToString(page));
  } else {
    const disable = (stream as boolean) === false ? true : undefined;
    pageHtml = await renderToStream(page, {
      webStream: typeof stream === "string" ? stream === "web" : undefined,
      userAgent: pageContext.metadata?.userAgent,
      disable,
    });
  }

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="${lang}" ${metaHtml}>
      <head>${appHead}</head>
      <body>
        <div id="root">${pageHtml}${AppScriptBody}</>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  };
};
// For improving error messages of:
// - react-streaming https://github.com/brillout/react-streaming/blob/6a43dd20c27fb5d751dca41466b06ee3f4f35462/src/server/useStream.ts#L21
// - vike https://github.com/vikejs/vike/blob/96c0155380ffebd4976ab076b58e86d8eb2d603a/vike/node/runtime/html/stream/react-streaming.ts#L31
function addEcosystemStamp() {
  const g = globalThis as Record<string, unknown>;
  g._isVikeReactApp =
    /* Don't set to true so that consumers do `!!globalThis._isVikeApp` instead of `globalThis._isVikeApp === true`.
    true
    */
    // We use an object so that we can eventually, in the future, add helpful information as needed. (E.g. the vike-react version.)
    {};
}
export default onRenderHtml;
