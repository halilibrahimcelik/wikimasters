import WikiArticleViewer from "@/components/features/wikicards/wiki-article-viewer";
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
  await stackServerApp.getUser({ or: "redirect" });
  // Mock permission check - in a real app, this would come from auth/user context
  const canEdit = true; // Set to true for demonstration
  const article = await getArticleByIdFromDB(id);

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
