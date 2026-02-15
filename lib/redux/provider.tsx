"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { type AppStore, makeStore } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
  preloadedState?: Partial<ReturnType<AppStore["getState"]>>;
}

export function StoreProvider({
  children,
  preloadedState,
}: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    // Hydrate preloaded state if provided
    if (preloadedState) {
      // RTK Query will automatically hydrate from server data
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
