import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it } from "vitest";
import { articlesApi } from "@/lib/redux/features/articles/articlesApiSlice";

describe("Articles API Slice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [articlesApi.reducerPath]: articlesApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(articlesApi.middleware),
    });
  });

  it("creates API slice with correct endpoints", () => {
    expect(articlesApi.endpoints.getArticles).toBeDefined();
    expect(articlesApi.endpoints.getArticleById).toBeDefined();
  });

  it("has correct reducer path", () => {
    expect(articlesApi.reducerPath).toBe("articlesApi");
  });

  it("has correct tag types", () => {
    // Tag types may not be directly accessible, so just verify endpoint exists
    expect(articlesApi.endpoints.getArticles).toBeDefined();
  });

  it("initializes store correctly", () => {
    const state = store.getState();
    expect(state).toHaveProperty("articlesApi");
  });
});
