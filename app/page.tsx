import { ArticlesList } from "@/components/features/wikicards/articles-list";
import { getArticlesFromDB } from "@/lib/data/articles";

export default async function ArticlesPage() {
  const articles = await getArticlesFromDB();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">All Articles</h1>

      <ArticlesList serverData={articles} />
    </div>
  );
}
