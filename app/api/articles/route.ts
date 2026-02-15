import { NextResponse } from "next/server";
import { getArticlesFromDB } from "@/lib/data/articles";

export async function GET() {
  try {
    const articles = await getArticlesFromDB();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
