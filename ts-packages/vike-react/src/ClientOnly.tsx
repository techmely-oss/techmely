import {
  type ComponentType,
  type ReactNode,
  lazy,
  startTransition,
  useEffect,
  useState,
} from "react";

export function ClientOnly<T>({
  load,
  children,
  fallback,
  deps = [],
}: {
  load: () => Promise<{ default: ComponentType<T> } | ComponentType<T>>;
  children: (Component: ComponentType<T>) => ReactNode;
  fallback: ReactNode;
  deps?: Parameters<typeof useEffect>[1];
}) {
  const [Component, setComponent] = useState<ComponentType<unknown> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need this
  useEffect(() => {
    const loadComponent = () => {
      const Component = lazy(() =>
        // @ts-expect-error I knew ok
        load()
          .then((LoadedComponent) => {
            return {
              default: () =>
                children("default" in LoadedComponent ? LoadedComponent.default : LoadedComponent),
            };
          })
          .catch((error) => {
            console.error("Component loading failed:", error);
            return { default: () => <p>Error loading component.</p> };
          }),
      );
      setComponent(Component);
    };

    startTransition(() => {
      loadComponent();
    });
  }, deps);

  return Component ? <Component /> : fallback;
}
