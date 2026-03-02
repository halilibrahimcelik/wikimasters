"use client";
import { useMemo } from "react";
import { useGetArticlesQuery } from "@/lib/redux/features/articles/articlesApiSlice";
import type { ArticleWikiData } from "@/types/api";
import WikiCard from "./wiki-card";

type Props = {
  serverData?: ArticleWikiData[];
};

export function ArticlesList({ serverData }: Props) {
  // Skip RTK Query if we have server data

  const {
    data: clientArticles,
    isLoading,
    error,
  } = useGetArticlesQuery(undefined, {
    skip: !!serverData,
  });

  // Use server data if available, otherwise use client data
  const articles = useMemo(() => {
    if (serverData) {
      return serverData;
    }
    return clientArticles || [];
  }, [serverData, clientArticles]);

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
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-8">All Articles</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <WikiCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
}
