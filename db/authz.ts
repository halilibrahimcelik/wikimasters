import { eq } from "drizzle-orm";
import db from "@/db";
import { articles } from "@/db/schema";

export const authorizeUserToEditArticle = async (
  loggedUserId: string,
  articleId: string,
) => {
  const response = await db
    .select({
      authorId: articles.authorId,
    })
    .from(articles)
    .where(eq(articles.id, +articleId));
  if (!response.length) {
    return false;
  }

  return response[0].authorId === loggedUserId;
};
