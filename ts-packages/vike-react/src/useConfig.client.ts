import { getPageContext } from "vike/getPageContext";
import { usePageContext } from "./usePageContext";

export default function useConfig() {
  const setOverPageContext = (config: ConfigHook) => {
    pageContext?.configHook ??= {} as ConfigHook;
    Object.assign(pageContext?.configHook, config);
  };

  // Vike hook
  let pageContext = getPageContext();
  if (pageContext) return setOverPageContext;

  // React component
  pageContext = usePageContext();
  return (config: ConfigHook) => {
    if (!("_headAlreadySet" in pageContext)) {
      setOverPageContext(config);
    } else {
      sideEffect(config);
    }
  };
}

function sideEffect(config: ConfigHook) {
  if (config.head?.title) {
    window.document.title = config.head?.title;
  }
}
