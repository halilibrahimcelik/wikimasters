import type { Metadata } from "next";
import WikiArticleViewer from "@/components/features/wikicards/wiki-article-viewer";
import { authorizeUserToEditArticle } from "@/db/authz";
import { getArticleByIdFromDB } from "@/lib/data/articles";
import { stripMarkdown } from "@/lib/utils";
import { stackServerApp } from "@/stack/server";

interface ViewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ViewArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleByIdFromDB(id);

  if (!article) {
    return {
      title: "Article Not Found | WikiMasters",
      description: "The article you are looking for does not exist.",
    };
  }

  const description = stripMarkdown(article.content);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://wikimasters.com";
  const articleUrl = `${BASE_URL}/wiki/${id}`;

  const images = article.imageUrl
    ? [{ url: article.imageUrl, width: 1200, height: 630, alt: article.title }]
    : undefined;

  return {
    title: `${article.title} | WikiMasters`,
    description,
    openGraph: {
      title: article.title,
      description,
      url: articleUrl,
      siteName: "WikiMasters",
      type: "article",
      publishedTime: article.createdAt ?? undefined,
      authors: article.authorName ? [article.authorName] : undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
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
