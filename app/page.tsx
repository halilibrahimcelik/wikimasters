import { ArticlesList } from "@/components/features/wikicards/articles-list";
import { getArticlesFromDB } from "@/lib/data/articles";

export default async function ArticlesPage() {
  const articles = await getArticlesFromDB();

  return (
    <div className="container mx-auto py-8">
      <ArticlesList serverData={articles} />
    </div>
  );
}
