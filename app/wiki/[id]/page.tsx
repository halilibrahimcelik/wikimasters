import WikiArticleViewer from "@/components/features/wikicards/wiki-article-viewer";
import { authorizeUserToEditArticle } from "@/db/authz";
import { getArticleByIdFromDB } from "@/lib/data/articles";
import { stackServerApp } from "@/stack/server";

interface ViewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params;
  const user = await stackServerApp.getUser({ or: "redirect" });
  const userId = user.id;
  const [article, canEdit] = await Promise.all([
    getArticleByIdFromDB(id),
    authorizeUserToEditArticle(userId, id),
  ]);

  if (!article) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The article you are looking for does not exist.
        </p>
      </div>
    );
  }

  return <WikiArticleViewer article={article} canEdit={canEdit} />;
}
