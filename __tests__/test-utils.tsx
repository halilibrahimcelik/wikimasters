import { RenderOptions, render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof makeStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = makeStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactElement }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }), store };
}

export type { RenderResult } from "@testing-library/react";
export { fireEvent, screen, waitFor } from "@testing-library/react";
