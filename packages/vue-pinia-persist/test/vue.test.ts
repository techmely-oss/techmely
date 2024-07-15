import { createPinia, defineStore, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, nextTick, ref } from "vue";
import { piniaPersist } from "../src/index";

beforeEach(() => {
  let state: Record<string, string> = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn((key) => state[key]),
      setItem: vi.fn((key, value) => {
        state[key] = value;
      }),
      removeItem: vi.fn((key) => delete state[key]),
      clear: vi.fn(() => {
        state = {};
      }),
    },
  });
});

type AuthStore = {
  accessToken?: string;
  refreshToken?: string;
};

const keyStore = "auth" as const;
const keyStorage = "persist.auth" as const;
const authData = { accessToken: "accessToken" };
const setupAuthData = { auth: authData };

describe("Use globalConfig for piniaLocalPersistedState", () => {
  describe("Persist state in local storage", async () => {
    beforeEach(() => {
      const app = createApp({});
      const pinia = createPinia();
      pinia.use(
        piniaPersist({
          onBeforeRestore: (context) => {
            context.store.user = "Test";
          },
          onAfterRestore: (context) => {
            context.store.payment = "VISA";
          },
        }),
      );
      app.use(pinia);
      setActivePinia(pinia);
    });

    const useAuthStore = defineStore<typeof keyStore, AuthStore>(keyStore, {
      state: () => ({ accessToken: undefined, refreshToken: undefined }),
    });

    it("persists store in localStorage", async () => {
      const auth = useAuthStore();
      auth.accessToken = "accessToken";
      await nextTick();
      // @ts-expect-error - Injected onBeforeRestore
      expect(auth.user).toEqual("Test");
      // @ts-expect-error - Injected onBeforeRestore
      expect(auth.payment).toEqual("VISA");
      expect(readLocalStorage(keyStorage)).toEqual(authData);
      expect(localStorage.setItem).toHaveBeenCalledWith(keyStorage, JSON.stringify(authData));
    });

    it("hydrates store from localStorage", async () => {
      initializeLocalStorage(keyStorage, authData);
      await nextTick();
      const auth = useAuthStore();
      expect(auth.accessToken).toEqual(authData.accessToken);
      expect(localStorage.getItem).toHaveBeenCalledWith(keyStorage);
    });
  });

  describe("Use globalConfig exceptAllExcept", () => {
    beforeEach(() => {
      const app = createApp({});
      const pinia = createPinia();
      pinia.use(
        piniaPersist({
          persistAllExcept: ["user"],
        }),
      );
      app.use(pinia);
      setActivePinia(pinia);
    });

    const useAuthStore = defineStore<typeof keyStore, AuthStore>(keyStore, {
      state: () => ({ accessToken: undefined, refreshToken: undefined }),
    });
    const useUserStore = defineStore("user", () => {
      const user = ref("Test");
      return { user };
    });

    it("persists store in localStorage", async () => {
      const auth = useAuthStore();
      const user = useUserStore();
      user.user = "UPDATED";
      auth.accessToken = "accessToken";
      await nextTick();
      expect(readLocalStorage(keyStorage)).toEqual(authData);
      expect(localStorage.setItem).toHaveBeenCalledWith(keyStorage, JSON.stringify(authData));
      expect(user.user).toEqual("UPDATED");
      expect(readLocalStorage("user")).toEqual({});
    });
  });

  describe("Use globalConfig exceptAllExcept + paths", () => {
    beforeEach(() => {
      const app = createApp({});
      const pinia = createPinia();
      pinia.use(
        piniaPersist({
          persistAllExcept: ["user"],
          paths: ["auth.refreshToken"],
        }),
      );
      app.use(pinia);
      setActivePinia(pinia);
    });

    const useAuthStore = defineStore<typeof keyStore, { auth: AuthStore }>(keyStore, {
      state: () => ({ auth: { accessToken: undefined, refreshToken: undefined } }),
    });
    const useUserStore = defineStore("user", () => {
      const user = ref("Test");
      return { user };
    });

    it("persists store in localStorage", async () => {
      const { auth } = useAuthStore();
      const user = useUserStore();
      user.user = "UPDATED";
      auth.accessToken = "accessToken";
      auth.refreshToken = "refreshToken";
      await nextTick();
      expect(readLocalStorage(keyStorage)).toStrictEqual({
        auth: { refreshToken: "refreshToken" },
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(
        keyStorage,
        JSON.stringify({ auth: { refreshToken: "refreshToken" } }),
      );
      expect(auth.accessToken).toEqual("accessToken");
      expect(auth.refreshToken).toEqual("refreshToken");
      expect(user.user).toEqual("UPDATED");
      expect(readLocalStorage("user")).toEqual({});
    });
  });
});

describe("Use default config for piniaLocalPersistedState", () => {
  beforeEach(() => {
    const app = createApp({});
    const pinia = createPinia();
    pinia.use(piniaPersist());
    app.use(pinia);
    setActivePinia(pinia);
  });

  describe("Persist state in local storage", async () => {
    const useAuthStore = defineStore<typeof keyStore, AuthStore>(keyStore, {
      state: () => ({ accessToken: undefined, refreshToken: undefined }),
    });

    it("persists store in localStorage", async () => {
      const auth = useAuthStore();
      auth.accessToken = "accessToken";
      await nextTick();
      expect(readLocalStorage(keyStorage)).toEqual(authData);
      expect(localStorage.setItem).toHaveBeenCalledWith(keyStorage, JSON.stringify(authData));
    });

    it("hydrates store from localStorage", async () => {
      initializeLocalStorage(keyStorage, authData);
      await nextTick();
      const auth = useAuthStore();
      expect(auth.accessToken).toEqual(authData.accessToken);
      expect(localStorage.getItem).toHaveBeenCalledWith(keyStorage);
    });
  });

  describe("Use setup syntax with persist options", () => {
    const useAuthStore = defineStore("auth", () => {
      const auth = ref<AuthStore>({ accessToken: undefined, refreshToken: undefined });
      return { auth };
    });
    it("persist state in local storage", async () => {
      const { auth } = useAuthStore();
      auth.accessToken = "accessToken";
      await nextTick();

      expect(readLocalStorage(keyStorage)).toStrictEqual(setupAuthData);
      expect(localStorage.setItem).toHaveBeenCalledWith(keyStorage, JSON.stringify(setupAuthData));
    });

    it("hydrate state from local storage", async () => {
      initializeLocalStorage(keyStorage, setupAuthData);
      await nextTick();
      const { auth } = useAuthStore();
      expect(auth.accessToken).toEqual(setupAuthData.auth.accessToken);
      expect(localStorage.getItem).toHaveBeenCalledWith(keyStorage);
    });

    it("Should restore manually", async () => {
      const { auth, $hydrate } = useAuthStore();
      localStorage.setItem(keyStorage, JSON.stringify(setupAuthData));
      await nextTick();
      expect(auth.accessToken).toEqual(undefined);
      $hydrate();
      await nextTick();
      expect(auth.accessToken).toEqual(setupAuthData.auth.accessToken);
    });
  });
});

function initializeLocalStorage(key: string, state: Record<string, unknown>): void {
  localStorage.clear();
  localStorage.setItem(key, JSON.stringify(state));
}

function readLocalStorage(key: string): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(key) ?? "{}");
}
