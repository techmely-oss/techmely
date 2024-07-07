import type { ReactNode } from "react";
import { type Root, createRoot, hydrateRoot } from "react-dom/client";
import type { OnRenderClientSync } from "vike/types";
import { AppPage } from "./utils/App";

let app: Root;
const onRenderClient: OnRenderClientSync = (pageContext) => {
  pageContext.config.onBeforeRenderClient?.(pageContext);

  const page = AppPage(pageContext) as ReactNode;
  const container = document.getElementById("root");
  if (!container) throw new Error("Aww - No root element - No app");
  if (container.innerHTML !== "" && pageContext.isHydration) {
    // Hydration
    app = hydrateRoot(container, page);
  } else {
    if (!app) {
      // First rendering
      app = createRoot(container);
    } else {
      // Client routing
      const title = pageContext.data?.title || pageContext.Head?.title || "Techmely";
      document.title = title;
    }

    app.render(page);
  }

  pageContext.config.onAfterRenderClient?.(pageContext);
};

export default onRenderClient;
