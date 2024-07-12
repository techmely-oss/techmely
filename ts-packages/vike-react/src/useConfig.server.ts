import { useStream } from "react-streaming";
import { getPageContext } from "vike/getPageContext";
import { usePageContext } from "./usePageContext";

const configsForSeoOnly = ["head"] as const;

export default function useConfig() {
  const setOverPageContext = (config: ConfigHook) => {
    pageContext?.configHook ??= {};
    // Remove SEO configs that the client-side don't need (in order to avoid serialization errors)
    if (pageContext?.isClientSideNavigation)
      for (const configName of configsForSeoOnly) delete config[configName];
    Object.assign(pageContext._configFromHook, config);
  };

  // Vike hook
  let pageContext = getPageContext();
  if (pageContext) return setOverPageContext;

  // React component
  pageContext = usePageContext();
  const stream = useStream();
  return (config: ConfigHook) => {
    if (!pageContext._headAlreadySet) {
      setOverPageContext(config);
    } else {
      // <head> already sent to the browser => send DOM-manipulating scripts during HTML streaming
      sideEffect(config, stream);
    }
  };
}

type Stream = ReturnType<typeof useStream>;
function sideEffect(config: ConfigHook, stream?: Stream) {
  if (!stream) return;

  const { head } = config;
  if (head?.title) {
    const htmlSnippet = `<script>document.title = ${JSON.stringify(head.title)}</script>`;
    stream.injectToStream(htmlSnippet);
  }
}
