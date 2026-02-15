import { ArticlesList } from "@/components/features/wikicards/articles-list";
import { getArticlesFromDB } from "@/lib/data/articles";
import { articlesApi } from "@/lib/redux/features/articles/articlesApiSlice";
import { StoreProvider } from "@/lib/redux/provider";

/**
 * Example Server Component with SSR data prefetching
 * The articles are fetched on the server and cached in Redux on first render
 */
export default async function ArticlesPage() {
  // Fetch on server - this will be cached by Next.js

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">All Articles</h1>

      <ArticlesList />
    </div>
  );
}
