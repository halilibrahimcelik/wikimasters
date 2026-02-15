"use server";

import { eq } from "drizzle-orm";
import db from "@/db";
import { articles, usersSync } from "@/db/schema";

export async function getArticlesFromDB() {
  try {
    const allArticles = await db
      .select({
        title: articles.title,
        id: articles.id,
        createdAt: articles.createdAt,
        content: articles.content,
        authorName: usersSync.name,
        imageUrl: articles.imageUrl,
      })
      .from(articles)
      .leftJoin(usersSync, eq(articles.authorId, usersSync.id));
    return allArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch articles");
  }
}

export async function getArticleByIdFromDB(id: string) {
  try {
    const article = await db
      .select({
        title: articles.title,
        id: articles.id,
        createdAt: articles.createdAt,
        content: articles.content,
        authorName: usersSync.name,
        imageUrl: articles.imageUrl,
      })
      .from(articles)
      .where(eq(articles.id, Number(id)))
      .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
      .limit(1);

    if (article.length === 0) {
      return null; // Article not found
    }

    return article[0];
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}
