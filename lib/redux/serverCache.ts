import { getArticlesFromDB } from "@/lib/data/articles";
import { articlesApi } from "@/lib/redux/features/articles/articlesApiSlice";
import { makeStore } from "@/lib/redux/store";

/**
 * Server-side utility to prefetch articles and hydrate Redux store
 * Use this in Server Components to enable SSR caching
 */
export async function prefetchArticles() {
  const store = makeStore();

  try {
    // Fetch articles on server
    const articles = await getArticlesFromDB();

    // Manually dispatch the fulfilled action to hydrate the cache
    store.dispatch(
      articlesApi.util.upsertQueryData("getArticles", undefined, articles),
    );

    // Return serializable state for client hydration
    return {
      [articlesApi.reducerPath]: store.getState()[articlesApi.reducerPath],
    };
  } catch (error) {
    console.error("Failed to prefetch articles:", error);
    return undefined;
  }
}
