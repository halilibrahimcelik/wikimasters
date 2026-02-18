"use server";

import redis from "@/cache";

const keyFor = (id: number) => {
  return `pageViews:article${id}`;
};

export const incrementPageViews = async (articleId: number) => {
  const key = keyFor(articleId);
  const newVal = await redis.incr(key);
  return +newVal;
};
