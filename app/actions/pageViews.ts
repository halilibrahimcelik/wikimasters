"use server";

import redis from "@/cache";
import { sendCelebrationEmail } from "@/email/celebration-email";

const keyFor = (id: number) => {
  return `pageViews:article${id}`;
};
const milestones = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800,
  900, 1000,
];
export const incrementPageViews = async (articleId: number) => {
  const key = keyFor(articleId);
  const newCount = await redis.incr(key);

  if (milestones.includes(newCount)) {
    console.log(
      `🎉 Article ${articleId} just hit ${newCount} page views! Sending celebration email...`,
    );
    await sendCelebrationEmail(articleId, newCount);
  } else {
    console.log(
      `Article ${articleId} page views incremented to ${newCount}. No email sent.`,
    );
  }
  return newCount;
};
