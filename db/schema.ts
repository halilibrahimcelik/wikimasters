import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
export const usersSync = pgTable("usersSync", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  authorId: text("author_id")
    .notNull()
    .references(() => usersSync.id)
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  published: boolean("published").default(false),
});

const schema = { articles };
export default schema;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type User = typeof usersSync.$inferSelect;
