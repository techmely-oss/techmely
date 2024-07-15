<template>
  <header>
    Header
  </header>
  <main>
    <slot />
  </main>
  <footer>
    Footer
  </footer>
</template>

<script setup lang="ts">
import { useServerHead } from "@unhead/vue";
import { useRuntimeConfig } from "nuxt/app";
const runtimeConfig = useRuntimeConfig();

useServerHead({
  script: [
    {
      key: "GTM-CONFIG",
      innerHTML: `
        ((w) => {
          w.dataLayer = w.dataLayer || [];
          w.gtag = function(){w.dataLayer.push(arguments);};
          w.gtag('js', new Date());
          w.gtag('config', '${runtimeConfig.public.gaMeasurementId}');
          })(window);
        `,
      type: "text/partytown",
    },
    {
      key: "GTM",
      innerHTML: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${runtimeConfig.public.gtmID}');
        `,
      type: "text/partytown",
    },
  ],
  noscript: [
    {
      tagPosition: "bodyOpen",
      innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${runtimeConfig.public.gtmID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
    },
  ],
});
</script>