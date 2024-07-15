type AuthStore = {
  accessToken?: string;
  refreshToken?: string;
};
const key = "auth";

export const useAuthStore = defineStore<typeof key, AuthStore>(key, {
  state: () => ({ accessToken: undefined, refreshToken: undefined }),
});
