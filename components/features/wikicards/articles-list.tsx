"use client";

import { useGetArticlesQuery } from "@/lib/redux/features/articles/articlesApiSlice";
import WikiCard from "./wiki-card";

export function ArticlesList() {
  const { data: articles, isLoading, error } = useGetArticlesQuery();
  if (isLoading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load articles
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No articles found
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <WikiCard key={article.id} {...article} />
      ))}
    </div>
  );
}
