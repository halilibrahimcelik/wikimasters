import WikiEditor from "@/components/features/wikicards/wiki-editor";
import { getArticleByIdFromDB } from "@/lib/data/articles";
import { stackServerApp } from "@/stack/server";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  await stackServerApp.getUser({ or: "redirect" });
  const article = await getArticleByIdFromDB(id);
  if (!article) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The article you are trying to edit does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="stagger-card">
      <WikiEditor
        initialTitle={article.title}
        initialContent={article.content}
        isEditing={true}
        articleId={id}
      />
    </div>
  );
}
