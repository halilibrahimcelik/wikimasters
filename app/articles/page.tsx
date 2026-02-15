import { ArticlesList } from "@/components/features/wikicards/articles-list";
import { getArticlesFromDB } from "@/lib/data/articles";
import { articlesApi } from "@/lib/redux/features/articles/articlesApiSlice";

/**
 * Example Server Component with SSR data prefetching
 * The articles are fetched on the server and cached in Redux on first render
 */
export default async function ArticlesPage() {
  // Fetch on server - this will be cached by Next.js
  const articles = await getArticlesFromDB();

  // Prepare hydration data for Redux
  const preloadedState = {
    [articlesApi.reducerPath]: {
      queries: {
        "getArticles(undefined)": {
          status: "fulfilled",
          endpointName: "getArticles",
          requestId: "server",
          data: articles,
          fulfilledTimeStamp: Date.now(),
        },
      },
      mutations: {},
      provided: {},
      subscriptions: {},
      config: {
        online: true,
        focused: true,
        middlewareRegistered: true,
        refetchOnFocus: false,
        refetchOnReconnect: false,
        refetchOnMountOrArgChange: false,
        keepUnusedDataFor: 60,
        reducerPath: articlesApi.reducerPath,
      },
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">All Articles</h1>
      <ArticlesList articles={articles} />
    </div>
  );
}
