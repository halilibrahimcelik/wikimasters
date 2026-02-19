import { configureStore } from "@reduxjs/toolkit";
import { articlesApi } from "./features/articles/articlesApiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [articlesApi.reducerPath]: articlesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(articlesApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
