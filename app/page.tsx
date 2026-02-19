import { ArticlesList } from "@/components/features/wikicards/articles-list";
import { getArticlesFromDB } from "@/lib/data/articles";
import { ArticleWikiData } from "@/types/api";

export default async function ArticlesPage() {
  const articles = (await getArticlesFromDB()) as ArticleWikiData[]; // Type assertion to ArticleWikiData[]

  return (
    <div className="container mx-auto py-8">
      <ArticlesList serverData={articles} />
    </div>
  );
}
