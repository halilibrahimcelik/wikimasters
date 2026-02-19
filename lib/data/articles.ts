"use server";

import { desc, eq } from "drizzle-orm";
import redis from "@/cache";
import db from "@/db";
import { articles, usersSync } from "@/db/schema";

export async function getArticlesFromDB() {
  const cached = await redis.get("articles:all");
  if (cached) {
    console.log("🎯 Get Articles cache hit");
    return cached;
  }
  console.log("👻 cache miss for articles");
  try {
    const allArticles = await db
      .select({
        title: articles.title,
        id: articles.id,
        createdAt: articles.createdAt,
        content: articles.content,
        authorName: usersSync.name,
        imageUrl: articles.imageUrl,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
      .orderBy(desc(articles.updatedAt));
    await redis.set("articles:all", allArticles, {
      ex: 60, // Cache for 60 seconds
    });
    return allArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch articles");
  }
}

export async function getArticleByIdFromDB(id: string) {
  if (Number.isNaN(Number(id))) {
    return null; // Invalid ID format
  }
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
