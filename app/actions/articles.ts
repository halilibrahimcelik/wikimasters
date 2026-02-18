"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import db from "@/db";
import { authorizeUserToEditArticle } from "@/db/authz";
import { articles } from "@/db/schema";
import { ensureUserExist } from "@/db/sync-user";
import { stackServerApp } from "@/stack/server";

export type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  await ensureUserExist(user);

  const slug = generateSlug(data.title);

  const [newArticle] = await db
    .insert(articles)
    .values({
      title: data.title,
      content: data.content,
      slug,
      authorId: user.id,
      imageUrl: data.imageUrl ?? undefined,
      published: true,
    })
    .returning();

  return { success: true, article: newArticle };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const isUserAuthorized = await authorizeUserToEditArticle(user.id, id);
  if (!isUserAuthorized) {
    throw new Error(
      "Forbidden: You do not have permission to edit this article",
    );
  }

  const updateData: UpdateArticleInput & { updatedAt: string; slug?: string } =
    {
      ...data,
      updatedAt: new Date().toISOString(),
    };

  if (data.title) {
    updateData.slug = generateSlug(data.title);
  }

  await db
    .update(articles)
    .set(updateData)
    .where(eq(articles.id, Number(id)));

  return { success: true, message: `Article ${id} updated successfully` };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const isUserAuthorized = await authorizeUserToEditArticle(user.id, id);
  if (!isUserAuthorized) {
    throw new Error(
      "Forbidden: You do not have permission to delete this article",
    );
  }
  await db.delete(articles).where(eq(articles.id, Number(id)));

  return { success: true, message: `Article ${id} deleted successfully` };
}

// Form-friendly server action: accepts FormData from a client form and calls deleteArticle
export async function deleteArticleForm(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing article id");
  }

  await deleteArticle(String(id));

  // After deleting, redirect the user back to the homepage.
  redirect("/");
}
