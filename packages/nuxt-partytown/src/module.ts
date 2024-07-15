import { join } from "node:path";
import type { PartytownConfig } from "@builder.io/partytown/integration";
import { copyLibFiles } from "@builder.io/partytown/utils";
import { defineNuxtModule, useLogger } from "@nuxt/kit";
import pkg from "../package.json";

export interface ModuleOptions extends Omit<PartytownConfig, "lib"> {
  /**
   * An absolute path to the root directory which Partytown library files
   * can be found. The library path must start and end with a `/`.
   * By default the files will load from the server's `/partytown/` directory.
   * Note that the library path must be on the same origin as the html document,
   * and is also used as the `scope` of the Partytown service worker.
   * @default /partytown/
   */
  lib?: string;
  /**
   * Usually, we have development, staging, and production environment --> So the host project can be changed
   * So we need to define a environment variable to define the host of the project in specific environment
   * @default process.env.NUXT_PUBLIC_HOST
   */
  host?: string;
  /**
   * Add the unique id for the partytown config on script head
   * @default partytown-config
   */
  configId?: string;
  /**
   * The max age of the partytown assets
   * @default 60 * 60 * 24 * 7 // 7 days
   */
  cache?: number;
}
const logger = useLogger("nuxt:partytown");
const root = process.cwd();
const DEFAULT_PORT = 3000;
const DEFAULT_CACHE_ASSETS_TIME = 60 * 60 * 24 * 7; // 7 days

const PARTYTOWN_SNIPPET =
  '/* Partytown 0.8.0 - MIT builder.io */\n!function(t,e,n,i,r,o,a,d,s,c,l,p){function u(){p||(p=1,"/"==(a=(o.lib||"/~partytown/")+(o.debug?"debug/":""))[0]&&(s=e.querySelectorAll(\'script[type="text/partytown"]\'),i!=t?i.dispatchEvent(new CustomEvent("pt1",{detail:t})):(d=setTimeout(f,1e4),e.addEventListener("pt0",w),r?h(1):n.serviceWorker?n.serviceWorker.register(a+(o.swPath||"partytown-sw.js"),{scope:a}).then((function(t){t.active?h():t.installing&&t.installing.addEventListener("statechange",(function(t){"activated"==t.target.state&&h()}))}),console.error):f())))}function h(t){c=e.createElement(t?"script":"iframe"),t||(c.setAttribute("style","display:block;width:0;height:0;border:0;visibility:hidden"),c.setAttribute("aria-hidden",!0)),c.src=a+"partytown-"+(t?"atomics.js?v=0.8.0":"sandbox-sw.html?"+Date.now()),e.querySelector(o.sandboxParent||"body").appendChild(c)}function f(n,r){for(w(),i==t&&(o.forward||[]).map((function(e){delete t[e.split(".")[0]]})),n=0;n<s.length;n++)(r=e.createElement("script")).innerHTML=s[n].innerHTML,e.head.appendChild(r);c&&c.parentNode.removeChild(c)}function w(){clearTimeout(d)}o=t.partytown||{},i==t&&(o.forward||[]).map((function(e){l=t,e.split(".").map((function(e,n,i){l=l[i[n]]=n+1<i.length?"push"==i[n+1]?[]:l[i[n]]||{}:function(){(t._ptf=t._ptf||[]).push(i,arguments)}}))})),"complete"==e.readyState?u():(t.addEventListener("DOMContentLoaded",u),t.addEventListener("load",u))}(window,document,navigator,top,window.crossOriginIsolated);';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: pkg.name,
    configKey: "partytown",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  defaults: (nuxt) => ({
    debug: nuxt.options.dev,
    forward: [],
    // Add partytown to the public folder of the project --> /public/partytown
    lib: "/partytown/",
    configId: "partytown-config",
    host: process.env.NUXT_PUBLIC_HOST,
    cache: DEFAULT_CACHE_ASSETS_TIME,
  }),
  async setup(options, nuxt) {
    const port = Number(nuxt.options.devServer.port || DEFAULT_PORT);

    nuxt.options.app.head.script = nuxt.options.app.head.script || [];
    nuxt.options.app.head.script.unshift({
      id: options.configId,
      key: options.configId,
      innerHTML: generatePartytownConfig({ ...options, port }),
    });

    logger.success("Added Partytown config to head");

    // Add the partytown library directly from node_modules
    await copyLibFiles(join(root, `/public${options.lib}`));
    logger.success(`Copied Partytown library to public${options.lib}`);

    // Add cache control for partytown assets
    // TODO: I don't know why this doesn't work - Nuxt document so blind about this
    nuxt.options.nitro = nuxt.options.nitro || {};
    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
    nuxt.options.nitro.publicAssets.push({
      dir: `~/public${options.lib}`,
      baseURL: options.lib,
      maxAge: options.cache,
    });
  },
});

/**
 * Generate partytown config
 * @document https://github.com/BuilderIO/partytown/blob/main/src/integration/index.ts#L11
 * @returns
 */
function generatePartytownConfig(
  config: ModuleOptions & { port: number } = {
    port: DEFAULT_PORT,
  },
) {
  // Fallback to production host
  const { forward = [], host, port, ...filteredConfig } = config;
  const configStr = JSON.stringify(filteredConfig, (k, v) => {
    if (typeof v === "function") {
      let _v = String(v);
      const devHost = `http://localhost:${port}`;
      // Replace dev host with runtime host
      if (host && _v.includes(devHost)) {
        _v = _v.replace(devHost, host);
      }
      if (_v.startsWith(`${k}(`)) {
        _v = `function ${_v}`;
      }
    }
    return v;
  });
  return [
    "!(function(w,p,f,c){",
    Object.keys(filteredConfig).length > 0
      ? `c=w[p]=Object.assign(w[p]||{},${configStr});`
      : "c=w[p]=w[p]||{};",
    "c[f]=(c[f]||[])",
    forward.length > 0 ? `.concat(${JSON.stringify(forward)})` : "",
    `})(window,'partytown','forward');`,
    PARTYTOWN_SNIPPET,
  ].join("");
}
