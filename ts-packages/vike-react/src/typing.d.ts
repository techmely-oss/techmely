import type { EntityId, StringEnum } from "@techmely/types";
import type { FC, PropsWithChildren, ReactNode } from "react";
import type { PageContext } from "vike/types";

type PageProps = Record<string, any>;

declare global {
  type RenderMode = "SPA" | "SSR" | "HTML";
  type FcWithPageContext = FC<PropsWithChildren<{ pageContext: PageContext; [key: string]: any }>>;

  namespace VikePackages {
    interface ConfigVikeReact {
      Layout?: FC<PropsWithChildren<any>>;
      Page?: FC<PropsWithChildren<any>>;
      ReactQueryProvider?: FcWithPageContext;
      /**
       * Some wrapper you want to add something like Provider, Init function or something
       */
      AppWrapper?: FcWithPageContext;
      Head?: HeadMetadata;
      pageProps?: Record<string, any>;
      metadata?: Record<StringEnum<"userAgent" | "isMobile" | "locale" | "dataHeadHtml">, any>;
      /**
       * <html lang="${locale}">
       * @default 'en'
       * **/
      locale: StringEnum<"vi" | "en" | "cn">;
      initStoreState: Record<string, Record<EntityId, any>>;
      /**
       * @default "SSR"
       */
      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean;
      _streamIsRequired?: boolean;
      data?: Record<string, any>;
      isr?: boolean | { expiration: number };
      abortReason?: string | { notAdmin: true };
      /**
       * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
       * page's HTML will be rendered at build-time or request-time.
       * If false, render mode is SPA. In other words, the page will only be
       * rendered in the browser.
       *
       * See https://vike.dev/render-modes
       * @default true
       */
      ssr?: boolean;
      renderMode?: RenderMode;
      // https://github.com/vikejs/vike-react/pull/96
      onAfterRenderClient?: (pageContext: PageContextClient) => void;
    }
  }

  namespace Vike {
    interface PageContext {
      Head?: HeadMetadata;
      Layout?: FC<PropsWithChildren<any>>;
      Page?: FC<PropsWithChildren<any>>;
      pageProps?: Record<string, any>;
      data?: Record<StringEnum<"title">, any>;
      /**
       * @default "SSR"
       */
      renderMode?: RenderMode;
      isr?: boolean | { expiration: number };
      abortReason?: string | { notAdmin: true };
      metadata?: Record<StringEnum<"userAgent" | "isMobile" | "locale" | "dataHeadHtml">, any>;
      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean;
      /**
       * <html lang="${locale}">
       * @default 'en'
       * **/
      locale: StringEnum<"vi" | "en" | "cn">;
      initStoreState: Record<string, Record<EntityId, any>>;
    }
  }
  interface Window {
    __vike?: Record<string, Record<string, unknown>>;
  }

  type HeadMetaAuthor = {
    name: string;
    url: string;
  };

  type HeadMetaRobots = {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    nocache?: boolean;
    notranslate?: boolean;
    indexifembedded?: boolean;
    nositelinkssearchbox?: boolean;
    unavailable_after?: string;
    "max-video-preview"?: number | string;
    "max-image-preview"?: "none" | "standard" | "large";
    "max-snippet"?: number;
    googleBot?: string | HeadMetaRobots;
  };

  interface HeadMetadata {
    title?: string;
    description?: string;
    thumbnail?: string;
    /**
     * The robots setting for the document.
     *
     * @see https://developer.mozilla.org/docs/Glossary/Robots.txt
     * @example
     *
     * { index: false, follow: false }
     * <meta name="robots" content="noindex, nofollow" />
     * ```
     */
    robots?: HeadMetaRobots;
    /**
     * @example
     * { canonical: "https://example.com" }
     * <link rel="canonical" href="https://example.com" />
     */
    canonical?: string;
    /**
     * <meta name="application-name" content="Techmely" />
     */
    applicationName?: string;
    /**
     * @example * <meta name="author" content="Techmely Team" />
     * <link rel="author" href="https://techmely.com/about-us" />
     */
    authors?: HeadMetaAuthor | HeadMetaAuthor[];
    /**
     * @example * <meta name="generator" content="VikeJs" />
     */
    generator?: string;
    /**
     * @example <meta name="keywords" content="education, documents, blog, courses" />
     * ```
     */
    keywords?: string | string[];
    /**
     * @example <meta name="creator" content="Techmely Team" />
     */
    creator?: string;
    /**
     * <meta name="publisher" content="Cloudflare" />
     * ```
     */
    publisher?: string;
    /**
     * The category meta name property.
     * @example
     * "Education"
     * <meta name="category" content="Education" />
     */
    category?: string;
    /**
     * The additional JSON LD
     * @example
     * <script type="application/ld+json">
        {"@context": "http://schema.org"}
       </script>
     */
    jsonLd?: string;
  }
}
