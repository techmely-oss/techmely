type UserStore = {
  info?: Record<string, string>;
  isVIP?: boolean;
};
const key = "user";

export const useUserStore = defineStore(key, () => {
  const user = ref<UserStore>({
    info: undefined,
    isVIP: undefined,
  });

  return { user };
});
