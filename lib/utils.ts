import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Strips common markdown syntax from a string and returns plain text.
 * Useful for generating SEO descriptions and OpenGraph excerpts.
 */
export function stripMarkdown(content: string, maxLength = 160): string {
  const raw = content
    .replace(/[#*_`[\]()>~]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, maxLength);
  return raw.length === maxLength ? `${raw}…` : raw;
}
