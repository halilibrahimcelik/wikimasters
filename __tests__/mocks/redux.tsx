import { ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";

export function createTestStore() {
  return makeStore();
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
}
