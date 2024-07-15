<template>
  <div>
    Nuxt module playground!
    {{  auth.accessToken }}    
    {{  user.user }}    
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth.store";
import { useUserStore } from "./stores/user.store";

const auth = useAuthStore();
const user = useUserStore();

user.user.info = {
  fullName: "string",
};

auth.accessToken = "ACCESS TOKEN";
</script>
