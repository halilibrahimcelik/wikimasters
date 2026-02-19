import { eq } from "drizzle-orm";
import db from "@/db";
import { articles, usersSync } from "@/db/schema";
import resend from "@/email";
import CelebrationTemplate from "@/email/templates/celebration-templates";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const sendCelebrationEmail = async (
  articleId: number,
  pageViews: number,
) => {
  const response = await db
    .select({
      email: usersSync.email,
      id: usersSync.id,
      title: articles.title,
      name: usersSync.name,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, articleId));

  const { email, id, title, name } = response[0];
  if (!email) {
    console.log("❌ No email found for user with ID:", id);
    return;
  }
  const emailRes = await resend.emails.send({
    from: "WikiMasters <noreply@pennytracker.xyz>",
    to: email,
    subject: "🎉 Congratulations on Your Article's Milestone! 🎉",
    react: (
      <CelebrationTemplate
        name={name || "Unknown Author"}
        articleTitle={title || ""}
        pageviews={pageViews}
        articleUrl={`${BASE_URL}/wiki/${articleId}`}
      />
    ),
  });
  if (!emailRes.error) {
    console.log("✅ Celebration email sent successfully to:", email);
    console.log(
      `${pageViews} page views is a great milestone for your article! Keep up the fantastic work! 🚀`,
    );
  } else {
    console.log("❌ Failed to send celebration email to:", email);
  }
};
