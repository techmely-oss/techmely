import { useNuxtApp } from "nuxt/app";

export const usePinia = () => useNuxtApp().$pinia;
